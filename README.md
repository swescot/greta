# Greta — Family Organiser

A small PWA for our household. First feature: weekly meal planning.

**Stack:** React 19 + TypeScript + Vite · Tailwind CSS v4 · Firebase (Auth + Firestore) · installable PWA.

## Features

- **Google sign-in** — only allow-listed accounts can access the data.
- **Meals** — add and delete the meals in your repertoire.
- **This Week** — pick a meal for each day; browse forward/back through weeks. Changes sync live via Firestore.

## Getting started

### 1. Create the Firebase project (one-time)

1. Go to the [Firebase console](https://console.firebase.google.com/) and create a project.
2. **Build → Authentication → Get started → Sign-in method →** enable **Google**.
3. **Build → Firestore Database → Create database** (start in production mode).
4. **Project settings → General → Your apps →** add a **Web app** and copy the config values.

### 2. Configure local env

```bash
cp .env.example .env.local
# paste the config values into .env.local
```

### 3. Run it

```bash
npm install
npm run dev
```

Open the printed URL. Sign in with a Google account that's on the allow-list.

## Access control

Who can use the app is controlled by the email allow-list in
[`firestore.rules`](firestore.rules). Add your wife's Google account email there,
then deploy the rules:

```bash
firebase deploy --only firestore:rules
```

> Until the rules are deployed, Firestore reads/writes may be denied. The default
> rules also include your email — update the list before going live.

## Data model (Firestore)

- `meals/{id}` — `{ name, createdAt }`
- `weeks/{mondayDate}` — `{ plan: { Monday: mealId|null, … } }`, where the doc id
  is the ISO date of that week's Monday (e.g. `2026-06-15`).

## Deploy (GitHub Pages)

Hosted on GitHub Pages via the workflow in
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) — every push to
`main` builds and deploys automatically.

One-time setup:

1. Create a **public** GitHub repo named `greta` and push this code.
2. In the repo: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. In the [Firebase console](https://console.firebase.google.com/), **Authentication
   → Settings → Authorized domains**, add `<your-username>.github.io` so Google
   sign-in is allowed on the live site.

The app is then served at `https://<your-username>.github.io/greta/`. The Vite
`base` in [vite.config.ts](vite.config.ts) is set to `/greta/` to match — if you
name the repo something else, update `base` (and the manifest `start_url`/`scope`)
to match.

## Notes

- The PWA icons in `public/pwa-*.png` are simple placeholders — swap them for real
  artwork when you have some.
- Firebase web config is safe to ship in the client; security is enforced by the
  Firestore rules, not by hiding the keys.
