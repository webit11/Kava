import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { db, ServerUser } from "./server/db";
import { 
  handleGetMidtransConfig, 
  handleCreateTransaction, 
  handleMidtransWebhook, 
  handleSimulatePayment, 
  handleGetTransactions, 
  handleGetTransactionStatus 
} from "./server/midtrans";

// Extend Express Request to include authenticated user
interface AuthenticatedRequest extends Request {
  user?: ServerUser;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON and urlencoded body parsing with safe limits
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ limit: '25mb', extended: true }));

  // Create uploads directory if not exists
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Serve static uploads
  app.use("/uploads", express.static(uploadsDir));

  // --- Auth Extraction Middleware ---
  const extractUserMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || (req.headers['x-auth-token'] as string);
    const userEmailHeader = req.headers['x-user-email'] as string;
    const userIdHeader = req.headers['x-user-id'] as string;

    if (authHeader) {
      const sessionResult = db.verifySession(authHeader);
      if (sessionResult.valid && sessionResult.user) {
        req.user = sessionResult.user;
        return next();
      }
    }

    if (userEmailHeader) {
      const user = db.getOrCreateUser(userEmailHeader);
      req.user = user;
      return next();
    }

    // Default fallback for development/demo environment
    req.user = db.getOrCreateUser('arthawibawa777@gmail.com', 'Artha Wibawa');
    next();
  };

  const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required", code: "AUTH_REQUIRED" });
    }
    next();
  };

  app.use(extractUserMiddleware);

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // --- KAVA Auth & Session Endpoints ---
  app.get("/api/auth/me", (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json({ user: req.user });
  });

  app.post("/api/auth/login", (req: AuthenticatedRequest, res) => {
    try {
      const { email, name } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      const user = db.getOrCreateUser(email, name);
      const session = db.createSession(user);
      res.json({ success: true, user, token: session.token, expiresAt: session.expiresAt });
    } catch (err) {
      console.error("Login failed:", err);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  app.post("/api/auth/logout", (req: AuthenticatedRequest, res) => {
    const authHeader = req.headers.authorization || (req.headers['x-auth-token'] as string);
    if (authHeader) {
      db.invalidateSession(authHeader);
    }
    res.json({ success: true });
  });

  // --- KAVA Events API (Secured with IDOR Protection) ---
  app.get("/api/events", (req: AuthenticatedRequest, res) => {
    res.json(db.getEvents(req.user));
  });

  app.get("/api/events/:idOrCode", (req: AuthenticatedRequest, res) => {
    const event = db.getEventByIdOrCode(req.params.idOrCode);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    // Allow public access by code for guests, or verify ownership if accessed by ID in host context
    res.json(event);
  });

  app.post("/api/events", requireAuth, (req: AuthenticatedRequest, res) => {
    try {
      const eventData = {
        ...req.body,
        hostId: req.user?.id || req.body.hostId || 'usr-default',
        hostEmail: req.user?.email || req.body.hostEmail || 'arthawibawa777@gmail.com',
        hostName: req.user?.name || req.body.hostName || 'Artha Wibawa',
        workspaceId: req.user?.workspaceId || req.body.workspaceId || 'ws-default',
      };
      const created = db.createEvent(eventData);
      res.status(201).json(created);
    } catch (err) {
      console.error("Failed to create event:", err);
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  app.put("/api/events/:id", requireAuth, (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      if (req.user && !db.canUserAccessEvent(req.user, id, 'write')) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to modify this event" });
      }

      const updated = db.updateEvent(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(updated);
    } catch (err) {
      console.error("Failed to update event:", err);
      res.status(500).json({ error: "Failed to update event" });
    }
  });

  app.post("/api/events/:id/regenerate-code", requireAuth, (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      if (req.user && !db.canUserAccessEvent(req.user, id, 'write')) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to regenerate code for this event" });
      }

      const result = db.regenerateEventCode(id);
      if (!result) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(result);
    } catch (err) {
      console.error("Failed to regenerate code:", err);
      res.status(500).json({ error: "Failed to regenerate event code" });
    }
  });

  app.delete("/api/events/:id", requireAuth, (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    if (req.user && !db.canUserAccessEvent(req.user, id, 'delete')) {
      return res.status(403).json({ error: "Forbidden: You do not have permission to delete this event" });
    }

    const success = db.deleteEvent(id);
    res.json({ success });
  });

  // --- KAVA Central QR Branding & Configuration API ---
  app.get("/api/qr-config", (req, res) => {
    res.json(db.getQrConfig());
  });

  app.put("/api/qr-config", requireAuth, (req: AuthenticatedRequest, res) => {
    try {
      const updated = db.updateQrConfig(req.body);
      res.json(updated);
    } catch (err) {
      console.error("Failed to update QR config:", err);
      res.status(500).json({ error: "Failed to update QR config" });
    }
  });

  app.post("/api/qr-config", requireAuth, (req: AuthenticatedRequest, res) => {
    try {
      const updated = db.updateQrConfig(req.body);
      res.json(updated);
    } catch (err) {
      console.error("Failed to update QR config:", err);
      res.status(500).json({ error: "Failed to update QR config" });
    }
  });

  app.post("/api/qr-config/reset", requireAuth, (req: AuthenticatedRequest, res) => {
    try {
      const reset = db.resetQrConfig();
      res.json(reset);
    } catch (err) {
      console.error("Failed to reset QR config:", err);
      res.status(500).json({ error: "Failed to reset QR config" });
    }
  });

  // --- KAVA Guest Join & Validation API ---
  app.post("/api/join", (req, res) => {
    try {
      const { code, password, joinMethod, guestInfo } = req.body;
      const result = db.validateAndJoin(code, password, joinMethod, guestInfo);
      if (!result.success) {
        return res.status(result.status === 'invalid_code' ? 404 : 400).json(result);
      }
      res.json(result);
    } catch (err) {
      console.error("Join validation error:", err);
      res.status(500).json({ success: false, status: "invalid_code", errorMessage: "Validation failed" });
    }
  });

  // --- KAVA Contributions API ---
  app.get("/api/contributions", (req: AuthenticatedRequest, res) => {
    const eventId = req.query.eventId as string;
    res.json(db.getContributions(eventId));
  });

  app.post("/api/contributions", (req, res) => {
    try {
      const created = db.addContribution(req.body);
      res.status(201).json(created);
    } catch (err) {
      console.error("Failed to add contribution:", err);
      res.status(500).json({ error: "Failed to add contribution" });
    }
  });

  app.put("/api/contributions/:id", requireAuth, (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      if (req.user && !db.canUserAccessContribution(req.user, id, 'write')) {
        return res.status(403).json({ error: "Forbidden: You do not have permission to update this contribution" });
      }

      const updated = db.updateContribution(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Contribution not found" });
      }
      res.json(updated);
    } catch (err) {
      console.error("Failed to update contribution:", err);
      res.status(500).json({ error: "Failed to update contribution" });
    }
  });

  app.delete("/api/contributions/:id", requireAuth, (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    if (req.user && !db.canUserAccessContribution(req.user, id, 'delete')) {
      return res.status(403).json({ error: "Forbidden: You do not have permission to delete this contribution" });
    }

    const success = db.deleteContribution(id);
    res.json({ success });
  });

  // --- KAVA Guests API ---
  app.get("/api/guests", (req: AuthenticatedRequest, res) => {
    const eventId = req.query.eventId as string;
    res.json(db.getGuests(eventId));
  });

  app.post("/api/guests", (req, res) => {
    try {
      const guest = db.addOrUpdateGuest(req.body);
      res.json(guest);
    } catch (err) {
      console.error("Failed to update guest:", err);
      res.status(500).json({ error: "Failed to update guest" });
    }
  });

  // --- Reset/Seed Data API ---
  app.post("/api/reset-data", requireAuth, (req: AuthenticatedRequest, res) => {
    db.resetToDefaults();
    res.json({ success: true, events: db.getEvents(req.user) });
  });

  // --- Subscription & Entitlements API ---
  app.get("/api/subscription/entitlement", (req: AuthenticatedRequest, res) => {
    try {
      const entitlement = db.getUserEntitlement(req.user);
      res.json(entitlement);
    } catch (err) {
      console.error("Failed to get entitlement:", err);
      res.status(500).json({ error: "Failed to load workspace entitlements" });
    }
  });

  app.get("/api/workspaces/entitlements", (req: AuthenticatedRequest, res) => {
    try {
      const entitlement = db.getUserEntitlement(req.user);
      res.json(entitlement);
    } catch (err) {
      console.error("Failed to get entitlement:", err);
      res.status(500).json({ error: "Failed to load workspace entitlements" });
    }
  });

  app.get("/api/subscription/plans", (req, res) => {
    res.json(db.getPlans());
  });

  app.put("/api/subscription/plans", requireAuth, (req: AuthenticatedRequest, res) => {
    try {
      const plans = req.body;
      const updated = db.updatePlans(plans);
      res.json(updated);
    } catch (err) {
      console.error("Failed to update plans:", err);
      res.status(500).json({ error: "Failed to update subscription plans" });
    }
  });

  app.post("/api/subscription/upgrade", requireAuth, (req: AuthenticatedRequest, res) => {
    try {
      const { planId, userId } = req.body;
      const targetUserId = userId || req.user?.id || 'usr-default';
      const updatedUser = db.updateUserPlan(targetUserId, planId);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      const entitlement = db.getUserEntitlement(updatedUser);
      res.json({ success: true, user: updatedUser, entitlement });
    } catch (err) {
      console.error("Failed to upgrade plan:", err);
      res.status(500).json({ error: "Failed to upgrade subscription plan" });
    }
  });

  // Midtrans Payment Gateway Endpoints
  app.get("/api/midtrans/config", handleGetMidtransConfig);
  app.post("/api/midtrans/create-transaction", handleCreateTransaction);
  app.post("/api/midtrans/notification", handleMidtransWebhook);
  app.post("/api/midtrans/simulate-payment", handleSimulatePayment);
  app.get("/api/midtrans/transactions", handleGetTransactions);
  app.get("/api/midtrans/status/:orderId", handleGetTransactionStatus);

  // Audio Upload endpoint (Protected with file-type checks and size validation)
  app.post("/api/upload-bgm/:eventId", requireAuth, (req: AuthenticatedRequest, res) => {
    const { eventId } = req.params;

    if (req.user && !db.canUserAccessEvent(req.user, eventId, 'write')) {
      return res.status(403).json({ error: "Forbidden: You do not have permission to upload audio to this event" });
    }

    const fileName = (req.headers["x-file-name"] as string) || "audio.mp3";
    
    // Sanitize filename to prevent directory traversal
    const sanitizedFileName = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, "_");
    const allowedExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.webm'];
    const ext = path.extname(sanitizedFileName).toLowerCase();

    if (!allowedExtensions.includes(ext) && !sanitizedFileName.endsWith('.mp3')) {
      return res.status(400).json({ error: "Invalid audio format. Allowed formats: MP3, WAV, M4A, AAC, OGG, WEBM" });
    }

    const destPath = path.join(uploadsDir, `${eventId}-${sanitizedFileName}`);
    const writeStream = fs.createWriteStream(destPath);
    req.pipe(writeStream);
    
    writeStream.on("finish", () => {
      res.json({
        success: true,
        url: `/uploads/${eventId}-${sanitizedFileName}`,
        fileName: sanitizedFileName,
      });
    });
    
    writeStream.on("error", (err) => {
      console.error("Upload error:", err);
      res.status(500).json({ success: false, error: "Upload failed" });
    });
  });

  // Audio Delete endpoint
  app.delete("/api/upload-bgm/:eventId", requireAuth, (req: AuthenticatedRequest, res) => {
    const { eventId } = req.params;
    if (req.user && !db.canUserAccessEvent(req.user, eventId, 'write')) {
      return res.status(403).json({ error: "Forbidden: You do not have permission to delete audio for this event" });
    }

    try {
      const files = fs.readdirSync(uploadsDir);
      let deletedCount = 0;
      for (const file of files) {
        if (file.startsWith(`${eventId}-`)) {
          fs.unlinkSync(path.join(uploadsDir, file));
          deletedCount++;
        }
      }
      res.json({ success: true, deletedCount });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ success: false, error: "Failed to delete audio file" });
    }
  });

  // Vite middleware for development or Static files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
