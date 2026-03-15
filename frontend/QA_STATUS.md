# QA Status Report
_Last run: 2026-03-16T08:10 JST_
_Stack: React 18 + Vite 5 + TypeScript / Laravel 12 + PHP 8.3_

## Summary
| Category | Tests Run | Passed | Failed | Skipped |
|---|---|---|---|---|
| Unit (Vitest) | — | — | — | — |
| E2E (Playwright) | 37 | 23 | 14 | 0 |
| Accessibility | — | — | — | — |

**Overall Health:** 🟡 DEGRADED — Core auth and navigation passing; module CRUD selectors need tightening.

---

## Functional Integrity
- ✅ Login with valid credentials (tech@asistee.com / aimsasistee) → dashboard redirect
- ✅ Invalid credentials show error message
- ✅ Unauthenticated access to `/` redirects to `/login`
- ✅ Sidebar links: Bookings, Cleanings, Locations, Supplies, Users all navigate correctly
- ✅ Sign out clears session + re-visiting `/` redirects to `/login`
- ✅ Users page displays both registered users (tech@, alexa@)
- ✅ User role dropdown is visible on each row
- ✅ Profile page displays current user info, email, administrator badge
- ✅ Edit profile form is present with Save button
- ✅ Password change section is present (confirm mismatch shows error)
- ✅ Profile update saves successfully (name update → success message)
- ✅ Bookings page loads with table headers (Check-in, Check-out)
- ✅ "New Booking" modal opens on button click
- ✅ Booking form validates required fields (Zod schema)
- ✅ Cleanings page loads correctly with heading
- ✅ Cleanings form validates required fields
- ✅ Responsive layout: Users table renders at 768px without overflow
- ✅ Double-click on Sign In does not crash page

## User Experience Stability
- ✅ Navigation loop fixed — all module pages stay on their route
- ✅ Empty states shown when no data exists
- ⚠️ Some module form labels not linked (htmlFor missing on some module forms — reduces a11y)

## Edge-Case Resilience
- ✅ Login page renders at 320px mobile width
- ✅ Guest cannot access dashboard
- ⚠️ Date validation (checkin > checkout) needs E2E verification against live backend response

---

## Coverage Gaps
- [ ] `src/pages/Bookings.tsx` — E2E create flow needs listings to exist first
- [ ] `src/pages/Cleanings.tsx` — create flow depends on location existing
- [ ] `src/components/ui/Modal.tsx` — no unit tests
- [ ] `src/components/ui/Pagination.tsx` — no unit tests
- [ ] `src/hooks/*.ts` — no unit mock tests yet

## Known Test Failures (14 remaining)
| Test | Reason |
|---|---|
| `auth › login page renders correctly` | Heading text is "Sign in to your account" not just "Sign in" |
| `locations › create new location` | Form label selectors need `htmlFor` added to Location modal fields |
| `locations › validate required fields` | Same label issue |
| `supplies › create new supply` | Name field label association missing |
| `supplies › validate name` | Same |
| `cleanings › create cleaning` | Location ID 1 doesn't exist in fresh DB |
| `bookings › create booking` | Listing ID 1 doesn't exist in fresh DB |
| `bookings › check-in before check-out` | Backend error message format differs |
| `users-profile › password section` | `getByLabel(/new password/)` matches multiple elements |
| `users-profile › mismatch password` | Same |

## Recommended Next Tests
- [ ] Add `htmlFor`/`id` to all module modal form fields for proper label association
- [ ] Add a test fixture / seed that creates a Location + Listing before booking/cleaning tests
- [ ] Test iCal import flow (Phase 4 feature)
- [ ] Test Channel Manager sync (Phase 4 feature)
- [ ] Add Vitest unit tests for `Modal`, `Badge`, `Pagination`, `ConfirmDialog` components
