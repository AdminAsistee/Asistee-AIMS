# Tech Stack

## Frontend
| Layer | Old (Gen 3) | New (Upgraded) |
|---|---|---|
| Framework | React 16 + Create React App | React 18 + Vite 5 |
| Language | JavaScript | TypeScript |
| Routing | React Router v4 | React Router v6 |
| State Management | Redux + Redux Thunk | Zustand (auth), TanStack Query (server state) |
| HTTP Client | Axios (manual) | Axios + TanStack Query |
| Forms | Manual / uncontrolled | React Hook Form + Zod |
| Styling | Tachyons CSS (CDN) | Tailwind CSS v3 + lucide-react |
| Icons | — | lucide-react |
| Build | Webpack (CRA) | Vite 5 |

### Frontend Dependencies
- `react@18`, `react-dom@18`
- `vite@5`, `@vitejs/plugin-react@4`
- `typescript`
- `react-router-dom@6`
- `@tanstack/react-query`
- `zustand` (+ `zustand/middleware` persist)
- `axios`
- `react-hook-form`, `zod`, `@hookform/resolvers`
- `tailwindcss@3`, `postcss`, `autoprefixer`
- `lucide-react`, `clsx`, `tailwind-merge`
- `date-fns`

## Backend
| Layer | Old (Gen 3) | New (Upgraded) |
|---|---|---|
| Language | PHP 7.4 | PHP 8.3.29 (NTS x64 standalone) |
| Framework | Laravel 5.5 | Laravel 12 |
| Auth | Laravel Passport (OAuth2) | Laravel Sanctum (Bearer token SPA auth) |
| Database | MySQL (`aims_core`) | MySQL (`aims_core_v2`) |
| Payments | Laravel Cashier (old) | Laravel Cashier v16 |
| iCal | johngrogg/ics-parser | johngrogg/ics-parser (same) |
| Queue | Laravel Horizon (broken on Windows) | Sync driver (local), TODO: switch on Linux |
| CORS | fruitcake/laravel-cors (old package) | Built-in Laravel 12 HandleCors middleware |

### Backend Dependencies (composer.json)
- `laravel/framework@^12`
- `laravel/sanctum`
- `laravel/cashier`
- `johngrogg/ics-parser`
- `stripe/stripe-php`

## Infrastructure & Cloud
- **Local dev**: XAMPP (Apache + MySQL), PHP 8.3 standalone
- **Version control**: GitHub — `AdminAsistee/Asistee-AIMS` (monorepo)
- **Production**: Not yet deployed on new stack

## Database
- **Database**: MySQL via XAMPP
- **New DB name**: `aims_core_v2` (fresh for new stack)
- **Access**: phpMyAdmin at `http://localhost/phpmyadmin`
- **Credentials**: root / (no password) — local only

## Architectural Decisions
| Date | Decision | Rationale |
|---|---|---|
| 2026-03-12 | Monorepo (`backend/` + `frontend/`) | Small team, tightly coupled, simpler CI |
| 2026-03-12 | Sanctum over Passport | SPA auth simpler, no OAuth2 complexity needed |
| 2026-03-12 | Laravel 12 (not 11) | Latest stable with PHP 8.3 support |
| 2026-03-12 | Vite 5 (not Vite 6) | Node 20.18.3 incompatible with Vite 6 (requires 20.19+) |
| 2026-03-12 | Tailwind v3 (not v4) | v4 @tailwindcss/vite plugin had peer dep conflicts |
| 2026-03-13 | aims_core_v2 database | Avoid conflicts with old Gen 3 aims_core data during transition |
| 2026-03-13 | Unified api.php | Replaced 8 separate route files with single file, cleaner maintenance |
