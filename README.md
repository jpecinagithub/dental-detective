# Dental Detective 3D — Aurora Dental Clinic

Original-IP dental diagnosis puzzle game (Vite + React + TypeScript, no backend).

Examine 15 patients, decode deceptive symptoms with the help of clinical clues,
inspect mouths with the 3-step zoom (E), and choose the right treatment:
**Filling** (1), **Extraction** (2) or **Root canal** (3).

- Start: 75 pts · Correct: +30 · Wrong: −50 · Game over below 0
- Bilingual EN (default) / ES, responsive, PWA, localStorage leaderboard

## Run

```bash
npm install
npm run dev      # dev server
npm test         # vitest (10 tests)
npm run build    # production build -> dist/
```

## Deploy (Vercel)

Import the repo in Vercel as a Vite project and deploy. Enable Web Analytics
in the Vercel dashboard (`@vercel/analytics` is already wired in).

Developed by Jon Peciña Iturbe · jpecina@gmail.com
