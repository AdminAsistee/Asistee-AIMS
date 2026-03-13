# Progress Log

## 2026-03-13 18:14 (JST) — Project Brain Initialized
- Memory bank activated for Asistee AIMS project.
- Created `memory-bank/` at project root with all four core documents.

---

## 2026-03-12 07:00 (JST) — Project Audit & Repository Setup
- Audited the AIMS project (Gen 2 + Gen 3 codebases) — see `asistee_audit.md`.
- Confirmed local Git repo (`Asistee-AIMS`) connected to `AdminAsistee/Asistee-AIMS` on GitHub.
- Removed unused local folders (`asistee-portal`, `Superhost-Tools`).
- Decided to keep **monorepo structure** (`backend/` + `frontend/`) for simplicity.
- **Files affected**: `.gitignore`, local filesystem cleanup.

## 2026-03-12 09:00 (JST) — Admin Account Configuration
- Updated `DEV_EMAIL` in `.env.example` to `tech@asistee.com` to designate the new admin account.
- Created `tech@asistee.com` account in the old `aims_core` DB with `type = administrator`.
- **Decision**: RBAC is determined by the `DEV_EMAIL` env variable — whoever matches gets admin on register.

## 2026-03-13 06:00 (JST) — Phase 1A: Backend Upgrade (Laravel 5.5 → Laravel 12)
- Installed PHP 8.3.29 (NTS x64) as standalone at `$USERPROFILE\Documents\php83\`.
- Created fresh Laravel 12 project as `backend-new/`, then swapped to `backend/`.
- Installed packages: `laravel/sanctum`, `laravel/cashier`, `johngrogg/ics-parser`, `stripe/stripe-php`.
- Skipped `laravel/horizon` — missing `ext-pcntl` on Windows.
- Replaced Passport with **Sanctum** — simpler SPA auth, no OAuth2 needed.
- Removed deprecated `Cashier::useCurrency()` from `AppServiceProvider`.
- Deleted conflicting Laravel 12 default migrations (users, cache, jobs).
- Migrated all 19 Gen 3 migrations onto new `aims_core_v2` MySQL database.
- **Files affected**: `backend/` (entire Laravel 12 project), `backend/app/Models/User.php`, `backend/app/Providers/AppServiceProvider.php`, `backend/.env`, `backend/config/sanctum.php`, `backend/config/cashier.php`.
- **Git commit**: `7ee6513` — pushed to `main` on GitHub.

## 2026-03-13 07:00 (JST) — Phase 1B: Frontend Upgrade (React 16 CRA → React 18 + Vite 5 + TS)
- Installed Node.js 20.18.3 LTS (upgraded from 14.21.3).
- Scaffolded Vite 5 + React 18 + TypeScript project as `frontend-new/`, then swapped to `frontend/`.
- Key packages: `react-router-dom@6`, `@tanstack/react-query`, `zustand`, `react-hook-form`, `zod`, `axios`, `tailwindcss@3`, `lucide-react`.
- Built: Axios API client (Sanctum Bearer token), Zustand auth store, Login + Register pages, Layout shell with sidebar, all module stub pages.
- Vite build verified: 1942 modules, 385kB JS, 10.8kB CSS, 4.9s.
- **Files affected**: `frontend/` (entire new frontend project).
- **Git commit**: `cfb719d` — pushed to `main` on GitHub.

## 2026-03-13 18:00 (JST) — Phase 2: API Audit & Frontend–Backend Connection
- **Root cause fix**: `bootstrap/app.php` was missing `api:` route registration — all API routes were silently ignored.
- Consolidated all 8 Gen 3 route files into a single `routes/api.php` with 70 routes.
- Added `POST /api/v1/login` to `UserController` returning Sanctum Bearer token.
- Fixed `logout()` to use `currentAccessToken()->delete()` (Sanctum method, not Passport's `token()->revoke()`).
- Fixed PHP 8.3 method signature incompatibilities: updated `mutateForCreation` / `mutateForUpdate` signatures in base `Controller.php` and 5 child controllers.
- Stripped BOM characters from 5 controller files (introduced by PowerShell `Set-Content`).
- Created `config/cors.php` allowing `localhost:5173` (Vite) to call `localhost:8001` (Laravel).
- Fixed `App\User` → `App\Models\User` namespace across all controllers.
- Seeded `tech@asistee.com` (administrator) and `alexa@asistee.com` (client) into `aims_core_v2`.
- **Verified**: 70 routes in `artisan route:list`, login returns token, `/me` works, browser login redirects to dashboard as "Tech Admin (administrator)".
- **Files affected**: `backend/bootstrap/app.php`, `backend/routes/api.php`, `backend/app/Http/Controllers/UserController.php`, `backend/app/Http/Controllers/Controller.php`, `backend/config/cors.php`, 5 other controllers.
- **Git commit**: `cf8978e` — pushed to `main` on GitHub.
