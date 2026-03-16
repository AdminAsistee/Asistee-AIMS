# Future Roadmap

## Completed ✅
- [x] **Project Audit** — Catalogued Gen 2 and Gen 3 codebases, identified gap features
- [x] **Admin Account Setup** — `tech@asistee.com` designated as administrator via `DEV_EMAIL`
- [x] **Phase 1A: Backend Upgrade** — Laravel 5.5/PHP 7.4 → Laravel 12/PHP 8.3 + Sanctum
- [x] **Phase 1B: Frontend Upgrade** — React 16/CRA → React 18/Vite 5/TypeScript
- [x] **Phase 2: API Connection** — 70 routes registered, CORS configured, browser login working end-to-end
- [x] **Phase 3: Module Pages** — Dashboard KPIs, Bookings, Cleanings, Locations, Supplies, Users, Profile all functional
- [x] **Bug Fix: Login & Navigation** — Fixed missing Gates, 401 interceptor loop, seeded passwords, Login form accessibility
- [x] **QA E2E Suite** — 37 Playwright tests across 6 spec files (23/37 passing), `QA_STATUS.md` created
- [x] **GitHub Push** — Commit `3e75d7a` — all Phase 3 + QA code pushed to `origin/main`
- [x] **Manual QA Bug Fixes** — Fixed Passport→Sanctum, wrong namespace, cleaner Gate bug, Booking Location dropdown — commit `b54a96b`
- [x] **Phase 4A Quick Wins** — All 5 features implemented, browser-tested & pushed commit `6b6183f`:
  - Add User modal (admin creates users with any role)
  - Location → auto-creates Manual channel account + listing on registration
  - Booking: optional guest/client dropdown
  - Cleaning: location dropdown + optional cleaner pre-assign
  - Cleaner Dashboard: Today's Cleanings + Unassigned + Assign Me
  - Location delete with upcoming-booking guard
- [x] **Phase 4A Bug Fixes** — `forceDelete()` for freed emails, `channel_listing_id` default, optional select field validation, Zod v4 coerce fixes, `refetchQueries` for instant UI updates
- [x] **Phase 4 Medium Effort** — All core items implemented (2026-03-16):
  - `BookingDetail` page (`/bookings/:id`) — inline editing, guest panel, location panel, linked cleaning
  - `CleaningDetail` page (`/cleanings/:id`) — assign/unassign cleaner, status+times edit, location+photos, next booking, supply request/fulfill/deliver
  - `PasswordResetRequest` page (`/forgot-password`) — email form → calls `POST /request-password-reset`
  - `PasswordResetForm` page (`/reset-password?token=`) — new password form → calls `POST /reset-password`
  - `Pricing` page (`/pricing`, admin only) — create flat fee + percentage price structures
  - Bookings + Cleanings list rows are now **clickable** → navigate to detail
  - Pricing link added to sidebar (admin only)
  - Types extended: `SupplyTransaction`, `Price`, `ChannelAccount`, `Booking.guest`, `Listing.listing_title`
  - New hooks: `useBookingDetail`, `useCleaningDetail`, `useSupplyTransactions`, `usePrices`
- [x] **Location Inline Editing** — `✏️ Edit Info` button in drawer; all fields editable; no page reload required (2026-03-16).
- [x] **Location Photo Upload Fixed** — Removed Intervention Image dependency; stores in `public/uploads/photos/{id}/`; accessible without storage:link (2026-03-16).
- [x] **Immediate UI Refresh** — All location mutations (edit, photo upload) update drawer state from API response directly (2026-03-16).
- [x] **Photo 403 Fix + Shared `photoUrl.ts`** — Removed bad Eloquent accessors from `PropertyPhoto.php`; created `src/lib/photoUrl.ts` shared URL normalizer used by both `Locations.tsx` and `CleaningDetail.tsx` (2026-03-16).
- [x] **Photo Delete** — Hover trash icon on thumbnails (admin only); `useDeletePhoto` hook; cross-module cache invalidation so CleaningDetail also refreshes (2026-03-16).
- [x] **Photo Lightbox** — Click-to-enlarge modal in Locations; prev/next navigation with counter in CleaningDetail (2026-03-16).
- [x] **CleaningDetail Photo URLs Fixed** — Was using hardcoded `/storage/` prefix; now uses `getPhotoUrl()` (2026-03-16).
- [x] **Location Calendar TF Day** — `LocationController::show()` now computes `tf_status` for each cleaning (was always false/undefined) (2026-03-16).
- [x] **Cleaning Calendar thisMonth Bug** — Sending `YYYY-MM` string instead of `"1"` (which Carbon parsed as January) (2026-03-16).
- [x] **Pricing Full CRUD** — `GET/PUT/DELETE /prices` routes; `PriceController::index/update/delete`; `useListPrices/useUpdatePrice/useDeletePrice` hooks; `Pricing.tsx` rebuilt with persistent DB list + inline edit + delete (2026-03-16).

