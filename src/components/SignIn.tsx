import { useState } from 'react'
import { signInWithGoogle } from '../auth/useAuth'

export function SignIn() {
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    setError(null)
    try {
      await signInWithGoogle()
    } catch {
      setError('Sign-in failed. Please try again.')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div>
        <h1 className="text-4xl font-semibold text-white">Greta</h1>
        <p className="mt-2 text-slate-400">Your family organiser</p>
      </div>
      <button
        onClick={handleSignIn}
        className="rounded-lg bg-white px-6 py-3 font-medium text-slate-900 transition hover:bg-slate-200"
      >
        Sign in with Google
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
