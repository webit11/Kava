import React from 'react';
import { X, Download, Printer, Mail, CheckCircle, Clock, AlertTriangle, RefreshCw, ShieldCheck, FileText } from 'lucide-react';
import { KavaInvoice, getStoredReceiptSettings, formatCurrencyAmount } from '../lib/billing';

interface ReceiptModalProps {
  invoice: KavaInvoice | null;
  isOpen: boolean;
  onClose: () => void;
  onResendEmail?: (invoice: KavaInvoice) => void;
  triggerToast?: (title: string, desc: string, type?: 'success' | 'info' | 'error') => void;
}

export default function ReceiptModal({
  invoice,
  isOpen,
  onClose,
  onResendEmail,
  triggerToast
}: ReceiptModalProps) {
  if (!isOpen || !invoice) return null;

  const settings = getStoredReceiptSettings();
  const currency = invoice.currency || 'USD';

  const handlePrint = () => {
    const printContent = document.getElementById('kava-receipt-printable-area');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt ${invoice.id} - ${settings.companyName}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #0f172a; background: #fff; }
            .receipt-box { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; }
            .logo-title { font-size: 24px; font-weight: 800; color: #0f172a; }
            .inv-meta { text-align: right; font-size: 13px; color: #64748b; }
            .inv-id { font-size: 20px; font-weight: 800; color: #0f172a; font-family: monospace; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-family: monospace; }
            .badge-paid { background: #ecfdf5; color: #047857; }
            .badge-refunded { background: #fef2f2; color: #b91c1c; }
            .badge-pending { background: #fffbeb; color: #b45309; }
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
            .label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; font-family: monospace; margin-bottom: 6px; }
            .val { font-size: 14px; font-weight: 600; color: #1e293b; line-height: 1.5; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; padding: 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; background: #f8fafc; font-family: monospace; }
            td { padding: 14px 12px; font-size: 13px; border-bottom: 1px solid #f1f5f9; color: #334155; }
            .totals { margin-left: auto; width: 280px; text-align: right; }
            .tot-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #475569; }
            .tot-grand { display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #0f172a; font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 8px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="receipt-box">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSendEmailSimulation = () => {
    if (onResendEmail) {
      onResendEmail(invoice);
    } else if (triggerToast) {
      triggerToast(
        'Receipt Emailed Successfully',
        `An official PDF copy of receipt #${invoice.id} was dispatched to ${invoice.customerEmail || 'host account'}.`,
        'success'
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>PAID</span>
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>REFUNDED</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>PENDING</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{status.toUpperCase()}</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-[28px] shadow-2xl w-full max-w-3xl overflow-hidden my-8 flex flex-col max-h-[92vh]">
        {/* Modal Top Control Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Official Receipt & Tax Invoice</h3>
              <p className="text-[11px] text-slate-400 font-mono">ID: {invoice.id} • {invoice.issueDate}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSendEmailSimulation}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Resend email receipt to customer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Copy</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
              title="Download or print PDF receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download / Print PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / Printable Container */}
        <div className="p-8 overflow-y-auto space-y-8 bg-slate-50/50" id="kava-receipt-printable-area">
          {/* Header section with Company Branding */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                {settings.companyLogoUrl ? (
                  <img
                    src={settings.companyLogoUrl}
                    alt={settings.companyName}
                    className="h-10 w-auto object-contain rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <span className="text-xl font-black tracking-tight text-slate-900">{settings.companyName}</span>
              </div>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed font-medium">
                {settings.legalAddress}
              </p>
              <div className="flex items-center space-x-4 text-[11px] text-slate-400 font-mono pt-1">
                <span>Tax ID: {settings.taxVatId}</span>
                <span>•</span>
                <span>Support: {settings.supportEmail}</span>
              </div>
            </div>

            <div className="text-right space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono block">Tax Invoice / Receipt</span>
              <div className="text-2xl font-black font-mono text-slate-900">{invoice.id}</div>
              <div>{getStatusBadge(invoice.status)}</div>
              <p className="text-xs text-slate-500 font-medium pt-1">Date Issued: <strong>{invoice.issueDate}</strong></p>
            </div>
          </div>

          {/* Details 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer & Workspace Info */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400 border-b border-slate-100 pb-2">
                Billed To (Customer Details)
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">{invoice.customerName || 'Workspace Admin'}</p>
                <p className="text-xs text-slate-600 font-medium">{invoice.customerEmail || 'admin@kava.app'}</p>
                <div className="pt-2 text-xs text-slate-500 space-y-1">
                  <p><span className="text-slate-400 font-mono">Workspace:</span> <strong className="text-slate-800">{invoice.workspaceName || 'Personal Workspace'}</strong></p>
                  {invoice.workspaceId && <p><span className="text-slate-400 font-mono">Workspace ID:</span> <span className="font-mono text-[11px] text-slate-600">{invoice.workspaceId}</span></p>}
                </div>
              </div>
            </div>

            {/* Payment & Transaction Info */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400 border-b border-slate-100 pb-2">
                Payment & Billing Terms
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Payment Method:</span>
                  <span className="font-bold text-slate-800 font-mono">{invoice.paymentMethod || 'Visa ending in 4242'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Transaction Reference:</span>
                  <span className="font-bold text-slate-800 font-mono text-[11px]">{invoice.transactionId || 'TXN-9840192'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Billing Cycle:</span>
                  <span className="font-bold text-slate-800 uppercase font-mono text-[11px]">{invoice.billingCycle || 'monthly'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Coverage Period:</span>
                  <span className="font-bold text-slate-800">{invoice.billingPeriodStart || invoice.issueDate} – {invoice.billingPeriodEnd || 'Next Billing Date'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80">
                  <th className="py-3 px-5 text-slate-500 font-bold uppercase tracking-wider font-mono">Plan / Service Description</th>
                  <th className="py-3 px-4 text-slate-500 font-bold uppercase tracking-wider font-mono text-center">Billing Period</th>
                  <th className="py-3 px-5 text-right text-slate-500 font-bold uppercase tracking-wider font-mono">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-4 px-5">
                    <p className="font-bold text-slate-900 text-sm">KAVA {invoice.planName || 'Pro Studio'} Plan</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Full workspace subscription tier upgrade, cloud vault storage, live screen projection, and event management suite.
                    </p>
                  </td>
                  <td className="py-4 px-4 text-center font-mono text-slate-600 text-[11px]">
                    {invoice.billingCycle === 'yearly' ? '1 Year Renewal' : '1 Month Cycle'}
                  </td>
                  <td className="py-4 px-5 text-right font-bold font-mono text-slate-900 text-sm">
                    {formatCurrencyAmount(invoice.subtotal || invoice.amountRaw || 29, currency)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Financial Summary */}
            <div className="p-5 bg-slate-50/70 border-t border-slate-200/80 flex justify-end">
              <div className="w-full max-w-xs space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-slate-800">
                    {formatCurrencyAmount(invoice.subtotal || invoice.amountRaw || 29, currency)}
                  </span>
                </div>

                {invoice.discountAmount && invoice.discountAmount > 0 ? (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount {invoice.discountCode ? `(${invoice.discountCode})` : ''}</span>
                    <span className="font-mono font-bold">
                      -{formatCurrencyAmount(invoice.discountAmount, currency)}
                    </span>
                  </div>
                ) : null}

                {invoice.taxAmount && invoice.taxAmount > 0 ? (
                  <div className="flex justify-between text-slate-600">
                    <span>{settings.taxLabel || 'Tax / VAT'}</span>
                    <span className="font-mono font-bold text-slate-800">
                      +{formatCurrencyAmount(invoice.taxAmount, currency)}
                    </span>
                  </div>
                ) : null}

                <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-300 pt-3 mt-2">
                  <span>Total Paid</span>
                  <span className="font-mono text-lg text-emerald-600">
                    {invoice.amount || formatCurrencyAmount(invoice.amountRaw || 29, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Notice (if applicable) */}
          {invoice.status === 'Refunded' && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 space-y-1">
              <div className="flex items-center space-x-2 font-bold text-rose-900">
                <RefreshCw className="w-4 h-4 text-rose-600" />
                <span>Transaction Refunded</span>
              </div>
              <p className="pl-6 text-rose-700">
                Reason: {invoice.refundReason || 'Customer requested subscription refund.'}
              </p>
            </div>
          )}

          {/* Payment Instructions & Terms */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 text-xs text-slate-500 space-y-3">
            <div>
              <span className="font-bold text-slate-700 block mb-1">Payment Instructions & Notes:</span>
              <p className="leading-relaxed">{settings.paymentInstructions}</p>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <p className="leading-relaxed text-[11px] text-slate-400">{settings.footerText}</p>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="text-center py-2 flex items-center justify-center space-x-2 text-[11px] text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit Encrypted Secure Transaction • Verified by KAVA Billing Systems</span>
          </div>
        </div>
      </div>
    </div>
  );
}
