# MES + ECOUNT ERP Open API MVP

A production-aware MVP web app for MES-style quotation registration and producibility checks integrated with ECOUNT Open API through server-side route handlers.

## Features
- App signup/login/logout (username/password)
- Protected pages: `/dashboard`, `/products`, `/quotations`, `/checks`
- Product and required-parts (BOM-like) CRUD
- Quotation creation with multiple product lines
- Server-side ECOUNT login and inventory fetching
- Producibility decision logic from BOM requirement vs stock
- Optional quotation registration to ECOUNT behind env flag

## Tech stack
- Next.js (App Router)
- TypeScript
- Route Handlers for backend API
- File-based local persistence for MVP (`.data/db.json`)

## Folder structure
- `src/app/*`: UI pages and API route handlers
- `src/lib/auth/*`: app auth/session logic
- `src/lib/store/*`: local persistence layer
- `src/lib/ecount/*`: ECOUNT config/auth/client/mappers/services
- `src/lib/mes/*`: inventory-check business logic

## Quick start
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Build
```bash
npm run build
npm run start
```

## Environment variables
Use `.env.local`:
- `ECOUNT_COM_CODE`
- `ECOUNT_USER_ID`
- `ECOUNT_API_CERT_KEY`
- `ECOUNT_LAN_TYPE`
- `ECOUNT_ZONE`
- `ECOUNT_BASE_URL`
- `ECOUNT_ENABLE_QUOTATION_WRITE`
- `APP_SESSION_SECRET`

## ECOUNT integration notes
All browser-facing requests call local route handlers only. ECOUNT credentials are used only server-side.

### Files to edit first for real tenant connection
1. `src/lib/ecount/config.ts`
2. `src/lib/ecount/auth.ts`
3. `src/lib/ecount/inventory.ts`
4. `src/lib/ecount/mappers.ts`
5. `src/lib/ecount/quotation.ts`

### Important mapping TODOs
- Inventory response field mapping: `src/lib/ecount/mappers.ts`
- Quotation payload mapping: `src/lib/ecount/mappers.ts`
- Endpoint path adjustments: `src/lib/ecount/auth.ts`, `src/lib/ecount/inventory.ts`, `src/lib/ecount/quotation.ts`

## Inventory check logic
1. Read quotation items.
2. Expand into required parts based on product BOM-like definitions.
3. Aggregate required qty by part code.
4. Fetch ECOUNT stock server-side.
5. Compare required vs stock.
6. Return producibility summary + shortage table.

## GitHub push
```bash
git init
git add .
git commit -m "feat: mes mvp with ecount integration scaffolding"
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

## Vercel deploy
1. Push repo to GitHub.
2. Import project in Vercel.
3. Configure environment variables in Vercel project settings.
4. Deploy.

## Limitations / TODO
- Replace file DB with real DB (Postgres etc.)
- Harden auth (password policy, lockouts, CSRF)
- Confirm exact ECOUNT endpoint/payload/response shapes per company setup
- Add automated tests and audit logging
