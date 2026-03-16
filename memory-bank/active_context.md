# Active Context
_Last updated: 2026-03-16 14:39 (JST)_

## Just Finished
- ✅ **Phase 1A** — Backend: Laravel 5.5/PHP 7.4 → Laravel 12 / PHP 8.3
- ✅ **Phase 1B** — Frontend: React 16/CRA → React 18 / Vite 5 / TypeScript
- ✅ **Phase 2** — 70 API routes, CORS, Sanctum auth, browser login end-to-end verified
- ✅ **Phase 3** — All 6 module pages: Dashboard, Bookings, Cleanings, Locations, Supplies, Users, Profile
- ✅ **Manual QA Session** — All modules confirmed in browser; fixed Passport→Sanctum, namespace bugs, Gate issues
- ✅ **Gen 3 Parity Audit** — Backend 100%; frontend gaps catalogued → Phase 4 roadmap
- ✅ **Phase 4A Quick Wins — TESTED, COMMITTED & PUSHED** (`6b6183f` on `origin/main`)

### Phase 4A: What Shipped
| Feature | Files |
|---|---|
| Add User modal (admin creates users with role) | `Users.tsx`, `UserController::adminCreate()`, `POST /users/admin-create` |
| Location → auto-creates Manual channel account + listing | `LocationController::create()`, `Listing.php` |
| Booking: optional guest/client dropdown | `Bookings.tsx`, `useClientOptions.ts` |
| Cleaning: location dropdown + optional cleaner pre-assign | `Cleanings.tsx`, `useLocationOptions` |
| Cleaner Dashboard: Today's Cleanings + Unassigned + Assign Me | `Dashboard.tsx`, `useCleanings.ts` |
| Location delete with upcoming-booking guard | `LocationController::delete()`, `DELETE /locations/{id}`, `useLocations.ts` |

### Phase 4A: Bugs Fixed During Testing
- `UserController::delete()` → `forceDelete()` — freed email for reuse
- `channel_listing_id` — now defaults to `'manual-{id}'`; `status: active` auto-set
- `Listing::$fillable` — added `listing_title`, `channel_listing_id`, `status`
- Optional select fields (`cleaner_id`, `guest_id`) — changed to `z.string().optional()` + sanitize in submit
- `z.number({coerce:true})` → `z.number()` + `valueAsNumber` (Zod v4 compat) across all forms
- All cleaning mutations → `refetchQueries` for instant UI update (was `invalidateQueries`)

### Channel Manager Architecture (decided 2026-03-16)
- Lives **inside Location detail view** (not a separate page)
- **Flow A (Location-first)**: Location created → Manual listing auto-created → later "Connect OTA" → `channel_listing_id` → Sync
- **Flow B (OTA-first)**: Connect Channel Account → pull OTA list → select property → auto-create Location + Listing
- Channel Accounts also accessible from a global Settings page
- iCal URL per listing; "Sync Now" → `ChannelController::pullCleanings()` (`johngrogg/ics-parser`)

## Current Focus
- [ ] **Phase 4 Medium Effort** — Detail pages + Location enhancements + Channel Manager UI

## Immediate Next Step
🟡 **Start Phase 4 Medium Effort:**
1. **Booking Single Detail** — `/bookings/:id` (inline editing, guest info, cleaning link)
2. **Cleaning Single Detail** — `/cleanings/:id` (next booking panel, supply request)
3. **Location detail: Listings tab** — "Connect OTA" / "Add iCal" per listing

## Current Blockers
- `laravel/horizon` cannot be installed on Windows (`ext-pcntl` missing) — not blocking Phase 4
- 14 Playwright E2E tests failing (modal label selector issues) — not blocking
- No backend (PHPUnit/Pest) automated tests yet — not blocking
