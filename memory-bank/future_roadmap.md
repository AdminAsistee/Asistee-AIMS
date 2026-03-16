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

---

## In Progress 🔨
- [ ] **Phase 4: Gen 2 Feature Integration** — iCal sync, Channel Manager, Extra Services, Pricing Engine

---

## Planned 📋

### Phase 4: Gen 2 Feature Integration
- [ ] **iCal sync** — Connect `johngrogg/ics-parser` backend to a UI for importing Airbnb/VRBO bookings
- [ ] **Channel Manager** — UI for managing OTA channels (Airbnb, Booking.com)
- [ ] **Extra Services** — Pre-built extra services for client upsells
- [ ] **Pricing Engine** — Seasonal pricing, split pricing UI

### Phase 5: Production Deployment
- [ ] **Hosting Decision** — Choose a hosting provider (DigitalOcean, Fly.io, Railway)
- [ ] **CI/CD Pipeline** — GitHub Actions for auto-deploy on push to `main`
- [ ] **Environment Variables** — Production `.env` setup (Stripe live keys, DB, mail)
- [ ] **Queue Worker** — Set up Laravel Horizon (or Supervisor) on Linux server
- [ ] **Domain & SSL** — Point domain to new backend + frontend

---

## Ideas / Backlog 💡
- **QA Hardening** — Add `htmlFor`/`id` to all module modal form fields to fix remaining 14 Playwright test failures
- **Booking guest_id** — Admin should be able to pick which client a booking is for (currently auto-assigns admin as guest)
- Dashboard KPIs — Occupancy rate, upcoming cleanings, revenue summary cards
- Push notifications — Notify cleaners when a cleaning is assigned
- Mobile-responsive — Improve mobile layout on Cleanings calendar
- Dark mode — Tailwind dark: classes throughout
- API documentation — Auto-generate with Scramble or L5-Swagger
- Backend tests — Write Feature tests for auth, bookings, cleanings (PHPUnit + Pest)
- Data migration — Script to migrate `aims_core` data to `aims_core_v2` for production cutover
