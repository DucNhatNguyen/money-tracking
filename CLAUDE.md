# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server on localhost:3000
npm run build    # production build
npm run lint     # ESLint
npm run seed     # seed database (categories + admin user)

# Playwright tests (mobile Pixel 5 only — desktop UI not fully implemented)
npm run test              # run all 80 tests headless
npm run test:ui           # interactive Playwright UI
npm run test:headed       # watch mode in browser
npm run test:report       # open last HTML report
```

Run a single test file:
```bash
npx playwright test tests/auth.spec.ts
```

## Architecture

**FinFamily** is a Vietnamese family expense-tracking app with a real backend.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Prisma 7 · Neon PostgreSQL · iron-session

### Required environment variables

```
DATABASE_URL=     # Neon PostgreSQL connection string
SESSION_SECRET=   # iron-session encryption key (32+ chars)
```

On Vercel: set these in **Dashboard → Project → Settings → Environment Variables** then redeploy. The `postinstall` script runs `prisma generate` automatically after `npm install`.

### Routing (App Router)

| Route | Component | Auth |
|---|---|---|
| `/` | `Dashboard` | required |
| `/transactions` | `Transactions` | required |
| `/add` | `AddTransaction` | required |
| `/reports` | `Reports` | required |
| `/budget` | `Budget` | required |
| `/login` | `LoginPage` | public |
| `/register` | `RegisterPage` | public |

Each page file (`src/app/<route>/page.tsx`) is a thin wrapper. Public routes are declared in `src/proxy.ts`.

### Auth flow

- **Middleware**: `src/proxy.ts` (not `middleware.ts` — Next.js 16 breaking change). Exported function must be named `proxy`, not `middleware`. Checks `ff_session` cookie; redirects unauthenticated users to `/login`.
- **Session**: iron-session v8 with httpOnly cookie `ff_session`. Use `getSession()` from `src/lib/session.ts` in Server Components and Server Actions.
- **Passwords**: bcryptjs, 12 salt rounds.
- **Registration**: email field is auto-generated as `username@finfamily.local` (not exposed to user).
- **Login**: accepts username or email (`OR` query).

### Data layer

- **Prisma 7**: uses `prisma-client` generator (not `prisma-client-js`). Generated files live in `src/generated/prisma/`; import from `@/generated/prisma/client` (not `@/generated/prisma`).
- **Adapter**: `PrismaNeonHttp` (HTTP, Vercel-safe). **Does not support transactions** — avoid `prisma.$transaction()`, `createMany()`, or `upsert()` as they internally use transactions.
- **Singleton**: `src/lib/prisma.ts` uses `globalThis` to avoid multiple clients in dev.

### Server Actions

All mutations live in `src/app/actions/`. Pattern: `useActionState(action, null)` on the client, form `action={action}`. Logout uses `<form action={logoutAction}>` (not `onClick`) so it works as a Server Action.

### Layout

`AppShell` (`src/components/AppShell.tsx`) wraps every page via `src/app/layout.tsx` (async Server Component that reads session and passes `user` prop). AppShell renders nothing (no nav) when `pathname === '/login'` or `/register`.

- **Mobile** (`lg:hidden`): bottom nav bar + FAB
- **Desktop** (`lg:flex`): fixed topbar + left sidebar (232px)

**Critical**: AppShell renders `{children}` **twice** — once in the mobile div and once in the desktop div. Both are in the DOM simultaneously (CSS hides one). This means every page element exists twice in the DOM. In Playwright tests always use `.first()` on selectors, or `getByRole(..., { exact: true }).first()`, to avoid strict-mode violations.

### Styling conventions

All UI is built with inline `style` props — Tailwind is used **only** for responsive visibility (`lg:hidden`, `lg:flex`, `hidden lg:block`). Do not add Tailwind utility classes for colors, spacing, or typography.

**Color palette:**
- Background: `#0B0F1E` (page), `#0D1322` (shell), `#141C30` (cards)
- Primary accent: `#7B6EF6` (purple)
- Secondary accent: `#2DD4BF` (teal)
- Expense/danger: `#F87171`
- Text primary: `#E2E8F0`, text muted: `#64748B`

**Font:** Be Vietnam Pro via `next/font/google`, CSS variable `--font-bvp`.

### Tailwind CSS v4

`globals.css` uses `@import "tailwindcss"` (not the v3 `@tailwind` directives). Custom theme tokens under `@theme {}`.

### Seed script

`prisma/seed.ts` uses `neon()` raw SQL (no Prisma client, no transactions). Runs via `node --env-file=.env --import tsx/esm` — tsx does **not** auto-load `.env`, so the `--env-file` flag is required.

Default seed: 10 categories, user `admin` / `admin123`, 5 sample transactions.

### PWA

The app is a PWA targeting iOS. Key files:

- `src/app/manifest.ts` — Web App Manifest (`display: standalone`, theme `#7B6EF6`)
- `src/app/api/pwa-icon/route.tsx` — generates PNG icons at any size via `ImageResponse`; used by manifest (192×512) and as favicon/apple-touch-icon
- `public/sw.js` — Service Worker with network-first caching strategy
- `src/components/ServiceWorkerRegistration.tsx` — registers SW client-side (`useEffect`)

**iOS quirk**: Next.js 16 generates `mobile-web-app-capable` (Android) from `appleWebApp.capable`, NOT `apple-mobile-web-app-capable` (iOS). The iOS tag is added explicitly via `other: { "apple-mobile-web-app-capable": "yes" }` in `layout.tsx` metadata.

**File convention bug**: `app/apple-icon.tsx` and `app/icon.tsx` return HTML instead of PNG in Next.js 16 dev mode (Turbopack). Use the `/api/pwa-icon` route handler instead and reference it in metadata `icons`.

### Playwright tests

- **Config**: `playwright.config.ts` — Pixel 5 mobile viewport only (393×851). Desktop not tested.
- **Tests**: `tests/` — 80 tests across `auth`, `dashboard`, `transactions`, `add-transaction`, `reports`, `budget`
- **Helper**: `tests/helpers.ts` exports `login()` and `TEST_USER` (`admin` / `admin123`)
- **Logout on mobile**: logout buttons are hidden on mobile (inside `lg:flex` desktop div). Use `page.evaluate()` with native `btn.click()` to bypass CSS visibility.
- **Date handling**: never use `.toISOString().slice(0, 10)` for expected dates — gives UTC, not local time. Use `getFullYear()` / `getMonth()` / `getDate()` instead.
