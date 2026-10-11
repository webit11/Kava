import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Check, ShieldCheck, Sparkles, CreditCard, Tag, ArrowRight, Zap, 
  Lock, AlertCircle, Clock, Gift, Star, QrCode, Building2, Wallet, 
  Copy, ExternalLink, CheckCircle2, RefreshCw, Smartphone
} from 'lucide-react';
import { SubscriptionPlan, PromotionItem, UserSubscriptionState } from '../types';
import { 
  getStoredPlans, getStoredPromotions, saveStoredPromotions, getUserSubscription, saveUserSubscription,
  getStoredCurrency, getPlanPricesForCurrency, formatCurrencyAmount,
  getStoredReceiptSettings, saveStoredReceiptSettings, addBillingLog, getStoredInvoices, saveStoredInvoices
} from '../lib/billing';
import { MidtransPaymentType, MidtransTransactionRecord, MIDTRANS_PAYMENT_METHODS } from '../lib/midtransTypes';
import CurrencySelector from './CurrencySelector';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanId?: string;
  initialBillingCycle?: 'monthly' | 'yearly';
  triggerReason?: string;
  onSuccess?: (newPlan: SubscriptionPlan) => void;
  triggerToast?: (title: string, desc: string, type?: 'success' | 'info' | 'error') => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  selectedPlanId = 'Premium',
  initialBillingCycle = 'yearly',
  triggerReason,
  onSuccess,
  triggerToast
}: CheckoutModalProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(getStoredPlans);
  const [promotions, setPromotions] = useState<PromotionItem[]>(getStoredPromotions);
  const [currentPlanId, setCurrentPlanId] = useState<string>(selectedPlanId);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(initialBillingCycle);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<PromotionItem | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>(getStoredCurrency);
  
  // Midtrans Payment state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<MidtransPaymentType>('bca_va');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [midtransConfig, setMidtransConfig] = useState<any>(null);
  const [activeTxnRecord, setActiveTxnRecord] = useState<MidtransTransactionRecord | null>(null);
  const [paymentStep, setPaymentStep] = useState<'select' | 'midtrans_screen' | 'success'>('select');
  const [copiedVa, setCopiedVa] = useState<boolean>(false);

  // Customer form details
  const [customerInfo, setCustomerInfo] = useState(() => {
    let email = 'guest.host@kava.app';
    let name = 'Sofia Rodriguez';
    try {
      const savedUser = localStorage.getItem('kava_active_user');
      if (savedUser) {
        const uObj = JSON.parse(savedUser);
        if (uObj.email) email = uObj.email;
        if (uObj.name) name = uObj.name;
      }
    } catch (e) {
      // ignore
    }
    return { name, email };
  });

  // Fetch Midtrans config on open
  useEffect(() => {
    setPlans(getStoredPlans());
    setPromotions(getStoredPromotions());
    setSelectedCurrency(getStoredCurrency());

    fetch('/api/midtrans/config')
      .then(res => res.json())
      .then(data => setMidtransConfig(data))
      .catch(err => console.warn('Could not load Midtrans config:', err));
  }, [isOpen]);

  useEffect(() => {
    if (selectedPlanId) {
      setCurrentPlanId(selectedPlanId);
    }
  }, [selectedPlanId]);

  if (!isOpen) return null;

  const targetPlan = plans.find(p => p.id === currentPlanId) || plans.find(p => p.id === 'Premium') || plans[0];
  const userSub = getUserSubscription();

  // Price calculations
  const currPrices = getPlanPricesForCurrency(targetPlan, selectedCurrency);
  const basePrice = billingCycle === 'yearly' ? currPrices.yearly : currPrices.monthly;
  const isFree = targetPlan.monthlyPrice === 0 && targetPlan.yearlyPrice === 0;

  let discountAmount = 0;
  if (appliedPromo && !isFree) {
    if (appliedPromo.discountType === 'percentage') {
      discountAmount = Math.round((basePrice * appliedPromo.discountValue) / 100);
    } else {
      const usdPrices = getPlanPricesForCurrency(targetPlan, 'USD');
      const usdBase = billingCycle === 'yearly' ? usdPrices.yearly : usdPrices.monthly;
      const ratio = usdBase > 0 ? basePrice / usdBase : 1;
      discountAmount = Math.min(basePrice, Math.round(appliedPromo.discountValue * ratio));
    }
  }

  const finalPrice = Math.max(0, basePrice - discountAmount);

  // Apply Coupon Handler
  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCouponError('');

    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const codeUpper = couponCode.trim().toUpperCase();
    const matched = promotions.find(p => p.code.toUpperCase() === codeUpper && p.active);

    if (!matched) {
      setCouponError('Invalid or expired promotional code.');
      return;
    }

    if (!matched.targetPlans.includes('all') && !matched.targetPlans.includes(targetPlan.id)) {
      setCouponError(`This code applies only to ${matched.targetPlans.join(', ')} plans.`);
      return;
    }

    setAppliedPromo(matched);
    if (triggerToast) {
      triggerToast('Promotion Applied!', `Applied "${matched.name}" (${matched.discountType === 'percentage' ? `${matched.discountValue}% OFF` : `$${matched.discountValue} OFF`}).`, 'success');
    }
  };

  // Initiate Midtrans Payment
  const handleInitiateMidtrans = async () => {
    setIsProcessing(true);

    try {
      const res = await fetch('/api/midtrans/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: targetPlan.id,
          planName: targetPlan.name,
          billingCycle,
          amount: finalPrice,
          currency: selectedCurrency,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          promoCode: appliedPromo?.code,
          paymentTypePreference: selectedPaymentMethod
        })
      });

      const data = await res.json();
      setIsProcessing(false);

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to initialize Midtrans transaction');
      }

      setActiveTxnRecord(data.transactionRecord);
      setPaymentStep('midtrans_screen');

      // Attempt Midtrans Snap JS call if Snap token and client script present
      if (typeof window !== 'undefined' && (window as any).snap && data.snapToken && !data.snapToken.startsWith('SNAP-SIM-')) {
        try {
          (window as any).snap.pay(data.snapToken, {
            onSuccess: (result: any) => handleFinalizeSettlement(data.transactionRecord.orderId, result),
            onPending: (result: any) => handleSetPendingStatus(data.transactionRecord.orderId, result),
            onError: (result: any) => {
              if (triggerToast) triggerToast('Payment Error', 'Midtrans transaction encountered an error.', 'error');
            },
            onClose: () => {
              // Stay on midtrans_screen for manual simulation option
            }
          });
        } catch (e) {
          console.warn('Snap JS pay failed to invoke:', e);
        }
      }

      // Record initial pending subscription state in localStorage
      const pendingSub: UserSubscriptionState = {
        planId: userSub.planId || 'Free', // user stays on existing plan until payment confirmed
        billingCycle,
        status: 'pending',
        startDate: new Date().toISOString(),
        renewalDate: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 86400000).toISOString(),
        appliedCoupon: appliedPromo ? appliedPromo.code : undefined,
        customStorageGb: targetPlan.storageQuotaGb
      };
      saveUserSubscription(pendingSub);

    } catch (err: any) {
      setIsProcessing(false);
      console.error('Midtrans initiation error:', err);
      if (triggerToast) {
        triggerToast('Payment Error', err.message || 'Could not initiate Midtrans checkout.', 'error');
      }
    }
  };

  // Simulate Payment Settlement Handler (for sandbox / testing)
  const handleSimulatePaymentConfirmation = async () => {
    if (!activeTxnRecord) return;
    setIsProcessing(true);

    try {
      const res = await fetch('/api/midtrans/simulate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: activeTxnRecord.orderId,
          status: 'settlement',
          paymentType: selectedPaymentMethod
        })
      });

      const data = await res.json();
      setIsProcessing(false);

      if (res.ok && data.status === 'OK') {
        handleFinalizeSettlement(activeTxnRecord.orderId);
      } else {
        throw new Error(data.error || 'Failed to simulate payment');
      }
    } catch (err: any) {
      setIsProcessing(false);
      if (triggerToast) {
        triggerToast('Simulation Error', err.message || 'Failed to simulate payment', 'error');
      }
    }
  };

  // Finalize Settlement (Activates Subscription & Generates Paid Invoice)
  const handleFinalizeSettlement = (orderId: string, midtransResult?: any) => {
    // 1. Update Subscription Status to ACTIVE
    const updatedSub: UserSubscriptionState = {
      planId: targetPlan.id,
      billingCycle,
      status: 'active',
      startDate: new Date().toISOString(),
      renewalDate: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 86400000).toISOString(),
      appliedCoupon: appliedPromo ? appliedPromo.code : undefined,
      customStorageGb: targetPlan.storageQuotaGb
    };
    saveUserSubscription(updatedSub);

    // 2. Synchronize user and workspace plan ID in localStorage
    try {
      const savedActiveUser = localStorage.getItem('kava_active_user');
      if (savedActiveUser) {
        const uObj = JSON.parse(savedActiveUser);
        uObj.plan = targetPlan.id;
        localStorage.setItem('kava_active_user', JSON.stringify(uObj));
      }

      const savedUsers = localStorage.getItem('kava_admin_users');
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);
        const updated = parsed.map((u: any) => 
          (customerInfo.email && u.email === customerInfo.email) || u.role === 'Workspace Owner'
            ? { ...u, plan: targetPlan.id }
            : u
        );
        localStorage.setItem('kava_admin_users', JSON.stringify(updated));
      }

      const savedWorkspaces = localStorage.getItem('kava_admin_workspaces');
      if (savedWorkspaces) {
        const parsed = JSON.parse(savedWorkspaces);
        const updated = parsed.map((ws: any) => ({
          ...ws,
          plan: targetPlan.id,
          maxStorageMB: targetPlan.storageQuotaGb * 1024,
          billingStatus: 'Paid'
        }));
        localStorage.setItem('kava_admin_workspaces', JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Error updating user plan:', e);
    }

    // 3. Generate Official KavaInvoice
    try {
      const settings = getStoredReceiptSettings();
      const year = new Date().getFullYear();
      const seq = settings.nextSequenceNumber || 10042;
      const invoiceId = settings.invoiceNumberFormat
        ? settings.invoiceNumberFormat.replace('YYYY', String(year)).replace('XXXXX', String(seq).padStart(5, '0'))
        : `${settings.invoicePrefix || 'INV-'}${year}-${seq}`;

      saveStoredReceiptSettings({
        ...settings,
        nextSequenceNumber: seq + 1
      });

      const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const methodLabel = MIDTRANS_PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod)?.name || selectedPaymentMethod.toUpperCase();

      const baseSubtotal = basePrice;
      let taxVal = 0;
      if (settings.enableTax && settings.taxRatePercent > 0) {
        taxVal = Math.round(((baseSubtotal - discountAmount) * settings.taxRatePercent) / 100);
      }

      const totalVal = Math.max(0, baseSubtotal - discountAmount + taxVal);

      const startDate = new Date();
      const endDate = new Date();
      if (billingCycle === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      const activeWsName = (typeof localStorage !== 'undefined' && localStorage.getItem('kava_workspace_name')) || 'Personal Workspace';

      const newInvoice = {
        id: invoiceId,
        workspaceId: `ws-${Date.now()}`,
        workspaceName: activeWsName,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        planId: targetPlan.id,
        planName: targetPlan.name,
        billingCycle,
        amount: formatCurrencyAmount(totalVal, selectedCurrency),
        amountRaw: totalVal,
        currency: selectedCurrency,
        subtotal: baseSubtotal,
        taxAmount: taxVal,
        discountAmount,
        discountCode: appliedPromo?.code,
        status: 'Paid' as const,
        paymentMethod: `Midtrans (${methodLabel})`,
        transactionId: orderId,
        issueDate: formattedDate,
        timestamp: Date.now(),
        billingPeriodStart: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        billingPeriodEnd: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        date: formattedDate
      };

      const existingInvoices = getStoredInvoices();
      saveStoredInvoices([newInvoice, ...existingInvoices]);

      addBillingLog({
        action: 'Midtrans Payment Settled',
        adminEmail: customerInfo.email,
        workspaceName: activeWsName,
        invoiceId: newInvoice.id,
        amount: newInvoice.amount,
        details: `Midtrans payment confirmed for ${targetPlan.name} (${billingCycle}). Order ID: ${orderId}`,
        status: 'Success'
      });
    } catch (e) {
      console.error('Error saving invoice:', e);
    }

    // 4. Update Promo Code metric
    if (appliedPromo) {
      try {
        const storedPromos = getStoredPromotions();
        const updatedPromos = storedPromos.map(p => {
          if (p.id === appliedPromo.id || p.code.toUpperCase() === appliedPromo.code.toUpperCase()) {
            return { ...p, usedCount: (p.usedCount || 0) + 1 };
          }
          return p;
        });
        saveStoredPromotions(updatedPromos);
      } catch (e) {
        console.error('Error updating promo code metrics:', e);
      }
    }

    // 5. Broadcast real-time events
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('kava_plans_updated'));
    window.dispatchEvent(new CustomEvent('kava_active_user_updated'));
    window.dispatchEvent(new CustomEvent('kava_subscription_updated'));
    window.dispatchEvent(new CustomEvent('kava_invoices_updated'));

    if (triggerToast) {
      triggerToast(
        'Subscription Activated!', 
        `Payment verified via Midtrans! Upgraded to ${targetPlan.name} with ${targetPlan.storageQuotaGb}GB storage vault.`, 
        'success'
      );
    }

    if (onSuccess) {
      onSuccess(targetPlan);
    }

    setPaymentStep('success');
  };

  const handleSetPendingStatus = (orderId: string, midtransResult?: any) => {
    if (triggerToast) {
      triggerToast('Awaiting Payment', `Midtrans transaction ${orderId} is pending payment confirmation.`, 'info');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVa(true);
    setTimeout(() => setCopiedVa(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white border border-slate-200 rounded-[32px] shadow-2xl max-w-4xl w-full overflow-hidden text-left my-8 relative"
      >
        {/* Header bar */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex items-start justify-between border-b border-slate-800 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase">
                Midtrans Payment Gateway
              </span>
              {triggerReason && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                  {triggerReason}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black font-sans text-white tracking-tight">
              {paymentStep === 'success' ? 'Subscription Confirmed!' : 'Upgrade Your KAVA Subscription'}
            </h2>
            <p className="text-xs text-slate-300 font-light max-w-lg">
              {paymentStep === 'success' 
                ? 'Your account has been upgraded with instant access to all premium event studio capabilities.' 
                : 'Supported via Midtrans: Virtual Accounts (BCA, Mandiri, BNI, BRI, Permata), QRIS, GoPay, ShopeePay & Credit Cards.'}
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentStep === 'success' ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-6 max-w-lg mx-auto py-12">
            <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Payment Confirmed!</h3>
              <p className="text-sm text-slate-600">
                Your workspace is now upgraded to <strong className="text-slate-900">{targetPlan.name}</strong> ({billingCycle}).
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-left">
              <div className="flex justify-between text-slate-500">
                <span>Order ID:</span>
                <span className="font-mono font-bold text-slate-800">{activeTxnRecord?.orderId}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Plan Level:</span>
                <span className="font-bold text-slate-800">{targetPlan.name} ({targetPlan.storageQuotaGb}GB Storage)</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment Method:</span>
                <span className="font-bold text-slate-800">Midtrans ({MIDTRANS_PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod)?.name})</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Subscription Status:</span>
                <span className="font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">ACTIVE</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-2xl transition-all shadow-md cursor-pointer"
            >
              Continue to Workspace Dashboard
            </button>
          </div>
        ) : paymentStep === 'midtrans_screen' && activeTxnRecord ? (
          /* Midtrans Payment Screen / Simulator Drawer */
          <div className="p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">ORDER ID</span>
                  <span className="text-sm font-mono font-black text-amber-400">{activeTxnRecord.orderId}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">TOTAL AMOUNT DUE</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    Rp {activeTxnRecord.grossAmountIdr.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Payment Details based on selected method */}
              {(selectedPaymentMethod.includes('va') || selectedPaymentMethod === 'bank_transfer') && (
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-amber-400" />
                      <span className="text-xs font-bold text-slate-200">
                        {MIDTRANS_PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod)?.name}
                      </span>
                    </div>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 font-mono px-2 py-0.5 rounded-md font-bold">
                      AWAITING TRANSFER
                    </span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg flex items-center justify-between border border-slate-700">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">VIRTUAL ACCOUNT NUMBER</span>
                      <span className="text-base font-mono font-bold tracking-widest text-white">
                        {activeTxnRecord.vaNumber || '8801928374921'}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(activeTxnRecord.vaNumber || '8801928374921')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-md border border-slate-600 flex items-center space-x-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>{copiedVa ? 'Copied!' : 'Copy VA'}</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-400 font-sans space-y-1">
                    <p>1. Open your m-Banking or ATM app (BCA Mobile, Livin, BNI, BRImo, Permata).</p>
                    <p>2. Select <strong>Transfer &gt; Virtual Account</strong> and paste the number above.</p>
                    <p>3. Confirm amount <strong>Rp {activeTxnRecord.grossAmountIdr.toLocaleString('id-ID')}</strong> and enter your PIN.</p>
                  </div>
                </div>
              )}

              {(selectedPaymentMethod === 'qris' || selectedPaymentMethod === 'gopay' || selectedPaymentMethod === 'shopeepay') && (
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 space-y-3 text-center">
                  <div className="flex items-center justify-center space-x-2 text-amber-400 font-bold text-xs">
                    <QrCode className="w-5 h-5" />
                    <span>Scan QRIS Code or Open E-Wallet</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl inline-block shadow-md">
                    <img 
                      src={activeTxnRecord.qrisUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MIDTRANS-QRIS-${activeTxnRecord.orderId}`} 
                      alt="QRIS Code" 
                      className="w-48 h-48 mx-auto"
                    />
                  </div>

                  <p className="text-[11px] text-slate-300">
                    Scan with GoPay, OVO, Dana, LinkAja, ShopeePay, or any Mobile Banking App.
                  </p>
                </div>
              )}

              {selectedPaymentMethod === 'credit_card' && (
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold">
                    <CreditCard className="w-5 h-5" />
                    <span>Midtrans 3D Secure Card Verification</span>
                  </div>
                  <p className="text-slate-300">
                    A credit card verification popup has been dispatched via Midtrans Snap API.
                  </p>
                </div>
              )}
            </div>

            {/* Sandbox Simulation / Verification Actions */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Midtrans Sandbox Test Controller</span>
              </div>
              <p className="text-xs text-amber-800">
                To complete end-to-end testing without making a real bank transfer, click below to simulate an instant Midtrans Webhook Notification settlement event.
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleSimulatePaymentConfirmation}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Simulate Webhook Settlement (Confirm Paid)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setPaymentStep('select')}
                  className="px-4 py-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Change Payment Method
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Method Selection & Checkout Step */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            {/* Left Side: Plan Selector & Features (7 cols) */}
            <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
              
              {/* Monthly / Yearly Toggle & Currency Switcher */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="bg-slate-100/90 border border-slate-200/80 p-1 rounded-xl flex items-center h-10 flex-1 w-full">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`h-full flex-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                      billingCycle === 'monthly' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`h-full flex-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      billingCycle === 'yearly' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Yearly Billing</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none ${
                        billingCycle === 'yearly' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Save 20%
                    </span>
                  </button>
                </div>

                <CurrencySelector
                  currentCurrency={selectedCurrency}
                  onCurrencyChange={setSelectedCurrency}
                  className="w-full sm:w-auto h-10"
                />
              </div>

              {/* Plan Cards */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Select Target Tier</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {plans.filter(p => !p.archived && p.active).map(plan => {
                    const isSelected = plan.id === currentPlanId;
                    const planPrices = getPlanPricesForCurrency(plan, selectedCurrency);
                    const priceVal = billingCycle === 'yearly' ? planPrices.yearly : planPrices.monthly;
                    const formattedPlanPrice = formatCurrencyAmount(priceVal, selectedCurrency);
                    
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setCurrentPlanId(plan.id)}
                        className={`w-full p-4 rounded-2xl border text-left transition-all relative flex items-center justify-between cursor-pointer ${
                          isSelected 
                            ? 'border-slate-900 bg-slate-100/60 ring-2 ring-slate-900/10 shadow-xs' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-sm text-slate-900">{plan.name}</span>
                            {plan.isPopular && (
                              <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                                {plan.popularBadgeText || 'POPULAR'}
                              </span>
                            )}
                            {plan.id === userSub.planId && (
                              <span className="bg-slate-100 text-slate-600 text-[9px] font-mono px-2 py-0.5 rounded-full">
                                CURRENT PLAN
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {plan.storageQuotaGb}GB Storage • Up to {plan.maxGuestsPerEvent} Guests • {plan.exportQuality} Quality
                          </p>
                        </div>

                        <div className="text-right">
                          {plan.monthlyPrice === 0 && plan.yearlyPrice === 0 ? (
                            <span className="text-base font-black text-slate-900">FREE</span>
                          ) : (
                            <div>
                              <span className="text-lg font-black text-slate-900">{formattedPlanPrice}</span>
                              <span className="text-[10px] text-slate-400 font-mono block">
                                /{billingCycle === 'yearly' ? 'year' : 'month'}
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Plan Features */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-black text-slate-900 font-sans flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Included in {targetPlan.name}</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{targetPlan.storageQuotaGb}GB Digital Vault</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Up to {targetPlan.maxGuestsPerEvent} Guests</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className={`${targetPlan.liveScreenAvailable ? 'text-emerald-600' : 'text-slate-300'} w-3.5 h-3.5 shrink-0`} />
                    <span className={targetPlan.liveScreenAvailable ? '' : 'line-through text-slate-400'}>Live Projector Screen</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className={`${targetPlan.customBranding ? 'text-emerald-600' : 'text-slate-300'} w-3.5 h-3.5 shrink-0`} />
                    <span className={targetPlan.customBranding ? '' : 'line-through text-slate-400'}>Custom Branding</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Side: Midtrans Options, Coupon & Submit (5 cols) */}
            <div className="md:col-span-5 p-6 sm:p-8 space-y-6 bg-slate-50/50">
              
              {/* Promo Code Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 font-mono uppercase tracking-wider flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-800" />
                  <span>Promotional Coupon Code</span>
                </label>
                
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. WELCOME20"
                    className="flex-1 bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-xl px-3.5 py-2 text-xs font-mono uppercase font-bold text-slate-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {couponError && (
                  <p className="text-[11px] text-rose-600 font-medium flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{couponError}</span>
                  </p>
                )}

                {appliedPromo && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-800 font-bold">
                    <div className="flex items-center space-x-1.5">
                      <Gift className="w-4 h-4 text-emerald-600" />
                      <span>{appliedPromo.name} ({appliedPromo.code})</span>
                    </div>
                    <button
                      onClick={() => setAppliedPromo(null)}
                      className="text-[10px] text-emerald-700 hover:underline font-mono"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Order Summary */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{targetPlan.name} ({billingCycle})</span>
                  <span className="font-bold text-slate-900">{formatCurrencyAmount(basePrice, selectedCurrency)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span>-{formatCurrencyAmount(discountAmount, selectedCurrency)}</span>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Due Today</span>
                  <span className="text-base text-slate-900">{formatCurrencyAmount(finalPrice, selectedCurrency)}</span>
                </div>
              </div>

              {/* Midtrans Payment Method Choice */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 font-mono uppercase tracking-wider flex items-center justify-between">
                  <span>Midtrans Payment Method</span>
                  <span className="text-[10px] text-emerald-600 font-normal">Auto-Verified</span>
                </label>

                <div className="grid grid-cols-1 gap-2">
                  {MIDTRANS_PAYMENT_METHODS.map((pm) => {
                    const isSel = selectedPaymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setSelectedPaymentMethod(pm.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSel 
                            ? 'border-slate-900 bg-slate-900 text-white shadow-sm' 
                            : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          {pm.category === 'va' && <Building2 className={`w-4 h-4 ${isSel ? 'text-amber-400' : 'text-slate-500'}`} />}
                          {pm.category === 'qris' && <QrCode className={`w-4 h-4 ${isSel ? 'text-amber-400' : 'text-slate-500'}`} />}
                          {pm.category === 'ewallet' && <Wallet className={`w-4 h-4 ${isSel ? 'text-amber-400' : 'text-slate-500'}`} />}
                          {pm.category === 'card' && <CreditCard className={`w-4 h-4 ${isSel ? 'text-amber-400' : 'text-slate-500'}`} />}
                          {pm.category === 'paylater' && <Zap className={`w-4 h-4 ${isSel ? 'text-amber-400' : 'text-slate-500'}`} />}
                          
                          <div>
                            <span className="font-extrabold text-xs block leading-tight">{pm.name}</span>
                            <span className={`text-[10px] block leading-tight ${isSel ? 'text-slate-300' : 'text-slate-400'}`}>
                              {pm.description}
                            </span>
                          </div>
                        </div>

                        {isSel && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Contact inputs */}
              <div className="space-y-2 bg-white border border-slate-200 rounded-xl p-3 text-xs">
                <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block">Billing Account Email</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  placeholder="Billing Email Address"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                />
              </div>

              {/* CTA Confirm Button */}
              <button
                onClick={handleInitiateMidtrans}
                disabled={isProcessing}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connecting Midtrans...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Pay with Midtrans — {formatCurrencyAmount(finalPrice, selectedCurrency)}</span>
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-slate-400 font-mono space-y-1">
                <p className="flex items-center justify-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256-Bit Midtrans Signature Verification & Instant Webhook Activation</span>
                </p>
              </div>

            </div>

          </div>
        )}
      </motion.div>
    </div>
  );
}
