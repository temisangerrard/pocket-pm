// This file is used to check if environment variables are being loaded correctly

console.log('Environment Variables Check:');
console.log('VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY ? 'PRESENT' : 'MISSING');
console.log('VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'PRESENT' : 'MISSING');
console.log('VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'PRESENT' : 'MISSING');
console.log('VITE_FIREBASE_STORAGE_BUCKET:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? 'PRESENT' : 'MISSING');
console.log('VITE_FIREBASE_APP_ID:', import.meta.env.VITE_FIREBASE_APP_ID ? 'PRESENT' : 'MISSING');

// Check if we're in development mode
console.log('NODE_ENV:', import.meta.env.MODE);
console.log('DEV:', import.meta.env.DEV);
console.log('PROD:', import.meta.env.PROD);

export {}; 