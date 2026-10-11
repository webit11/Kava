import { Request, Response } from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { 
  MidtransTransactionRecord, 
  MidtransNotificationPayload, 
  CreateTransactionRequest,
  MidtransConfigInfo,
  MIDTRANS_PAYMENT_METHODS
} from "../src/lib/midtransTypes";

const DB_FILE_PATH = path.join(process.cwd(), "uploads", "midtrans-transactions.json");

// In-Memory & File Store for Midtrans Transactions
let transactionsStore: Record<string, MidtransTransactionRecord> = {};

// Load existing transactions from disk
function loadTransactionsFromDisk() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = fs.readFileSync(DB_FILE_PATH, "utf-8");
      transactionsStore = JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to load midtrans transactions from disk:", e);
    transactionsStore = {};
  }
}

// Save transactions to disk
function saveTransactionsToDisk() {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(transactionsStore, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save midtrans transactions to disk:", e);
  }
}

// Initialize on module load
loadTransactionsFromDisk();

// Helper to get environment credentials
export function getMidtransEnv() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-DemoKey1234567890";
  const clientKey = process.env.MIDTRANS_CLIENT_KEY || "SB-Mid-client-DemoKey1234567890";
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
  
  const snapScriptUrl = isProduction
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

  const snapApiBase = isProduction
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

  const isDemoMode = serverKey.includes("DemoKey") || serverKey.length < 10;

  return {
    serverKey,
    clientKey,
    isProduction,
    snapScriptUrl,
    snapApiBase,
    isDemoMode
  };
}

// GET /api/midtrans/config
export function handleGetMidtransConfig(req: Request, res: Response) {
  const env = getMidtransEnv();
  const configInfo: MidtransConfigInfo = {
    isConfigured: !env.isDemoMode,
    clientKey: env.clientKey,
    isProduction: env.isProduction,
    snapScriptUrl: env.snapScriptUrl,
    availablePaymentMethods: MIDTRANS_PAYMENT_METHODS
  };
  res.json(configInfo);
}

