# Active Context
_Last updated: 2026-03-16 23:34 (JST)_

## Just Finished
- ✅ **Phase 1A** — Backend: Laravel 5.5/PHP 7.4 → Laravel 12 / PHP 8.3
- ✅ **Phase 1B** — Frontend: React 16/CRA → React 18 / Vite 5 / TypeScript
- ✅ **Phase 2** — 70 API routes, CORS, Sanctum auth, browser login end-to-end verified
- ✅ **Phase 3** — All 6 module pages: Dashboard, Bookings, Cleanings, Locations, Supplies, Users, Profile
- ✅ **Manual QA Session** — All modules confirmed in browser; fixed Passport→Sanctum, namespace bugs, Gate issues
- ✅ **Gen 3 Parity Audit** — Backend 100%; frontend gaps catalogued → Phase 4 roadmap
- ✅ **Phase 4A Quick Wins — TESTED, COMMITTED & PUSHED** (`6b6183f` on `origin/main`)
- ✅ **Phase 4 Medium Effort — ALL ITEMS COMPLETE** (2026-03-16)
- ✅ **All Newly Discovered Gen 2 Gaps — COMPLETE** (2026-03-16)
- ✅ **Location Inline Editing** — `✏️ Edit Info` in Location drawer Info tab; all fields editable.
- ✅ **Photo Upload Fixed** — Removed Intervention Image; photos stored in `public/uploads/photos/{id}/`.
- ✅ **Immediate UI Refresh** — All location mutations update drawer state from API response directly.
- ✅ **Phase 4 Photo, Calendar & Pricing Fixes** (2026-03-16 session):
  - `photoUrl.ts` shared utility created — fixes 403 errors from old `/storage/` prefix
  - Photo delete with hover trash icon + cross-module cache invalidation
  - Photo lightbox (click-to-enlarge, prev/next navigation in CleaningDetail)
  - `CleaningDetail.tsx` broken photo URLs fixed
  - Location Calendar TF Day now computed in `LocationController::show()` (was always undefined)
  - Cleaning Calendar `thisMonth` param bug fixed (was sending `"1"` → January, now sends `YYYY-MM`)
  - Pricing page full CRUD: list from DB, inline edit, delete
  - `CleaningCalendar` page — native monthly grid, cleaner filter dropdown, click-to-navigate
  - Location schema fields: `$fillable` + controller validation + TypeScript types + Info tab + CleaningDetail display
  - BookingDetail: admin status dropdown editor added
| Feature | Files |
|---|---|
| Location drawer: 3-tab (Info / Photos / Listings) | `Locations.tsx` |
| Listings tab: OTA badge, status, channel_listing_id, booking count | `Locations.tsx` |
| Listings tab: placeholder "Connect OTA" / "Sync Now" / "Add iCal URL" buttons | `Locations.tsx` |
| Supply transaction drawer (click card → history log) | `Supplies.tsx` |
| Transaction log: type badge, timestamps, fulfill/deliver chips + admin buttons | `Supplies.tsx` |
| `useSupplyTransactions` — now filters by `supply_id` | `useSupplyTransactions.ts` |

### Phase 4 Medium: What Shipped This Session
| Feature | Files |
|---|---|
| `BookingDetail` page `/bookings/:id` | `BookingDetail.tsx`, `useBookingDetail.ts` |
| `CleaningDetail` page `/cleanings/:id` | `CleaningDetail.tsx`, `useCleaningDetail.ts` |
| `PasswordResetRequest` page `/forgot-password` | `PasswordResetRequest.tsx` |
| `PasswordResetForm` page `/reset-password?token=` | `PasswordResetForm.tsx` |
| `Pricing` page `/pricing` (admin only) | `Pricing.tsx`, `usePrices.ts` |
| Bookings + Cleanings rows clickable → detail | `Bookings.tsx`, `Cleanings.tsx` |
| Pricing link added to sidebar | `Layout.tsx` |
| All new routes registered | `App.tsx` |
| Types extended + 4 new hooks | `types/index.ts`, `useSupplyTransactions.ts` |

### Gen 2 Source Code Audit (2026-03-16) — Newly Discovered Gaps
Direct comparison of `frontend-legacy/` and `backend-legacy/` revealed these were NOT in the original roadmap:
- **Cleaning Calendar** (`react-big-calendar` monthly view, filter by cleaner) — **High priority**
- **Location Calendar** (bookings + cleanings overlay per location) — Medium
- **Location schema gaps** — `mail_rules`, `trash_rules`, `per_bed_charge`, `per_guest_charge`, `SplitRate`, `guest_photo_directions_link` (URL to guest-facing photo directions, NOT the same as internal staff photo upload which is already working via `PropertyPhotoController`)
- **Booking `status` editing** — shown read-only in `BookingDetail.tsx`, needs admin dropdown editor — Low priority
- **`previous_cleaning`** on BookingDetail — Low priority
- **Stripe Payment on Profile** — Deliberately deferred post-launch (moved to Ideas/Backlog)

### Channel Manager Architecture (decided 2026-03-16)
- Lives **inside Location detail view** (not a separate page)
- **Flow A (Location-first)**: Location created → Manual listing auto-created → later "Connect OTA" → sync
- **Flow B (OTA-first)**: Connect Channel Account → pull OTA list → select → auto-create Location + Listing
- iCal URL per listing; "Sync Now" → `ChannelController::pullCleanings()` → `ChannelProcessor::updateListingFromPull()` (currently not wired)

## Current Focus
- [ ] **Phase 4 Large Effort** — Channel Accounts management, OTA-first onboarding, iCal sync
- [ ] **QA Hardening** — Fix `htmlFor`/`id` on modal form fields → unblock remaining 14/37 Playwright tests

## Immediate Next Steps
1. **Phase 4 Large Effort** — Channel Accounts management + iCal sync + OTA-first onboarding
2. **QA Modal Field IDs** — Add `htmlFor`/`id` to all module modal inputs → 37/37 Playwright passing
3. **Phase 5** — Hosting decision, CI/CD pipeline, production `.env`

## Current Blockers
- `laravel/horizon` cannot be installed on Windows (`ext-pcntl` missing) — not blocking
- 14 Playwright E2E tests failing (modal label selector issues) — not blocking
- `useClientOptions` IDE lint error in `Bookings.tsx` — stale TSC cache, file exists correctly
- No backend (PHPUnit/Pest) automated tests yet — not blocking
