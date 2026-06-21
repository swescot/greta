export function SetupNeeded() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold text-white">Connect Firebase</h1>
      <p className="text-slate-400">
        The app loaded, but no Firebase project is configured yet. To finish
        setup:
      </p>
      <ol className="list-decimal space-y-2 pl-5 text-slate-300">
        <li>
          Create a project in the{' '}
          <a
            href="https://console.firebase.google.com/"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 underline"
          >
            Firebase console
          </a>{' '}
          — enable <strong>Google</strong> sign-in and create a{' '}
          <strong>Firestore</strong> database.
        </li>
        <li>
          Add a <strong>Web app</strong> and copy its config.
        </li>
        <li>
          Run <code className="rounded bg-slate-800 px-1.5 py-0.5">cp .env.example .env.local</code>{' '}
          and paste the values in.
        </li>
        <li>Restart the dev server.</li>
      </ol>
      <p className="text-sm text-slate-500">Full steps are in the README.</p>
    </div>
  )
}
