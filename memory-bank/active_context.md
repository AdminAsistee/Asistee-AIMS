# Active Context
_Last updated: 2026-03-16 08:00 (JST)_

## Just Finished
- ✅ **Phase 1A** — Backend upgraded from Laravel 5.5/PHP 7.4 → **Laravel 12 / PHP 8.3**
- ✅ **Phase 1B** — Frontend upgraded from React 16/CRA → **React 18 / Vite 5 / TypeScript**
- ✅ **Phase 2** — All 70 API routes registered, CORS configured, Sanctum auth connected, browser login verified end-to-end
- ✅ **Phase 3** — All 6 module pages built: Dashboard, Bookings, Cleanings, Locations, Supplies, Users, Profile
- ✅ **Bug Fix Session** — Fixed login (seeded passwords), missing backend Gates, and 401 interceptor redirect loop
- ✅ **QA E2E Suite** — 37 Playwright tests written, 23/37 passing, `QA_STATUS.md` created
- ✅ **GitHub Push** — Commit `3e75d7a` on `origin/main` with full Phase 3 + QA code

## Current Focus
- [ ] **Phase 4** — iCal sync, Channel Manager integration, Extra Services, Pricing Engine
- [ ] **QA Hardening** — Fix remaining 14 E2E test failures (add `htmlFor`/`id` to module modal form fields)
- [ ] **Booking guest_id** — Admin should be able to specify which client a booking is for when creating

## In Progress
- Both servers running locally:
  - Backend: `http://localhost:8001` (Laravel 12 + PHP 8.3 + Sanctum)
  - Frontend: `http://localhost:5173` (Vite 5 + React 18 + TypeScript)
- DB: clean state — only `tech@asistee.com` (administrator) and `alexa@asistee.com` (client) exist

## Immediate Next Step
Begin **Phase 4** planning:
1. iCal sync UI — connect `johngrogg/ics-parser` backend to a frontend import flow
2. Channel Manager — UI for managing Airbnb/Booking.com OTA channel accounts
3. Extra Services — allow booking add-ons (airport transfer, welcome pack, etc.)
4. Pricing Engine — dynamic pricing rules per listing/season

## Current Blockers
- `laravel/horizon` (queue dashboard) cannot be installed on Windows (missing `ext-pcntl`) — not blocking Phase 4
- 14 Playwright E2E tests still failing (modal form label selector issues) — not blocking Phase 4
- `guest_id` not assigned when admin creates a booking — deferred to a later fix
- No automated backend (PHPUnit/Pest) tests yet for Laravel 12