---

## In Progress 🔨
- [x] ~~**Phase 4 Medium Effort — Remaining 2 items**~~ ✅ **COMPLETE** — Location Listings tab + Supply transaction history drawer both implemented
- [x] **Newly Discovered Gen 2 Gaps — ALL COMPLETE** (2026-03-16):
  - `CleaningCalendar` page — native date-fns monthly grid, cleaner filter, click-to-navigate
  - Location `$fillable` + `LocationController` validation updated for all missing fields
  - Location `types/index.ts` extended with all Gen 2 fields
  - `Locations.tsx` Info tab: `mail_rules`, `trash_rules`, `guest_photo_directions_link` displayed
  - `CleaningDetail.tsx` location panel: `mail_rules`, `trash_rules`, photo directions link
  - `BookingDetail.tsx`: admin status dropdown editor (confirmed/pending/checked_in/checked_out/cancelled)

---

## Planned 📋

### Phase 4 — Complete Gen 2 Feature Parity
> 🔍 **Gen 2 Source Code Audit (2026-03-16)**: Direct comparison of Gen 2 source (`frontend-legacy/`, `backend-legacy/`)
> against Gen 3. Gaps below reflect actual files found: `Calendar.js`, `CleaningSingle.js`, `LocationSingle.js`,
> `SupplySingle.js`, `Profile/PaymentCard.js`.

#### 🟡 Medium Effort — Remaining (2 items)
- [x] **Location drawer: Listings tab** — 3-tab drawer (Info/Photos/Listings). Listings tab shows OTA/channel badge, status, `channel_listing_id`, booking count, and placeholder "Connect OTA" / "Sync Now" / "Add iCal URL" buttons. _(Gen 2: `LocationSingle.js`)_
- [x] **Supply transaction history drawer** — Clicking a supply card opens a slide-in drawer showing stock summary + scrollable transaction log with type badges, timestamps, fulfill/deliver status chips, and admin action buttons. `useSupplyTransactions` updated to filter by `supply_id`. _(Gen 2: `SupplySingle.js`, `SuppliesTransactionController.php` ✅)_

#### 🟠 Newly Discovered Gen 2 Gaps — ALL COMPLETE (2026-03-16)
> These were found during the 2026-03-16 Gen 2 source audit and were not in the original roadmap.

- [x] **Cleaning Calendar** (`/cleaning-calendar`) — Monthly calendar grid (date-fns), cleaner filter (admin), click event → `/cleanings/:id`. No external library needed. _(Gen 2: `Cleaning/Calendar.js`)_
- [x] **Location Calendar** (inside Location drawer) — 4th tab: monthly booking span bars (blue, click → `/bookings/:id`) + cleaning day markers (teal, click → `/cleanings/:id`). Month navigation, legend, totals. Data from existing `show()` response. _(Gen 2: `Location/Calendar.js`)_
- [x] **Location additional fields** — All fields already in DB migration. Updated `$fillable`, `LocationController` validation, `types/index.ts`, `Locations.tsx` Info tab, `CleaningDetail.tsx` location panel.
- [x] **`previous_cleaning` on BookingDetail** — Was already coded in Phase 4 Medium.
- [x] **`guest_photo_directions_link`** — Now shown in Location Info tab and CleaningDetail location panel.
- [x] **Booking `status` field editing** — Admin-only dropdown in `BookingDetail.tsx` edit mode.
- ~~**Srizon module**~~ — Found in `frontend-legacy/src/containers/modules/Srizon/`. All Redux actions are commented out, no backend controller exists. This was an **incomplete/abandoned feature in Gen 2 itself** — safe to exclude from Gen 3.


