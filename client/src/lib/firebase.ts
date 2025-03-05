import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { apiRequest } from "@/lib/queryClient";

let app: ReturnType<typeof initializeApp>;
let auth: ReturnType<typeof getAuth>;

export async function initializeFirebase() {
  try {
    const response = await fetch("/api/firebase-config");
    const config = await response.json();

    const firebaseConfig = {
      apiKey: config.apiKey,
      authDomain: `${config.projectId}.firebaseapp.com`,
      projectId: config.projectId,
      storageBucket: `${config.projectId}.appspot.com`,
      appId: config.appId,
    };

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
}

// Initialize Firebase when this module is imported
initializeFirebase();

export { app, auth };