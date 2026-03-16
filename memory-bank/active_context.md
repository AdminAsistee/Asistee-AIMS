# Active Context
_Last updated: 2026-03-16 13:31 (JST)_

## Just Finished
- ✅ **Phase 1A** — Backend upgraded from Laravel 5.5/PHP 7.4 → **Laravel 12 / PHP 8.3**
- ✅ **Phase 1B** — Frontend upgraded from React 16/CRA → **React 18 / Vite 5 / TypeScript**
- ✅ **Phase 2** — All 70 API routes registered, CORS configured, Sanctum auth connected, browser login verified end-to-end
- ✅ **Phase 3** — All 6 module pages built: Dashboard, Bookings, Cleanings, Locations, Supplies, Users, Profile
- ✅ **Manual QA Session** — All module functionalities confirmed working in browser:
  - Fixed `app/User.php` Passport → Sanctum HasApiTokens (caused 500 on all user relation loads)
  - Fixed `App\Models\User::locations()` wrong namespace `App\Models\Location` → `\App\Location`
  - Fixed `cleaner` Gate allowing administrators → CleaningFilter was returning 0 cleanings for admins
  - Replaced raw Listing ID input in Bookings with Location dropdown
  - Seeded Manual channel account + listing workflow for booking creation
- ✅ **Data Cleanup** — All test data cleared; only 2 user accounts remain
- ✅ **GitHub Push** — Commit `b54a96b` on `origin/main`
- ✅ **Gen 3 Parity Audit** — Backend 100% complete; frontend gaps catalogued and added to Phase 4 roadmap
- ✅ **Phase 4A Quick Wins (coded, pending test & commit)**
  - Add User modal (`Users.tsx` + `UserController::adminCreate()` + `POST /users/admin-create`)
  - Location → Listing auto-create (`LocationController::create()` now seeds Manual channel + listing)
  - Booking guest_id dropdown (`Bookings.tsx` + `useClientOptions.ts`)
  - Cleaning form: Location dropdown (`Cleanings.tsx` full rewrite with `useLocationOptions`)
  - Cleaner Dashboard widgets: `TodayCleanings` + `UnassignedCleanings` + Assign Me (`Dashboard.tsx`)
  - Added `useCreateUser`, `useAssignMe`, `useClientOptions` hooks

## Current Focus
- [ ] **Phase 4** — Gen 3 parity completion (see updated `future_roadmap.md` for full expanded list)
- [ ] **QA Hardening** — Fix remaining 14 E2E test failures (add `htmlFor`/`id` to module modal form fields)

### Gen 3 Parity Audit Result (2026-03-16)
- ✅ Backend routes: 100% migrated (70 routes)
- ✅ Backend models: 100% migrated (15 models)
- ❌ **Frontend detail/single views**: 0% — Booking, Cleaning detail pages entirely missing
- ❌ **Cleaner Dashboard widgets**: ✅ Now implemented (Phase 4A)
- ❌ **Location detail enhancements**: Calendar, associated cleanings/bookings tables missing from drawer
- ❌ **Password Reset frontend**: Backend routes exist, no frontend pages
- ⚠️ **5 backend stubs**: NoteController, FeedbackController, ExtraServiceController, ChannelAccountController, ChannelManagerController

### Channel Manager Architecture Decision (2026-03-16)
- Channel Manager and iCal sync live **inside Location detail view** (not a separate page)
- **Flow A — Location-first**: Register Location → auto-creates Manual listing → later "Connect OTA" on listing → add `channel_listing_id` → Sync
- **Flow B — OTA-first**: Connect Channel Account → pull OTA property list → select property → system auto-creates Location + Listing
- Channel Accounts accessible from: Location detail drawer AND a global Settings page
- iCal URL stored per listing; "Sync Now" calls `ChannelController::pullCleanings()` (`johngrogg/ics-parser` installed)

## In Progress
- Both servers running locally:
  - Backend: `http://localhost:8001` (Laravel 12 + PHP 8.3 + Sanctum)
  - Frontend: `http://localhost:5173` (Vite 5 + React 18 + TypeScript)
- DB: clean state — only `tech@asistee.com` + `alexa@asistee.com`

## Immediate Next Step
**Test Phase 4A Quick Wins** in browser (not yet committed):
1. Users page → Add User modal (all roles)
2. Register a Location → verify listing auto-created
3. New Booking → verify Guest dropdown appears
4. New Cleaning → verify Location dropdown (not raw ID)
5. Login as cleaner → verify Dashboard shows cleaner widgets

After testing → commit `feat: Phase 4A — quick wins` → then proceed to Medium Effort items:
6. 🟡 **Booking Single Detail page** — `/bookings/:id`
7. 🟡 **Cleaning Single Detail page** — `/cleanings/:id`
8. 🟡 **Location detail: Listings tab** — with Connect OTA / Add iCal options

## Current Blockers
- ⚠️ **Phase 4A not yet committed** — awaiting browser test
- `laravel/horizon` cannot be installed on Windows (missing `ext-pcntl`) — not blocking
- 14 Playwright E2E tests still failing (modal form label selector issues) — not blocking
- No automated backend (PHPUnit/Pest) tests yet
