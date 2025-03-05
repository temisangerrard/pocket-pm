import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration with fallback values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBXMk2UrDZEMeRfRLHK-Z0aNm_UKNvjzbM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pocket-pm-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890",
};

// Log the configuration for debugging
console.log("Firebase config:", {
  apiKey: firebaseConfig.apiKey ? "PRESENT" : "MISSING",
  authDomain: firebaseConfig.authDomain ? "PRESENT" : "MISSING",
  projectId: firebaseConfig.projectId ? "PRESENT" : "MISSING",
  storageBucket: firebaseConfig.storageBucket ? "PRESENT" : "MISSING",
  appId: firebaseConfig.appId ? "PRESENT" : "MISSING",
});

// Initialize Firebase
let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { app, auth };