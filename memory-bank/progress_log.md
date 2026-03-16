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

---

## 2026-03-16 06:20 (JST) — Phase 3: Module Pages Built
- Built **Dashboard** with 4 live KPI stat cards (bookings, upcoming cleanings, locations, supplies).
- Replaced all 6 stub pages with fully functional modules connected to the live Laravel 12 API:
  - **Bookings** — paginated table, create/edit/delete modals (RHF + Zod).
  - **Cleanings** — paginated table, TF-status badge, create modal, assign/unassign cleaner (admin/supervisor only).
  - **Locations** — card grid with slide-in detail drawer, photo upload, create modal.
  - **Supplies** — card grid with animated stock bars, create/buy/use stock modals.
  - **Users** — admin-only paginated table, inline role editor, delete with confirmation.
  - **Profile** — avatar initials, edit profile form, change password section.
- Created shared infrastructure: `src/types/index.ts` (all model interfaces), 5 TanStack Query hook files (`useBookings`, `useCleanings`, `useLocations`, `useSupplies`, `useUsers`), 4 reusable UI components (`Modal`, `Badge`, `Pagination`, `ConfirmDialog`).
- **Build verified**: `tsc --noEmit` → 0 errors. `vite build` → ✓ built in 5.4s.
- **Files affected**: `frontend/src/types/index.ts`, `frontend/src/hooks/` (5 files), `frontend/src/components/ui/` (4 files), `frontend/src/pages/` (7 files).

---

## 2026-03-16 07:10 (JST) — Bug Fix: Login & Navigation Loop
- **Root cause**: User passwords in DB didn't match — reset both `tech@asistee.com` and `alexa@asistee.com` to `aimsasistee` via PHP script.
- **Root cause**: `CleaningController` (and others) used `Gate::allows('operations')` but the `operations` gate was never defined in `AppServiceProvider` — causing 403 on all module data endpoints.
- **Fix**: Added all missing Gates to `backend/app/Providers/AppServiceProvider.php`: `operations`, `kankeisha`, `client`, `view_Cleaning`, `update_Cleaning`, `view_Location`, `update_Location`, `create_Location`.
- **Root cause**: `api.ts` 401 interceptor wiped `aims_token` AND `aims-auth` (Zustand persist) on any 401, causing a redirect loop (Zustand still showed `isAuthenticated: true`, so PublicRoute sent user back to `/`).
- **Fix**: Interceptor now only logs out when the `/me` or `/login` auth endpoint returns 401 — not on module data permission errors.
- **Fix**: Added `htmlFor`/`id` attributes to Login form email and password inputs for Playwright selector compatibility and accessibility.
- **Verified in browser**: All 6 module pages navigate correctly without redirect loops.
- **Files affected**: `backend/app/Providers/AppServiceProvider.php`, `frontend/src/lib/api.ts`, `frontend/src/pages/Login.tsx`.

---

## 2026-03-16 07:55 (JST) — QA E2E Suite + GitHub Push
- Invoked `@qa-architect full` — wrote Playwright E2E tests for all 6 module pages.
- Created `frontend/e2e/helpers.ts` (shared `loginAsAdmin()` helper).
- Created 5 new spec files: `auth.spec.ts` (fixed), `bookings.spec.ts`, `cleanings.spec.ts`, `locations.spec.ts`, `supplies.spec.ts`, `users-profile.spec.ts` — 37 tests total.
- Installed Playwright Chromium browser (`npx playwright install chromium`).
- **Test results**: 23/37 passing (62%). 14 failures are selector mismatches on module forms (missing `htmlFor`/`id` on modal inputs) — documented in `QA_STATUS.md`.
- Cleaned all test data from DB (8 tables truncated, 2 user accounts preserved).
- **Git commit**: `3e75d7a` — `feat: Phase 3 — module pages + QA E2E suite` — pushed to `origin/main`.
- **Files added**: `frontend/e2e/helpers.ts`, `frontend/e2e/bookings.spec.ts`, `frontend/e2e/cleanings.spec.ts`, `frontend/e2e/locations.spec.ts`, `frontend/e2e/supplies.spec.ts`, `frontend/e2e/users-profile.spec.ts`, `frontend/QA_STATUS.md`.