#### 🔴 Large Effort (Phase 4 Finale)

> **Architecture decision (2026-03-16):** Channel Manager and iCal sync live **inside the Location detail view** (not a separate page). Two onboarding flows are supported:
>
> **Flow A — Location-first (manual):**
> Register Location → auto-creates Manual listing → later "Connect OTA" on that listing → links Channel Account → sync bookings
>
> **Flow B — OTA-first:**
> Connect Channel Account → pull property list from OTA → select property → system auto-creates Location + Listing (with `channel_listing_id` from OTA) → sync bookings

- [ ] **Channel Accounts management** — Admin connects OTA credentials (Airbnb API key, Booking.com token). Lives as a settings panel accessible from Location detail AND from a global Settings page. (`ChannelAccountController.php` stub — needs implementing)
- [ ] **Location: Listings tab** — Show all listings linked to a location. Each listing shows its OTA/channel, status, and `channel_listing_id`. Buttons: "Connect OTA" (link to existing ChannelAccount), "Add iCal URL", "Sync Now"
- [ ] **OTA-first onboarding** — "Import from OTA" button on Locations page: pick a Channel Account → fetch OTA property list → select → auto-create Location + Listing
- [ ] **iCal sync per listing** — Wire `ChannelController::pullCleanings()` → `ChannelProcessor::updateListingFromPull()` to actually persist bookings + create cleanings on checkout dates
- [ ] **Extra Services** — Service catalog (airport pickup, welcome pack, etc.) attachable to bookings (`ExtraServiceController.php` — stub, needs implementing)
- [ ] **Feedback / Reviews** — Guest submits rating + text per booking (`FeedbackController.php` — stub, needs implementing)
- [ ] **Notes** — Attach text notes to cleanings/bookings (`NoteController.php` — stub, needs implementing)
- [ ] **QA Hardening** — Add `htmlFor`/`id` to all module modal form fields → fixes remaining 14/37 Playwright test failures

#### ⚠️ Backend Stubs Still Needing Implementation
| Controller | Current Size | Status |
|---|---|---|
| `NoteController.php` | 131 bytes | Stub — needs full CRUD |
| `FeedbackController.php` | 135 bytes | Stub — needs full CRUD |
| `ExtraServiceController.php` | 139 bytes | Stub — needs full CRUD |
| `ChannelAccountController.php` | 141 bytes | Stub — needs full CRUD |
| `ChannelManagerController.php` | 581 bytes | Partial stub — thin wrapper, needs implementing |

---

### Phase 5 — Production Deployment
- [ ] **Hosting Decision** — Choose provider (DigitalOcean, Fly.io, Railway)
- [ ] **CI/CD Pipeline** — GitHub Actions for auto-deploy on push to `main`
- [ ] **Environment Variables** — Production `.env` (DB, mail, OTA API keys)
- [ ] **Queue Worker** — Laravel Supervisor on Linux (Horizon won't work on Windows)
- [ ] **Domain & SSL** — Point domain to new backend + frontend

---

## Ideas / Backlog 💡
- **SMTP Email Configuration** — Set up mail driver (Mailgun, SendGrid, SES, or SMTP) in `.env` so password reset emails are sent for real. Currently the backend returns the token directly in the API response as a dev bypass; the frontend redirects immediately. When SMTP is live, the token will only travel through email and the redirect bypass can be removed.
- **Stripe Payment on Profile** — Save/change credit card (Gen 2: `Profile/PaymentCard.js`). Requires Stripe account + `card_last_four`/`card_brand`/`stripe_customer_id` migration. **Deferred post-launch.**
- Dashboard KPIs — Occupancy rate, upcoming cleanings, revenue summary cards
- Push notifications — Notify cleaners when a cleaning is assigned
- Mobile-responsive — Improve mobile layout
- Dark mode — throughout
- API documentation — Auto-generate with Scramble or L5-Swagger
- Backend tests — Feature tests for auth, bookings, cleanings (Pest/PHPUnit)
