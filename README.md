# Lead-Gen Frontend

Dark, minimal React app: login, My Leads (batch cards + lead management),
Main Sheet (shared leads, admin can delete), and an admin-only Create User page.

## One-time setup

### 1. Add Firestore security rules (required — do this before testing login)
Your Firestore was created in "Production mode," which blocks all reads by
default. The app needs to read a logged-in user's own role doc to know if
they're an admin.

Go to Firebase Console → your project → Firestore Database → **Rules** tab.
Replace the contents with what's in `firestore.rules` in this folder, then
click **Publish**.

### 2. Point the app at your backend
Open `src/api.js` and set `BACKEND_URL` to your real deployed Vercel backend
URL (same value as in the companion script's `discover.js`).

### 3. Install and run locally to test
```
npm install
npm run dev
```
This opens the app at `http://localhost:5173`. Log in with the admin account
you created in Firebase.

## Deploying
Push this folder to its own GitHub repo (or a subfolder of the same repo as
the backend), connect it to a new Vercel project, and deploy — no
environment variables needed for the frontend, since the Firebase client
config is public and already in `src/firebase.js`.

## What's built
- **Login** — email/password, "Forgot password?" triggers Firebase's real reset email.
- **My Leads** — empty state with Discover Leads instructions, batch cards, global search across all batches, follow-ups-due banner, per-lead status/notes/follow-up/priority/call-count, share + delete buttons.
- **Main Sheet** — read-only list for normal users; admins get per-row delete and "clear entire sheet."
- **Create User** (admin-only) — name/email/temp password/role form.
- Dark theme with a subtle CSS-only animated gradient background (respects `prefers-reduced-motion`).

## Known limitation to test carefully
The "Possible Duplicate" flag from the backend (`/api/leads/batch`) isn't
surfaced in this UI yet — batches will show, but there's no visual duplicate
warning on the lead itself post-import. If that matters for real usage,
flag it and it can be added to `LeadRow.jsx`.
