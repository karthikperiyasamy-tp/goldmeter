import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase web-app config from env
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const REQUIRED_FIREBASE_FIELDS: Array<keyof typeof firebaseConfig> = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];

const FIREBASE_ENV_NAME_BY_FIELD: Record<keyof typeof firebaseConfig, string> = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
};

export function getFirebaseMissingConfigKeys(): string[] {
  return REQUIRED_FIREBASE_FIELDS
    .filter((field) => !firebaseConfig[field])
    .map((field) => FIREBASE_ENV_NAME_BY_FIELD[field]);
}

/** Check if Firebase is configured (env vars present) */
export function isFirebaseConfigured(): boolean {
  return getFirebaseMissingConfigKeys().length === 0;
}

/** Lazy-init Firebase app (singleton) */
function getApp(): FirebaseApp {
  if (getApps().length > 0) return getApps()[0];
  const missing = getFirebaseMissingConfigKeys();
  if (missing.length > 0) {
    throw new Error(
      `Firebase config missing: ${missing.join(", ")}. Restart dev server after updating .env.local.`
    );
  }
  return initializeApp(firebaseConfig);
}

/** Auth instance */
export function getFirebaseAuth() {
  return getAuth(getApp());
}

/** Firestore instance */
export function getFirebaseFirestore() {
  return getFirestore(getApp());
}

/** Google sign-in via popup */
export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

/** Sign out */
export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  await firebaseSignOut(auth);
}

/** Subscribe to auth state changes */
export function onAuthChange(cb: (user: User | null) => void): () => void {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, cb);
}
