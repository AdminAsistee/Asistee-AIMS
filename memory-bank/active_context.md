# Active Context
_Last updated: 2026-03-13 18:14 (JST)_

## Just Finished
- ✅ **Phase 1A** — Backend upgraded from Laravel 5.5/PHP 7.4 → **Laravel 12 / PHP 8.3**
- ✅ **Phase 1B** — Frontend upgraded from React 16/CRA → **React 18 / Vite 5 / TypeScript**
- ✅ **Phase 2** — All 70 API routes registered, CORS configured, Sanctum auth connected, browser login verified end-to-end

## Current Focus
- [ ] **Phase 3** — Build out module pages (Bookings, Cleanings, Locations, Supplies, etc.) in the new React 18 frontend
- [ ] Replace stub "coming soon" pages with actual working UI connected to live API

## In Progress
- The new stack is running locally:
  - Backend: `http://localhost:8001` (Laravel 12 + PHP 8.3 + Sanctum)
  - Frontend: `http://localhost:5173` (Vite 5 + React 18 + TypeScript)
- Login is fully working end-to-end with Sanctum token authentication

## Immediate Next Step
Build out the **Bookings module** page in the new frontend:
- Create a `useBookings` hook using TanStack Query → `GET /api/v1/bookings`
- Build a `BookingTable` component with sorting/filtering
- Add booking creation modal with React Hook Form + Zod validation

## Current Blockers
- Module pages are all stubs ("coming soon")
- Old Gen 3 tests are deleted — no new tests written yet for Laravel 12
- `laravel/horizon` (queue dashboard) cannot be installed on Windows (missing `ext-pcntl`)