// POST /api/midtrans/create-transaction
export async function handleCreateTransaction(req: Request, res: Response) {
  try {
    const body: CreateTransactionRequest = req.body;
    const { 
      planId, planName, billingCycle, amount, currency, 
      customerName, customerEmail, workspaceId, promoCode, paymentTypePreference 
    } = body;

    if (!planId || !customerEmail) {
      return res.status(400).json({ error: "Missing required fields: planId, customerEmail" });
    }

    const env = getMidtransEnv();
    const orderId = body.orderId || `ORDER-KAVA-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Currency conversion: Midtrans handles gross_amount in IDR
    let grossAmountIdr = Math.round(amount);
    if (currency === "USD") {
      grossAmountIdr = Math.round(amount * 15500);
    } else if (currency === "EUR") {
      grossAmountIdr = Math.round(amount * 16800);
    } else if (currency === "GBP") {
      grossAmountIdr = Math.round(amount * 19800);
    } else if (currency === "JPY") {
      grossAmountIdr = Math.round(amount * 105);
    }

    // Default to at least 10,000 IDR if price > 0
    if (amount > 0 && grossAmountIdr < 10000) {
      grossAmountIdr = 10000;
    }

    const itemPrice = grossAmountIdr > 0 ? grossAmountIdr : 0;

    let snapToken = "";
    let redirectUrl = "";
    let isRealApiSuccess = false;

    // Call Midtrans Snap API if valid non-demo key provided
    if (!env.isDemoMode) {
      try {
        const authHeader = "Basic " + Buffer.from(env.serverKey + ":").toString("base64");
        const payload = {
          transaction_details: {
            order_id: orderId,
            gross_amount: itemPrice
          },
          item_details: [
            {
              id: planId,
              price: itemPrice,
              quantity: 1,
              name: `KAVA ${planName} Plan (${billingCycle})`
            }
          ],
          customer_details: {
            first_name: customerName || "KAVA User",
            email: customerEmail
          },
          enabled_payments: [
            "credit_card", "mandiri_clickpay", "cimb_clicks", "bca_klikbca",
            "bca_klikpay", "bri_epay", "telkomsel_cash", "echannel", "permata_va",
            "bca_va", "bni_va", "bri_va", "cimb_va", "other_va", "gopay", "shopeepay",
            "kredivo", "indomaret", "alfamart", "akulaku", "qris"
          ],
          callbacks: {
            finish: `${req.protocol}://${req.get("host")}/billing?status=success&orderId=${orderId}`,
            error: `${req.protocol}://${req.get("host")}/billing?status=error&orderId=${orderId}`,
            pending: `${req.protocol}://${req.get("host")}/billing?status=pending&orderId=${orderId}`
          }
        };

        const apiRes = await fetch(env.snapApiBase, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": authHeader
          },
          body: JSON.stringify(payload)
        });

        if (apiRes.ok) {
          const apiData = await apiRes.json();
          snapToken = apiData.token;
          redirectUrl = apiData.redirect_url;
          isRealApiSuccess = true;
        } else {
          const errText = await apiRes.text();
          console.warn("Midtrans API call returned error status, falling back to sandbox simulator:", errText);
        }
      } catch (e) {
        console.warn("Failed to contact Midtrans Snap API directly, falling back to sandbox simulator:", e);
      }
    }

    // Fallback simulation token if demo mode or API call didn't execute
    if (!snapToken) {
      snapToken = `SNAP-SIM-${orderId}`;
      redirectUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${snapToken}`;
    }

    // Virtual Account / QRIS simulator helpers
    const selectedMethod = paymentTypePreference || "bca_va";
    let vaNumber = "";
    let qrisUrl = "";
    if (selectedMethod.includes("va") || selectedMethod === "bank_transfer") {
      const bankCode = selectedMethod.replace("_va", "").toUpperCase();
      vaNumber = `8801${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    } else if (selectedMethod === "qris" || selectedMethod === "gopay") {
      qrisUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MIDTRANS-QRIS-${orderId}`;
    }

    const newRecord: MidtransTransactionRecord = {
      orderId,
      transactionId: `TRX-${Date.now()}`,
      grossAmount: amount,
      grossAmountIdr,
      currency: currency || "IDR",
      planId,
      planName,
      billingCycle,
      customerName: customerName || "KAVA Host User",
      customerEmail,
      workspaceId,
      paymentType: selectedMethod,
      transactionStatus: "pending",
      snapToken,
      redirectUrl,
      vaNumber,
      qrisUrl,
      signatureKeyVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSandbox: !env.isProduction || env.isDemoMode,
      statusCode: "201"
    };

    transactionsStore[orderId] = newRecord;
    saveTransactionsToDisk();

    res.json({
      success: true,
      orderId,
      snapToken,
      redirectUrl,
      transactionRecord: newRecord,
      mode: isRealApiSuccess ? "live_midtrans" : "sandbox_simulator",
      clientKey: env.clientKey,
      isProduction: env.isProduction
    });
  } catch (error: any) {
    console.error("Create transaction failed:", error);
    res.status(500).json({ error: "Failed to create Midtrans transaction", details: error.message });
  }
}

// POST /api/midtrans/notification (Webhook)
export function handleMidtransWebhook(req: Request, res: Response) {
  try {
    const payload: MidtransNotificationPayload = req.body;
    const { 
      order_id, status_code, gross_amount, signature_key, 
      transaction_status, payment_type, fraud_status, transaction_id, va_numbers 
    } = payload;

    if (!order_id) {
      return res.status(400).json({ error: "Invalid webhook payload: order_id is required" });
    }

    const env = getMidtransEnv();

    // 1. Signature Key Verification
    let isValidSignature = true;
    if (signature_key && !env.isDemoMode) {
      const inputStr = `${order_id}${status_code}${gross_amount}${env.serverKey}`;
      const computedHash = crypto.createHash("sha512").update(inputStr).digest("hex");
      isValidSignature = (computedHash.toLowerCase() === signature_key.toLowerCase());
      if (!isValidSignature) {
        console.warn(`[Midtrans Webhook Warning] Signature key mismatch for order ${order_id}`);
      }
    }

    // 2. Look up or initialize record
    let record = transactionsStore[order_id];
    if (!record) {
      record = {
        orderId: order_id,
        transactionId: transaction_id || `TRX-${Date.now()}`,
        grossAmount: parseFloat(gross_amount) || 0,
        grossAmountIdr: parseFloat(gross_amount) || 0,
        currency: "IDR",
        planId: "Premium",
        planName: "Premium",
        billingCycle: "yearly",
        customerName: "KAVA User",
        customerEmail: "user@kava.app",
        paymentType: payment_type || "bca_va",
        transactionStatus: transaction_status,
        signatureKeyVerified: isValidSignature,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSandbox: !env.isProduction,
        statusCode: status_code
      };
    }

    // 3. Idempotency Check: if status already recorded and same, return OK
    if (record.transactionStatus === transaction_status && record.updatedAt) {
      return res.status(200).json({ 
        status: "OK", 
        message: "Duplicate notification ignored (Idempotent)", 
        order_id, 
        transaction_status 
      });
    }

    // 4. Update status & payment details
    record.transactionStatus = transaction_status;
    record.fraudStatus = fraud_status;
    record.statusCode = status_code;
    record.paymentType = payment_type || record.paymentType;
    record.updatedAt = new Date().toISOString();
    record.signatureKeyVerified = isValidSignature;
    if (transaction_id) record.transactionId = transaction_id;

    if (transaction_status === "settlement" || transaction_status === "capture") {
      record.settledAt = new Date().toISOString();
    }

    if (va_numbers && va_numbers.length > 0) {
      record.vaNumber = va_numbers[0].va_number;
      record.bankName = va_numbers[0].bank;
    }

    record.rawPayload = payload;
    transactionsStore[order_id] = record;
    saveTransactionsToDisk();

    console.log(`[Midtrans Webhook Success] Order ${order_id} status updated to: ${transaction_status}`);

    res.status(200).json({
      status: "OK",
      message: "Webhook processed successfully",
      order_id,
      transaction_status,
      signatureKeyVerified: isValidSignature
    });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Webhook processing error", details: error.message });
  }
}

// POST /api/midtrans/simulate-payment (Sandbox / Demo Simulator for instant testing)
export function handleSimulatePayment(req: Request, res: Response) {
  try {
    const { orderId, status = "settlement", paymentType = "bca_va" } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: "orderId is required" });
    }

    const record = transactionsStore[orderId];
    const grossAmount = record ? `${record.grossAmountIdr}` : "150000";

    const simulatedPayload: MidtransNotificationPayload = {
      transaction_time: new Date().toISOString(),
      transaction_status: status as any,
      transaction_id: `SIM-TRX-${Date.now()}`,
      status_message: `Midtrans payment status simulated as ${status}`,
      status_code: status === "settlement" || status === "capture" ? "200" : "201",
      signature_key: "simulated_valid_signature",
      payment_type: paymentType,
      order_id: orderId,
      gross_amount: grossAmount
    };

    // Execute webhook handler directly with simulated payload
    req.body = simulatedPayload;
    return handleMidtransWebhook(req, res);
  } catch (error: any) {
    console.error("Payment simulation error:", error);
    res.status(500).json({ error: "Simulation failed", details: error.message });
  }
}

// GET /api/midtrans/transactions
export function handleGetTransactions(req: Request, res: Response) {
  const records = Object.values(transactionsStore).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json({
    count: records.length,
    transactions: records
  });
}

// GET /api/midtrans/status/:orderId
export function handleGetTransactionStatus(req: Request, res: Response) {
  const { orderId } = req.params;
  const record = transactionsStore[orderId];

  if (!record) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  res.json(record);
}
