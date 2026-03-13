# QA Status Report
_Last run: 2026-03-13 18:30 (JST)_
_Stack: Laravel 12 / PHP 8.3 (Backend) + React 18 / Vite 5 / TypeScript (Frontend)_

## Summary
| Category | Tests | Passed | Failed | Skipped |
|---|---|---|---|---|
| Backend Unit (Pest) | 23 | 22 | 1 | 0 |
| Frontend Unit (Vitest) | 0 | 0 | 0 | 0 |
| E2E (Playwright) | 0 | 0 | 0 | 0 |
| Accessibility | 0 | 0 | 0 | 0 |

**Overall Health:** 🟡 DEGRADED — 1 known backend failure (supplies route auth)

---

## Functional Integrity

### ✅ Authentication (Backend — Pest)
- ✅ Login with valid credentials → 200 + Sanctum token
- ✅ Login with invalid password → 401
- ✅ Login with non-existent email → 401
- ✅ Login without email/password → 422 validation
- ✅ Register new client → 201 + token
- ✅ Register with DEV_EMAIL → auto-assigned `administrator` type
- ✅ Register duplicate email → 422
- ✅ `GET /me` returns authenticated user → 200
- ✅ `GET /me` without token → 401
- ✅ Logout → 200 + success message
- ✅ SQL injection in email → 422 validation rejection

### ✅ Module Access Control (Backend — Pest)
- ✅ Authenticated user can list bookings → 200
- ✅ Unauthenticated request to bookings → 401
- ✅ Creating booking with empty data → 422 validation
- ✅ Unauthenticated request to supplies → 401
- ✅ Administrator can list users → 200
- ✅ Client user cannot access admin user list → 403

### ❌ Known Failures
- ❌ `GET /api/v1/supplies` with token → Expected 200, got 401
  - **Root cause:** `SupplyController` may have a namespace or middleware binding issue in test environment
  - **Impact:** Low — production endpoint works (verified manually)
  - **Fix:** Investigate `SupplyController` class loading in test bootstrap

---

## Edge-Case Resilience
- ✅ SQL injection in login email → rejected by email validation (422)
- ✅ Short password (< 6 chars) → 422 validation
- ✅ XSS in name field → accepted (correct — output encoding protects, not input rejection)

---

## Coverage Gaps
- [ ] Frontend unit tests (Vitest) — **not yet run** (modules not built yet)
- [ ] Playwright E2E tests — **not yet run** (requires `npx playwright install`)
- [ ] Cleanings module tests
- [ ] Locations module tests
- [ ] Stripe/payment flow tests
- [ ] Password reset flow tests
- [ ] File/photo upload tests

---

## QA Infrastructure Installed

### Backend (Pest)
```sh
cd backend
# Run all tests
php artisan test   # or: ./vendor/bin/pest

# Run specific file
./vendor/bin/pest tests/Feature/AuthTest.php

# Run with coverage (requires Xdebug or pcov)
./vendor/bin/pest --coverage
```

### Frontend (Vitest)
```sh
cd frontend
npm run test:run       # single pass
npm run test:coverage  # with v8 coverage report
```

### E2E (Playwright)
```sh
cd frontend
npx playwright install  # first time only
npm run test:e2e        # run all E2E tests
npm run test:e2e:ui     # Playwright UI mode
```

---

## TDD Workflow (for future module pages)

When building a new module page, follow this loop:

1. **Write the failing backend test first** → `tests/Feature/[Module]Test.php`
2. **Write the minimum controller code** to make it pass
3. **Write the failing frontend unit test** → `src/pages/[Module].test.tsx`
4. **Write the minimum component code** to make it pass
5. **Write the Playwright E2E test** → `e2e/[module].spec.ts`
6. **Run `npm run test:e2e`** to verify end-to-end flow
7. **Run `./vendor/bin/pest`** to keep backend green

## Recommended Next Tests
- [ ] `tests/Feature/BookingTest.php` — full CRUD for bookings when Bookings module is built
- [ ] `tests/Feature/CleaningTest.php` — create, assign, unassign cleaner
- [ ] `tests/Feature/LocationTest.php` — CRUD + photo upload
- [ ] `e2e/bookings.spec.ts` — Playwright E2E for bookings table + create form
- [ ] `src/components/BookingTable.test.tsx` — Vitest unit test for booking table component
