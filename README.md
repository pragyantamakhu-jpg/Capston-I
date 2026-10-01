# FoodHub

A food-ordering web app where users browse restaurants, filter menus by dietary preference, build a cart with voucher discounts, and get AI-powered meal recommendations when they can't decide what to order.

**Live app:** https://capston-i.vercel.app/
**Test login:** `test@example.com` / `test000`

## What problem does this solve?

FoodHub lets users browse restaurants, filter menus by veg/non-veg and cuisine, add items to a cart with voucher discounts, and get AI-powered meal suggestions when they can't decide what to order. It's built for everyday customers who want a quick, familiar ordering experience similar to apps like Zomato or Uber Eats. I chose this idea because food ordering is a problem everyone understands, and it gave me a natural place to use AI meaningfully — instead of a generic chatbot, the AI recommends specific dishes from the actual menu and explains why, based on the user's dietary filters.

## Features

- Browse restaurants, favorite the ones you like (saved locally)
- Filter a restaurant's menu by Veg / Non-veg / All
- Add items via a quantity stepper, synced across the app through a shared cart
- Apply voucher codes (percentage or flat discounts) at checkout
- Place an order and view full order history with itemized detail
- AI meal recommendation modal — pick dietary filters, get 2–3 AI-explained picks from the actual menu, with a graceful fallback if the AI call fails
- Email/password authentication (Firebase) — the whole app requires login except `/login`, `/signup`, and `/health`
- Admin pages for dashboard stats, order status management, and menu overview (not linked in nav — reachable by direct URL, intended for a future role-gated admin role)
- Fully responsive (tested at 375px and 1280px+)

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | Firebase Auth (email/password) |
| AI | Google Gemini API (`@google/genai`, model `gemini-3.6-flash`) |
| State | React Context (Cart, Orders, Favorites, Auth) + localStorage persistence |
| Testing | Vitest + React Testing Library |
| Deployment | Vercel |
| Icons | lucide-react |

## Setup & run locally

```bash
git clone https://github.com/pragyantamakhu-jpg/foodhub-next.git
cd foodhub-next
npm install
```

Copy `.env.example` to `.env.local` and fill in your own values:

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GEMINI_API_KEY=


- Firebase keys: create a free project at [console.firebase.google.com](https://console.firebase.google.com), enable **Authentication → Email/Password**, copy the web app config
- Gemini key: get a free key at [aistudio.google.com](https://aistudio.google.com) (no credit card required)

Then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/login` — sign up for a new account or use the test credentials above (on the live deployment; local dev needs your own Firebase project).

## Architecture overview

src/
├── app/ # Routes (Next.js App Router, Server Components by default)
│ ├── page.tsx # Home — restaurant list + Favorites tab
│ ├── restaurants/[id]/ # Menu for one restaurant, with filter + stepper
│ ├── cart/ # Cart, voucher logic
│ ├── checkout/ # Order creation
│ ├── orders/ # Order history + detail
│ ├── login/ signup/ # Firebase Auth forms
│ ├── admin/ # Dashboard, order mgmt, menu mgmt (no nav link)
│ ├── health/ # Public health-check page, proves server fetching works
│ └── api/recommend/ # Server-only route calling Gemini
├── components/ # Presentational components (Nav, cards, modal, etc.)
├── context/ # CartContext, OrderContext, FavoritesContext, AuthContext
├── lib/
│ ├── data/ # Data-access layer — the ONLY place that imports mock JSON
│ ├── mock/ # restaurants.json, menu.json, vouchers.json
│ ├── firebase/ # Firebase init + auth wrapper functions
│ └── cart/ # Pure discount-calculation function (unit tested)
└── types/ # Shared TypeScript interfaces


**Key architectural decisions:**
- **Data-access layer** (`lib/data/`): components never import JSON directly — they call `getRestaurants()`, `getMenuByRestaurantId()`, etc. This means swapping mock data for a real database later only requires changing these few files, not every page.
- **Server Components by default**: pages fetch data server-side where possible. `"use client"` is used only where interactivity is genuinely needed (forms, cart state, the modal).
- **Route protection**: `AuthGuard` wraps the whole app in `layout.tsx`, redirecting unauthenticated users to `/login` for every route except the three public ones.

## AI integration

The **"Find your meal"** feature (modal, triggered from the nav bar) lets users pick a veg/non-veg preference and a cuisine, then calls `/api/recommend`, a server-only API route.

**Why Gemini, and why this design:**
- The route pre-filters the menu in plain JavaScript first (so the AI only ever sees items matching the user's actual filters)
- It then sends that filtered list to Gemini with a prompt asking it to pick 2–3 items and explain, in one sentence each, why they fit — forcing the response into strict JSON so the UI can render it reliably
- If the Gemini call fails for any reason (network issue, bad response), the route falls back to returning the first few filtered items with a generic "Popular pick" label, so the feature degrades gracefully instead of breaking
- The API key is read only inside the server-side route handler — it's never sent to the browser

This was chosen over a generic chatbot because the AI does real interpretive work (picking and justifying specific dishes) rather than just echoing text back — a plain dropdown filter already narrows the list, the AI's job is explaining *why* each pick fits.

## Testing

```bash
npm run test
```

9 tests covering:
- `QuantityStepper` — renders quantity, increment/decrement callbacks, disabled state at 0
- `calculateDiscount` — percentage vs flat discount math, capped at subtotal, null voucher handling
- Home page's empty Favorites state

## Performance & accessibility

Lighthouse (mobile, live deployment):

| Category | Score |
|---|---|
| Performance | 91 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

**One concrete improvement made from an audit finding:** Lighthouse's network trace showed Firebase Auth's default initialization loading an auth iframe + fetching project config (~2.3 seconds) — overhead only needed for popup/redirect sign-in, which this app doesn't use (email/password only). Switching to `initializeAuth()` with only `indexedDBLocalPersistence` configured removed that chain entirely, cutting Largest Contentful Paint from 5.7s to ~3.2s and raising the Performance score from 78 to 91+.

axe DevTools (WCAG 2.1 AA): 0 issues across Home, Restaurant Menu, Orders, and the Recommend modal.

## Known limitations & future improvements

- **Mock data, not a real database** — restaurants/menu/vouchers are static JSON files. The data-access layer (`lib/data/`) is structured so swapping in a real database (e.g. MongoDB) would only require changing those files, not any UI code.
- **Admin pages aren't role-gated** — they exist and work, but are only reachable by typing the URL directly, not linked in navigation. A production version would check a user role before allowing access.
- **Firebase Auth adds some unavoidable initial load time** — even after the iframe/getProjectConfig fix, there's still a network round-trip to confirm auth state before the app renders. A future version might explore server-side session verification to remove this entirely.
- **No real payment processing** — checkout collects name/address only; this is a mock order flow, not connected to a payment provider.
- **Cart/Favorites/Orders are stored in localStorage**, not synced to a user's account across devices — a real backend would move this server-side, tied to the authenticated user.

## Deployment

Deployed on Vercel, connected to this GitHub repo's `main` branch — every push triggers an automatic build and deployment.

**Rollback plan:** Vercel keeps every previous deployment. If a deployment breaks something, go to the Vercel dashboard → Deployments → find the last known-good one → "..." menu → "Promote to Production." No code changes needed, takes under a minute.

**Environment variables** (Firebase config + Gemini key) are set in Vercel's dashboard under Project Settings → Environment Variables, not committed to the repo.