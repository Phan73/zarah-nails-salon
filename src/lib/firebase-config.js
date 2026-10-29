import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

/**
 * Client-safe Firebase configuration keys.
 * In Astro / Vite, client-exposed variables are prefixed with PUBLIC_.
 */
const env = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env
  : (typeof process !== 'undefined' && process.env ? process.env : {});

const firebaseConfig = {
  apiKey: env.PUBLIC_FIREBASE_API_KEY || "AIzaSyDzDzRbW10mVJkKr271xFGp47QNlt1akxY",
  authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN || "zarah-nails-web.firebaseapp.com",
  projectId: env.PUBLIC_FIREBASE_PROJECT_ID || "zarah-nails-web",
  storageBucket: env.PUBLIC_FIREBASE_STORAGE_BUCKET || "zarah-nails-web.firebasestorage.app",
  messagingSenderId: env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "691136287503",
  appId: env.PUBLIC_FIREBASE_APP_ID || "1:691136287503:web:e588373269dcee3666647a",
};

/**
 * Checks whether valid Firebase configuration keys have been provided in the environment.
 */
export function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'AIzaSy_YOUR_REAL_API_KEY' &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
}

let app = null;
let auth = null;

if (typeof window !== 'undefined' && isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (error) {
    console.error('[ZarahAuth] Firebase initialization error:', error);
  }
}

export { app, auth, firebaseConfig };
