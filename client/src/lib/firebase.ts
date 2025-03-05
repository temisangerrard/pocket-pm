import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Get Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: `${import.meta.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.FIREBASE_PROJECT_ID,
};

// Log configuration (remove in production)
console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? '[PRESENT]' : '[MISSING]',
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };