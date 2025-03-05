import { Express } from "express";
import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}

export function setupAuth(app: Express) {
  // Middleware to verify Firebase ID tokens
  async function authenticateToken(req: any, res: any, next: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ error: "Invalid token" });
    }
  }

  // Protected routes - require authentication
  app.use(["/api/features", "/api/prds", "/api/backlog"], authenticateToken);

  // Public route for Firebase config
  app.get("/api/firebase-config", (_, res) => {
    res.json({
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      appId: process.env.VITE_FIREBASE_APP_ID
    });
  });
}