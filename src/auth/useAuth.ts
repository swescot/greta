import { useContext } from 'react'
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'
import { AuthContext } from './AuthContext'

export function useAuth() {
  return useContext(AuthContext)
}

export function signInWithGoogle() {
  if (!auth) throw new Error('Firebase is not configured')
  return signInWithPopup(auth, googleProvider)
}

export function logOut() {
  if (!auth) return Promise.resolve()
  return signOut(auth)
}
