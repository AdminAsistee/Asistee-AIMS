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
- [x] **Manual QA Bug Fixes** — Fixed Passport→Sanctum in `app/User.php`, wrong namespace in `App\Models\User::locations()`, cleaner Gate bug (0 cleanings for admin), Booking form Location dropdown replacing raw Listing ID — commit `b54a96b`

---

## In Progress 🔨
- [ ] **Phase 4: Gen 2 Feature Integration** — iCal sync, Channel Manager, Extra Services, Pricing Engine

---

## Planned 📋

### Phase 4 — Complete Gen 2 Feature Parity
> 🔍 **Gen 3 Parity Audit (2026-03-16)**: Backend routes (100%), models (100%) are fully migrated.
> Gaps are entirely in the **frontend** — missing detail/single views, calendar views, and role-based dashboard widgets.

#### 🟢 Quick Wins (Small Effort)
- [ ] **Add User modal** — Admin creates users with any role directly from Users page (currently: register as client → edit role separately)
- [ ] **Location → Listing auto-create** — Auto-seed a Manual listing when a new location is registered (currently: manual DB seeding needed for bookings to work)
- [ ] **Booking guest_id assignment** — Guest dropdown in New Booking form so admin can link a booking to a specific client
- [ ] **Cleaning form: Location dropdown** — Replace raw "Location ID" input with a Location picker (same fix done for Bookings)
- [ ] **Cleaner Dashboard widgets** — Role-conditional panels: "Today's Cleanings" + "Unassigned Cleanings" + "Assign Me" button on Dashboard (`TodayCleanings.js` + `UnassignedCleanings.js` existed in Gen 3)

#### 🟡 Medium Effort
- [ ] **Booking Single Detail page** (`/bookings/:id`) — Inline-editable checkin/checkout dates & times, guest/bed count, stay duration calc, related Location info panel, related Cleaning link. _(Gen 3: `BookingSingle.js`)_
- [ ] **Cleaning Single Detail page** (`/cleanings/:id`) — Supply request panel (cleaner requests items for a job), fulfill/deliver status buttons, next booking info panel, location photos display. _(Gen 3: `CleaningSingle.js`)_
- [ ] **Location detail enhancements** — Add to existing slide-in drawer: Property Calendar (bookings + cleanings by date), Associated Cleanings table, Associated Listings + Bookings table. _(Gen 3: `LocationSingle.js`)_
- [ ] **Supply transaction history + detail view** — Per-supply drawer showing all Buy/Use/Move log entries (`SuppliesTransactionController.php` ✅ ready); also add supply single detail view with fulfill/deliver status workflow. _(Gen 3: `SupplySingle.js`)_
- [ ] **Pricing Engine** — Hierarchical price structures (flat fee + percentage splits) used for cleaner payouts and client charges (`PriceController.php` ✅ ready), needs new `/pricing` page
- [ ] **Password Reset frontend** — Request email form + reset form pages. Backend routes (`POST /request-password-reset`, `POST /reset-password`) already exist; no frontend. _(Gen 3: `ResetEmail.js` + `ResetForm.js`)_
- [ ] **Channel Accounts management** — UI to add/edit OTA credentials (Airbnb, Booking.com API keys stored encrypted). Required before Channel Manager. (`ChannelAccountController.php` — stub, needs implementing)
- [ ] **Extra Services** — Service catalog (airport pickup, welcome pack, etc.) attachable to bookings (`ExtraServiceController.php` — stub, needs implementing)
- [ ] **Feedback / Reviews** — Guest submits rating + text per booking (`FeedbackController.php` — stub, needs implementing)
- [ ] **Notes** — Attach text notes to cleanings/bookings (`NoteController.php` — stub, needs implementing)

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
- [ ] **iCal sync per listing** — Each listing has an optional iCal URL field. "Sync Now" calls `ChannelController::pullCleanings()` which parses the iCal (`johngrogg/ics-parser` installed), imports bookings, and auto-generates cleaning tasks on checkout dates
- [ ] **QA Hardening** — Add `htmlFor`/`id` to all module modal form fields → fixes remaining 14/37 Playwright test failures


#### ⚠️ Backend Stubs & Partials Still Needing Implementation
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
- Dashboard KPIs — Occupancy rate, upcoming cleanings, revenue summary cards
- Push notifications — Notify cleaners when a cleaning is assigned
- Mobile-responsive — Improve mobile layout
- Dark mode — Tailwind `dark:` classes throughout
- API documentation — Auto-generate with Scramble or L5-Swagger
- Backend tests — Feature tests for auth, bookings, cleanings (Pest/PHPUnit)
