# Deployment Checklist — FoodHub

**Deployed by:** Pragyan Tamakhu
**Date:** [Oct 1 2026]
**Live URL:** https://capston-i.vercel.app/
**Repo:** https://github.com/pragyantamakhu-jpg/foodhub-next

## Pre-deployment

- [x] `npm run build` completes with zero errors
- [x] `npm run test` — all tests passing (9/9)
- [x] No secrets committed to the repo (`.env.local` confirmed excluded via `git status`; `.env.example` confirmed tracked with empty placeholder values)
- [x] `.gitignore` verified to exclude `node_modules`, `.next`, `.env*` (with explicit `.env.example` exception)
- [x] Responsive checked at 375px and 1280px+ viewports

## Environment configuration

- [x] All required environment variables set in Vercel dashboard (Project Settings → Environment Variables), not in the repo:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID` (Config type — intentionally public, standard for Firebase client SDKs)
  - `GEMINI_API_KEY` (Secret type — server-only, never exposed to the client)
- [x] Firebase Authentication → Email/Password sign-in method enabled in Firebase console

## Deployment

- [x] Connected to Vercel via GitHub integration — every push to `main` triggers an automatic build + deploy
- [x] Production domain confirmed as `capston-i.vercel.app`, tagged "Production" in Vercel
- [x] `X-Robots-Tag: index, follow` explicitly set in `next.config.ts` (overriding an unexplained Vercel-injected `noindex` header found during the SEO audit)

## Post-deployment verification

- [x] Live site loads with no build/runtime errors
- [x] Full user flow manually tested on production: sign up → browse restaurants → add items to cart → apply voucher → checkout → view order in history
- [x] Firebase Auth tested on production: signup, login, logout all confirmed working
- [x] AI recommend feature tested on production: confirmed real Gemini responses (not fallback-only)
- [x] `/health` page confirmed publicly accessible (no login required) and renders live fetched data

## Error handling & resilience

- [x] AI recommend feature has a fallback: if the Gemini API call fails, the UI shows generic "Popular pick" results instead of breaking
- [x] Checkout blocks submission with inline validation errors if required fields are empty
- [x] Checkout shows an inline error with a retry option if order creation fails
- [x] Non-existent restaurant/order IDs show a "not found" message instead of crashing
- [x] Unauthenticated users are redirected to `/login` rather than seeing a broken/blank page

## Monitoring & rollback

- **Monitoring:** No dedicated monitoring service set up (out of scope for this capstone). Vercel's dashboard shows deployment status, build logs, and basic request logs for each deployment.
- **Rollback plan:** Vercel retains every previous deployment. If a new deployment breaks something, go to Vercel → Deployments → select the last known-good deployment → "..." menu → "Promote to Production." This takes effect within seconds, no code changes or new commits required.

## Final sign-off

- [x] I have personally clicked through the live, deployed app and confirmed the core flow works end-to-end
- [x] I know how to roll back if something breaks post-submission

