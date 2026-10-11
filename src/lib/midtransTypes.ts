// Midtrans Payment Gateway & Subscription Integration Types

export type MidtransTransactionStatus = 
  | 'authorize'
  | 'capture'
  | 'settlement'
  | 'pending'
  | 'deny'
  | 'cancel'
  | 'expire'
  | 'failure'
  | 'refund'
  | 'partial_refund';

export type MidtransPaymentType = 
  | 'credit_card'
  | 'bca_va'
  | 'mandiri_va'
  | 'bni_va'
  | 'bri_va'
  | 'permata_va'
  | 'cimb_va'
  | 'other_va'
  | 'gopay'
  | 'shopeepay'
  | 'qris'
  | 'kredivo'
  | 'akulaku'
  | 'bank_transfer'
  | 'echannel'
  | 'cstore';

export interface MidtransTransactionRecord {
  orderId: string;
  transactionId?: string;
  grossAmount: number;
  grossAmountIdr: number;
  currency: string;
  planId: string;
  planName: string;
  billingCycle: 'monthly' | 'yearly';
  customerName: string;
  customerEmail: string;
  workspaceId?: string;
  paymentType: MidtransPaymentType | string;
  transactionStatus: MidtransTransactionStatus;
  fraudStatus?: string;
  snapToken?: string;
  redirectUrl?: string;
  vaNumber?: string;
  bankName?: string;
  qrisUrl?: string;
  statusCode?: string;
  signatureKeyVerified: boolean;
  createdAt: string;
  updatedAt: string;
  settledAt?: string;
  isSandbox: boolean;
  rawPayload?: any;
}

export interface MidtransNotificationPayload {
  transaction_time: string;
  transaction_status: MidtransTransactionStatus;
  transaction_id: string;
  status_message?: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  merchant_id?: string;
  gross_amount: string;
  fraud_status?: string;
  currency?: string;
  va_numbers?: Array<{
    bank: string;
    va_number: string;
  }>;
  permata_va_number?: string;
  bill_key?: string;
  biller_code?: string;
  actions?: Array<{
    name: string;
    method: string;
    url: string;
  }>;
}

export interface CreateTransactionRequest {
  orderId?: string;
  planId: string;
  planName: string;
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  workspaceId?: string;
  promoCode?: string;
  paymentTypePreference?: MidtransPaymentType | string;
}

export interface MidtransConfigInfo {
  isConfigured: boolean;
  clientKey: string;
  isProduction: boolean;
  snapScriptUrl: string;
  availablePaymentMethods: Array<{
    id: MidtransPaymentType;
    name: string;
    category: 'va' | 'qris' | 'ewallet' | 'card' | 'paylater';
    icon: string;
    description: string;
  }>;
}

export const MIDTRANS_PAYMENT_METHODS: MidtransConfigInfo['availablePaymentMethods'] = [
  { id: 'bca_va', name: 'BCA Virtual Account', category: 'va', icon: 'Building2', description: 'Automatic confirmation via BCA Mobile / Net Banking' },
  { id: 'mandiri_va', name: 'Mandiri Livin VA', category: 'va', icon: 'Building2', description: 'Livin by Mandiri & ATM Mandiri' },
  { id: 'bni_va', name: 'BNI Virtual Account', category: 'va', icon: 'Building2', description: 'BNI Mobile Banking & ATM' },
  { id: 'bri_va', name: 'BRImo Virtual Account', category: 'va', icon: 'Building2', description: 'BRImo & BRI ATM transfer' },
  { id: 'permata_va', name: 'Permata VA', category: 'va', icon: 'Building2', description: 'PermataMobile X & ATM' },
  { id: 'qris', name: 'QRIS Universal', category: 'qris', icon: 'QrCode', description: 'Scan & Pay with GoPay, OVO, Dana, LinkAja, BCA, Shopee' },
  { id: 'gopay', name: 'GoPay / GoPay Later', category: 'ewallet', icon: 'Wallet', description: 'Direct checkout with GoPay App' },
  { id: 'shopeepay', name: 'ShopeePay', category: 'ewallet', icon: 'Wallet', description: 'Instant payment via Shopee App' },
  { id: 'credit_card', name: 'Credit / Debit Card', category: 'card', icon: 'CreditCard', description: 'Visa, Mastercard, JCB, AMEX with 3D Secure' },
  { id: 'kredivo', name: 'Kredivo / Akulaku', category: 'paylater', icon: 'Zap', description: 'Pay in 30 days or monthly installments' }
];
