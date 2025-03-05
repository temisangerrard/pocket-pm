import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage();

// Helper functions for user management
export async function verifyAdmin(uid: string): Promise<boolean> {
  try {
    const user = await auth.getUser(uid);
    return user.customClaims?.admin === true;
  } catch (error) {
    return false;
  }
}

export async function setUserRole(uid: string, role: 'admin' | 'user') {
  await auth.setCustomUserClaims(uid, { [role]: true });
}