---

## 2026-03-16 12:34 (JST) — Manual QA Bug Fixes + Data Cleanup + GitHub Push
- **Bug**: `app/User.php` still used `Laravel\Passport\HasApiTokens` → replaced with `Laravel\Sanctum\HasApiTokens`. Fixed all module endpoints that eager-load User relations (locations.owner, cleaning.cleaner, etc.) crashing with 500.
- **Bug**: `App\Models\User::locations()` used bare `Location::class` → resolved to `App\Models\Location` (doesn't exist). Fixed to `\App\Location::class`.
- **Bug**: `cleaner` Gate allowed `administrator` type → `CleaningFilter` added `WHERE cleaner_id=admin_id` for admins, returning 0 cleanings. Fixed: gate now only matches `type === 'cleaner'`.
- **Bug**: `CleaningController` had unused `use Laravel\Passport\Passport` import — removed.
- **Enhancement**: `LocationController::index()` now eager-loads `listings` relation for Booking form dropdown.
- **Enhancement**: `Bookings.tsx` — replaced raw Listing ID number input with Location dropdown (auto-resolves `listing_id`). New hook `useLocationOptions.ts` added.
- **Data seeded during QA**: channel_account (Manual Bookings), listing (Noa Dogenzaka), location, booking, 2 cleanings, 1 supply — all cleared after testing.
- **DB state**: clean — only `tech@asistee.com` (administrator) + `alexa@asistee.com` (client) remain.
- **Git commit**: `b54a96b` — `fix: resolve critical runtime bugs found during manual QA` — pushed to `origin/main`.
- **Files affected**: `backend/app/User.php`, `backend/app/Models/User.php`, `backend/app/Providers/AppServiceProvider.php`, `backend/app/Http/Controllers/CleaningController.php`, `backend/app/Http/Controllers/LocationController.php`, `frontend/src/pages/Bookings.tsx`, `frontend/src/hooks/useLocationOptions.ts`.

---

## 2026-03-16 12:57 (JST) — Gen 3 Feature Parity Audit
- Full side-by-side audit of `backend-legacy/` + `frontend-legacy/` vs current `backend/` + `frontend/`.
- **Backend**: 100% complete — 70 routes migrated, 15 models migrated, all controller methods present.
- **Frontend gaps discovered** (new, not in previous Phase 4 plan):
  - `/bookings/:id` Booking detail page entirely missing (Gen 3: `BookingSingle.js` — editable dates, related location/cleaning panels).
  - `/cleanings/:id` Cleaning detail page entirely missing (Gen 3: `CleaningSingle.js` — supply request panel, fulfill/deliver workflow, next booking info).
  - Location drawer missing property calendar + associated cleanings/bookings tables (Gen 3: `LocationSingle.js`).
  - Cleaner Dashboard widgets missing (`TodayCleanings.js` + `UnassignedCleanings.js`).
  - Password Reset frontend missing — backend routes exist (`/request-password-reset`, `/reset-password`), no frontend pages.
- **4 backend stubs unimplemented**: `NoteController`, `FeedbackController`, `ExtraServiceController`, `ChannelAccountController`.
- Updated `future_roadmap.md` and `active_context.md` with all newly discovered gaps.
- **Files affected**: `memory-bank/future_roadmap.md`, `memory-bank/active_context.md`, `memory-bank/progress_log.md`.

---

## 2026-03-16 13:20 (JST) — Phase 4A Quick Wins (coded, pending test)
- **5 Quick Win features implemented** (not yet committed — awaiting browser test):
  1. **Add User modal** — `UserController::adminCreate()` + `POST /users/admin-create` route + `AddUserModal` component in `Users.tsx` with Zod validation for name/email/password/role.
  2. **Location → Listing auto-create** — `LocationController::create()` now calls `ChannelAccount::firstOrCreate(channel=manual)` then `Listing::create()` and links it to the new location. No more manual DB seeding needed.
  3. **Booking guest_id** — New `useClientOptions.ts` hook fetches client-role users; guest dropdown added to `BookingFormFields` in `Bookings.tsx`.
  4. **Cleaning form: Location dropdown** — `Cleanings.tsx` fully rewritten: raw Location ID input replaced with `useLocationOptions` dropdown; optional Cleaner pre-assignment dropdown also added.
  5. **Cleaner Dashboard widgets** — `Dashboard.tsx` rebuilt with role-aware layout: cleaners see `TodayCleaningsWidget` + `UnassignedCleaningsWidget` with Assign Me buttons; admins see KPI cards + Recent Bookings + Unassigned panel.
- **New hooks added**: `useCreateUser`, `useAssignMe` (in `useCleanings.ts`), `useClientOptions`.
- **Files affected**: `backend/app/Http/Controllers/UserController.php`, `backend/app/Http/Controllers/LocationController.php`, `backend/routes/api.php`, `frontend/src/pages/Users.tsx`, `frontend/src/pages/Bookings.tsx`, `frontend/src/pages/Cleanings.tsx`, `frontend/src/pages/Dashboard.tsx`, `frontend/src/hooks/useUsers.ts`, `frontend/src/hooks/useCleanings.ts`, `frontend/src/hooks/useClientOptions.ts`.

---

## 2026-03-16 13:31 (JST) — Channel Manager Architecture Decision
- **Decision**: Channel Manager and iCal sync will live inside **Location detail view**, not as a separate page.
- **Data model clarified**:
  - `ChannelAccount` — holds OTA credentials (API token, channel type: manual/airbnb/booking_com)
  - `Listing` — bridge between Location and Channel (holds `channel_listing_id`, `status`, belongs to ChannelAccount)
  - `Location` — physical property, belongs to many Listings (can be on multiple OTAs)
- **Two onboarding flows defined**:
  - **Flow A (Location-first)**: Register Location → Manual listing auto-created → Later "Connect OTA" on listing → links channel_listing_id → Sync
  - **Flow B (OTA-first)**: Connect Channel Account → pull OTA property list → select → auto-creates Location + Listing
- Channel Accounts accessible from: Location detail drawer AND global Settings page.
- iCal URL stored per listing; "Sync Now" button calls `ChannelController::pullCleanings()` (`johngrogg/ics-parser` already installed).
- **Files affected**: `memory-bank/future_roadmap.md`, `memory-bank/active_context.md`, `memory-bank/progress_log.md`.

---

## 2026-03-16 14:39 (JST) — Phase 4A Browser Testing + Bug Fixes + Commit `6b6183f`
- **Browser tested** all 5 Quick Wins — all confirmed working after fixes below.
- **Bug: email conflict on re-register** — `UserController::delete()` changed to `forceDelete()`; stale soft-deleted record removed from DB directly.
- **Bug: `channel_listing_id` DB error** — `LocationController::create()` now sets `channel_listing_id = 'manual-{id}'` and `status = 'active'` on listing creation.
- **Bug: `listing_title` not saved** — Added `listing_title`, `channel_listing_id`, `status` to `Listing::$fillable`.
- **New: Location delete** — `LocationController::delete()` added with booking guard; `DELETE /locations/{id}` route; delete button in Location drawer (admin only).
- **Bug: optional select fields required** — `cleaner_id` and `guest_id` changed to `z.string().optional()` in schemas; `valueAsNumber` removed from those selects; values sanitized manually in submit handlers.
- **Bug: Zod v4 coerce syntax** — `z.number({coerce:true})` replaced with `z.number()` + `valueAsNumber` across `Bookings.tsx`, `Cleanings.tsx`, `Locations.tsx`.
- **Bug: Assign Me no UI update** — all cleaning mutations changed from `invalidateQueries` to `refetchQueries` for immediate cache refresh.
- **Git commit**: `6b6183f` — `feat: Phase 4A - quick wins + bug fixes` — pushed to `origin/main`.
- **Files affected**: `backend/app/Http/Controllers/UserController.php`, `backend/app/Http/Controllers/LocationController.php`, `backend/app/Listing.php`, `backend/routes/api.php`, `frontend/src/pages/Users.tsx`, `frontend/src/pages/Bookings.tsx`, `frontend/src/pages/Cleanings.tsx`, `frontend/src/pages/Dashboard.tsx`, `frontend/src/pages/Locations.tsx`, `frontend/src/hooks/useCleanings.ts`, `frontend/src/hooks/useLocations.ts`, `frontend/src/hooks/useUsers.ts`, `frontend/src/hooks/useClientOptions.ts`.

---

## 2026-03-16 15:39 (JST) — Phase 4 Medium Effort + Gen 2 Source Audit

### Phase 4 Medium Effort — Core Implementation (all complete except 2 items)
- **`BookingDetail` page** (`/bookings/:id`) — Inline editing (checkin/checkout dates, planned times, guests, beds), guest info panel, property panel with entry info + map link, linked cleaning card with "View Cleaning →" link.
- **`CleaningDetail` page** (`/cleanings/:id`) — Assign/unassign cleaner (admin), Assign Me (cleaner), status + start/end time editing, location info + property photos, next booking panel, supply request workflow (select item + qty → Request → Fulfill → Deliver).
- **`PasswordResetRequest` page** (`/forgot-password`) — Email form → calls `POST /api/v1/request-password-reset`. Shows success state without revealing whether email exists.
- **`PasswordResetForm` page** (`/reset-password?token=`) — New password + confirm → calls `POST /api/v1/reset-password` → on success redirects to `/login?reset=1`.
- **`Pricing` page** (`/pricing`, admin only) — Create flat fee or percentage-based price structures. Toggle switch for percentage mode. Shows session-created prices list.
- **Bookings + Cleanings rows** — Now clickable (cursor-pointer), navigate to `/bookings/:id` and `/cleanings/:id`. Action buttons (Edit/Delete/Assign) use `e.stopPropagation()` to prevent row-click conflict.
- **Sidebar** — Added "Pricing" (DollarSign icon, adminOnly) between Users and Profile.
- **App.tsx** — Fully rewrote to add all new routes: `bookings/:id`, `cleanings/:id`, `pricing`, `forgot-password`, `reset-password`. Removed old duplicate content from a replace collision.
- **Types extended**: `Booking` (guest_id, guest, confirmation_code, planned times, status), `Listing` (listing_title, channel_listing_id, status, channel_account_id), `Cleaning` (supplies array), plus new `SupplyTransaction`, `Price`, `ChannelAccount` interfaces.
- **New hooks**: `useBookingDetail.ts`, `useCleaningDetail.ts`, `useSupplyTransactions.ts` (list/create/fulfill/deliver), `usePrices.ts` (create/show).
- **Bug fixed**: `guest_id` type mismatch in `Bookings.tsx::handleEdit()` — now sanitizes string→number same as `handleCreate`.
- **Files created**: `frontend/src/pages/BookingDetail.tsx`, `CleaningDetail.tsx`, `PasswordResetRequest.tsx`, `PasswordResetForm.tsx`, `Pricing.tsx`, `frontend/src/hooks/useBookingDetail.ts`, `useCleaningDetail.ts`, `useSupplyTransactions.ts`, `usePrices.ts`.
- **Files modified**: `frontend/src/App.tsx`, `frontend/src/components/Layout.tsx`, `frontend/src/pages/Bookings.tsx`, `frontend/src/pages/Cleanings.tsx`, `frontend/src/types/index.ts`.

### Gen 2 Source Code Audit — Newly Discovered Gaps
- **Directly inspected**: `frontend-legacy/src/containers/modules/Cleaning/Calendar.js`, `Location/Calendar.js`, `CleaningSingle.js`, `Supply/SupplySingle.js`, `Profile/PaymentCard.js`; `backend-legacy/app/Http/Controllers/SuppliesTransactionController.php`, `PriceController.php`.
- **Cleaning Calendar** (`/cleaning-calendar`) — `react-big-calendar` monthly view with cleaner filter dropdown. Backend supports `?thisMonth=&cleaner_id=` query. **High priority — core daily tool for cleaners + admins.**
- **Location Calendar** — Bookings (checkin→checkout span) + Cleanings (single day) overlaid on same monthly calendar inside Location drawer. Click event navigates to detail.
- **Location schema gaps** — `mail_rules` and `trash_rules` text fields displayed in Gen 2's `CleaningSingle.js`. Not in current Gen 3 schema or UI.
- **Stripe Payment on Profile** — Full Stripe card save/change flow using `react-stripe-elements`. Low priority, defer until post-launch (requires Stripe account).
- **`SuppliesTransactionController` confirmed** — Gen 2's fulfill/deliver use `status` string field (`not_fulfilled` → `staged` → `delivered`). Gen 3 backend uses `fulfilled_at`/`delivered_at` timestamps instead — API contract differs; `useSupplyTransactions` hooks use PUT endpoints for fulfill/deliver which is correct.
- **All newly discovered gaps added to `future_roadmap.md`** under `🟠 Newly Discovered Gen 2 Gaps`.

---

## 2026-03-16 15:54 (JST) — Stripe Payment Deferred Decision
- **Decision**: Stripe Payment on Profile deliberately deferred to post-launch.
- **Reason**: Requires a live Stripe account, `card_last_four`/`card_brand`/`stripe_customer_id` DB migration, and backend Stripe token handling. Not an operational blocker.
- **Action**: Removed from Phase 4 roadmap. Moved to `Ideas / Backlog` section in `future_roadmap.md` and `active_context.md`.
---

## 2026-03-16 16:30 (JST) — Phase 4 Medium — Remaining 2 Items Completed

- **Location drawer: Listings tab** — 3-tab drawer (Info / Photos / Listings). Listings tab shows OTA/channel badge, status pill, `channel_listing_id`, booking count, and placeholder "Connect OTA" / "Sync Now" / "Add iCal URL" buttons (alert noting Phase 4 Large Effort). Location cards on the grid show listing count inline.
- **Supply transaction drawer** — Clicking any supply item card opens a slide-out drawer with stock summary bars and a scrollable transaction log. Log entries show type badge (Request/Buy/Use), quantity, date, and fulfill/deliver status chips. Admin action buttons: "Mark Fulfilled" + "Mark Delivered". Buy/Use buttons use `stopPropagation` to prevent drawer trigger.
- **`useSupplyTransactions.ts`** — Extended to accept optional `supplyId` parameter for per-supply filtering; `queryKey` updated; `enabled` condition added.
- **Files affected**: `frontend/src/pages/Locations.tsx`, `frontend/src/pages/Supplies.tsx`, `frontend/src/hooks/useSupplyTransactions.ts`.

---

## 2026-03-16 16:50 (JST) — All Newly Discovered Gen 2 Gaps Implemented

### Group 1 — Cleaning Calendar
- **`CleaningCalendar.tsx`** — New page at `/cleaning-calendar`. Native monthly calendar grid (date-fns, no external calendar library). Color-coded by status (Pending/In Progress/Completed/Cancelled). Admin-only cleaner filter dropdown. Click chip → `/cleanings/:id`. TF Day marker 🔄.
- **App.tsx** — Added `/cleaning-calendar` route.
- **Layout.tsx** — Added "Calendar" (CalendarDays icon) nav link; visible to admin + cleaner, hidden from other roles.

### Group 2 — Location Schema Fields
- **Key finding**: All columns (`mail_rules`, `trash_rules`, `per_bed_charge`, `per_guest_charge`, `SplitRate`, `guest_photo_directions_link`, `max_beds`) already exist in the original Gen 2 DB migration — no new migration needed.
- **`Location.php $fillable`** — Added all 9 missing fields: `mail_rules`, `trash_rules`, `guest_photo_directions_link`, `max_beds`, `per_bed_charge`, `per_guest_charge`, `SplitRate`, `default_staff_cleaning_payout`, `default_client_charge`.
- **`LocationController.php`** — Added optional validation rules for all new fields (`nullable|string`, `nullable|numeric`, `nullable|url`).
- **`types/index.ts`** — Extended `Location` interface with all Gen 2 fields.
- **`Locations.tsx` Info tab** — Now displays Mail Rules (blue card 📬), Trash Rules (green card 🗑️), Photo Directions link (purple 📷), and Max Beds.
- **`CleaningDetail.tsx` location panel** — Added Mail Rules, Trash Rules, and Photo Directions link alongside existing Map link and photos.

### Group 3 — BookingDetail Small Fixes
- **`BookingDetail.tsx`** — Added admin-only Status dropdown in edit mode: `pending`, `confirmed`, `checked_in`, `checked_out`, `cancelled`. Status saved as part of existing `useUpdateBookingDetail` mutation.
- **`previous_cleaning`** — Was already implemented in Phase 4 Medium; confirmed no further work needed.
- **Files affected**: `backend/app/Location.php`, `backend/app/Http/Controllers/LocationController.php`, `frontend/src/types/index.ts`, `frontend/src/pages/Locations.tsx`, `frontend/src/pages/CleaningDetail.tsx`, `frontend/src/pages/BookingDetail.tsx`, `frontend/src/pages/CleaningCalendar.tsx` (new), `frontend/src/App.tsx`, `frontend/src/components/Layout.tsx`.

---

## 2026-03-16 17:00 (JST) — Location Calendar Tab

- **`Locations.tsx` — Calendar tab** — Added 4th tab "Calendar" to the Location drawer. Built with date-fns; no external library needed.
- **Booking spans** — All bookings from all listings for a location are shown as blue bars spanning checkin → checkout days. Click navigates to `/bookings/:id`.
- **Cleaning markers** — All cleanings for the location appear as teal 🧹 markers on the exact cleaning date. TF Day cleanings show 🔄. Click navigates to `/cleanings/:id`.
- **Data source** — Reuses existing `GET /locations/:id` response which already loads `cleanings.cleaner` + `listings.bookings` — no new API call or route needed.
- **Month navigation** — `‹ Month YYYY ›` prev/next arrows. Legend + total booking/cleaning counts shown at bottom.
- **Files affected**: `frontend/src/pages/Locations.tsx`.

---

## 2026-03-16 20:00 (JST) — Location Editing, Photo Upload Fix & Backend Restart

### Location Inline Editing
- Added `✏️ Edit Info` button to Location drawer Info tab (admin/supervisor only).
- Edit mode shows all fields as inputs: Building Name, Room #, Max Beds, Address, Map Link, Entry Info, Mail Rules, Trash Rules, Photo Directions Link.
- After Save, the API response updates the `selected` state directly — **no page reload needed**.
- **New hook**: `useUpdateLocation` in `frontend/src/hooks/useLocations.ts` for `PUT /api/v1/locations/:id`.
- **New route**: `PUT /api/v1/locations/{location}` in `backend/routes/api.php`.
- **New method**: `update()` in `backend/app/Http/Controllers/LocationController.php`.

### Photo Upload Fix
- **Root cause**: `uploadPhoto()` used `Image::make()` from Intervention Image which is not installed, causing crashes.
- **Fix**: Removed Intervention Image dependency. Photos now saved to `backend/public/uploads/photos/{id}/` directly — no `storage:link` symlink needed.
- Stored path is `/uploads/photos/{id}/{filename}` — served directly by the web server.
- Frontend `<img src>` now uses `p.full_path` directly instead of `/storage/...` prefix.

### Immediate UI Refresh Fix
- **Root cause**: `selected` in parent was a frozen snapshot — mutations refetched the list but never updated the drawer.
- **Fix**: Added `onUpdate: (loc: Location) => void` callback to `LocationDrawer`. After every mutation (upload, edit save), the fresh API response is passed to `setSelected()` immediately.

### Backend Server Clarification
- Discovered two codebases: **legacy** (`asistee_aims/AIMSCoreBE` — PHP 7.4, Laravel 5.5) and **new** (`Asistee-AIMS/backend` — PHP 8.3, Laravel 12).
- New backend runs via: `C:\Users\amrca\Documents\php83\php.exe artisan serve --port=8001`
- Accidentally killed backend process during restart investigation; restored with correct PHP binary.
- Legacy system (`AIMSCoreBE`) was accidentally modified then fully reverted.

### Files affected
- `frontend/src/pages/Locations.tsx`
- `frontend/src/hooks/useLocations.ts`
- `backend/app/Http/Controllers/LocationController.php`
- `backend/routes/api.php`

---

## 2026-03-16 23:34 (JST) — Phase 4 Photo, Calendar & Pricing Fixes

### Photo Upload & Display
- **Root cause (403 error)**: `PropertyPhoto.php` Eloquent accessors `getFullPathAttribute`/`getThumbPathAttribute` were prepending `/storage/` to all paths — fixed by removing them.
- **Created** `src/lib/photoUrl.ts` — shared `getPhotoUrl()` utility strips legacy `/storage/` prefix and prepends backend origin. Both `Locations.tsx` and `CleaningDetail.tsx` now use it.
- **Local import removed** from `Locations.tsx`; shared util imported instead.
- **`useLocationDetail` hook** added — fetches full location data (photos + bookings) when a Location drawer opens. `Locations.tsx` refactored to use `selectedId` state + this hook; loading spinner added.

### Photo Delete + Lightbox
- **Delete icon**: Hover any photo thumbnail in Location drawer → red trash icon appears (top-right). Admin/supervisor only. `useDeletePhoto` hook added (`DELETE /api/v1/locations-photo/{photo}`).
- **Cross-module cache invalidation**: `useDeletePhoto.onSuccess` now invalidates both `['locations']` AND `['cleaning']` / `['cleanings']` — so CleaningDetail refreshes without a hard reload.
- **Lightbox modal**: Click any photo thumbnail → fullscreen lightbox overlay. X to close, click outside to close.
- **CleaningDetail lightbox**: Upgraded to index-based navigation (prev/next `ChevronLeft`/`ChevronRight` Lucide icons) with photo counter (`1 / N`). Grid shows 4 photos; all are browsable via arrows.

### CleaningDetail Photo Fix
- **Root cause**: Photo `src` used `/storage/${p.thumb_path?.replace('public/', '')}` — hardcoded old format.
- **Fix**: Replaced with `getPhotoUrl(p.full_path ?? p.thumb_path)` from shared utility.

### Location Calendar — TF Day Fix
- **Root cause**: `tf_status` is a virtual attribute computed by `CleaningController` — NOT stored in DB. `LocationController::show()` returned raw cleanings with no `tf_status`, so the calendar always saw `undefined`.
- **Fix**: Added TF computation loop to `LocationController::show()`: iterates all bookings for the location and marks cleanings whose date matches a booking checkin as `tf_status = true`.
- **Added** `use Carbon\Carbon` to `LocationController`.

### Cleaning Calendar — thisMonth Bug Fix
- **Root cause**: Frontend was sending `?thisMonth=1` (literal `1`). Backend `CleaningFilter::thisMonth()` does `Carbon::parse('1')` → parsed as **January 1st** of the current year → zero results for any other month.
- **Fix**: Now sends actual `YYYY-MM` string (e.g. `2026-03`). Renamed `per_page` → `perPage` to match filter method; raised limit to 200.

### Pricing Full CRUD
- **Root cause**: No `GET /prices` route existed — Pricing page only tracked session-local state.
- **Added** `PriceController::index()` + `GET /api/v1/prices` route.
- **Added** `PriceController::update()` + `PUT /api/v1/prices/{price}` route.
- **Added** `PriceController::delete()` (soft-delete) + `DELETE /api/v1/prices/{price}` route.
- **Added** `useListPrices`, `useUpdatePrice`, `useDeletePrice` hooks to `usePrices.ts`.
- **`Pricing.tsx`** rebuilt: fetches all prices from DB, shows persistent list. Each row has hover-reveal ✏️ (inline edit) and 🗑️ (delete with confirm) buttons.

### Files affected
- `backend/app/PropertyPhoto.php` — removed bad accessors
- `backend/app/Http/Controllers/LocationController.php` — TF status computation + Carbon import + update() + uploadPhoto fix
- `backend/app/Http/Controllers/PriceController.php` — index() + update() + delete()
- `backend/routes/api.php` — PUT+DELETE prices, GET prices routes
- `frontend/src/lib/photoUrl.ts` — new shared utility
- `frontend/src/hooks/useLocations.ts` — useLocationDetail + useDeletePhoto (with cross-module invalidation) + useUpdateLocation
- `frontend/src/hooks/usePrices.ts` — useListPrices + useUpdatePrice + useDeletePrice
- `frontend/src/pages/Locations.tsx` — selectedId state, lightbox, delete button, shared photoUrl
- `frontend/src/pages/CleaningDetail.tsx` — photoUrl fix, lightbox with prev/next navigation, 4-photo grid cap restored
- `frontend/src/pages/CleaningCalendar.tsx` — thisMonth param fix (YYYY-MM), perPage rename
- `frontend/src/pages/Pricing.tsx` — full CRUD: list from DB, inline edit, delete
