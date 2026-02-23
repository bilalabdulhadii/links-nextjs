import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.LINKS_FIREBASE_API_KEY,
    authDomain: process.env.LINKS_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.LINKS_FIREBASE_PROJECT_ID,
    storageBucket: process.env.LINKS_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.LINKS_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.LINKS_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId,
);

const app: FirebaseApp | null = isFirebaseConfigured
    ? getApps().length
        ? getApps()[0]
        : initializeApp(firebaseConfig)
    : null;

export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;
export const storage: FirebaseStorage | null = app ? getStorage(app) : null;
