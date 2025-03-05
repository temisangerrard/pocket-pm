import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const app = initializeApp({
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: `${import.meta.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.FIREBASE_PROJECT_ID,
});

const auth = getAuth(app);

export { auth };