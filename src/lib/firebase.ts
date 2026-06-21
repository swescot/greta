import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Config is read from Vite env vars (see .env.example).
// These values are safe to expose in the client — security is enforced
// by Firestore security rules, not by hiding the config.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// True once .env.local has been filled in with a real project config.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
)

// Only initialize when configured, so a missing .env.local shows a helpful
// setup screen instead of crashing the whole app on load.
const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : undefined

export const auth = app ? getAuth(app) : null
export const googleProvider = new GoogleAuthProvider()
export const db = app ? getFirestore(app) : null
