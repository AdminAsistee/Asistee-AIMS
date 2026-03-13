# Asistee AIMS

**Asistee Internal Management Software** — A property management SaaS platform for short-term rental operations.

## Structure

```
Asistee-AIMS/
├── backend/     Laravel 5.5 REST API (PHP)
└── frontend/    React 16 SPA (JavaScript)
```

## Features
- Booking & cleaning management
- Channel sync (Airbnb iCal)
- Staff scheduling & assignment
- Supply & linen tracking
- Accounting & invoicing
- Role-based access (Admin, Cleaning, Client, Accounting)
- Stripe billing integration

## Stack
- **Backend:** PHP 7.4, Laravel 5.5, MySQL, Laravel Passport (OAuth2)
- **Frontend:** React 16, Redux, React Router 4

## Local Development
See `backend/.env.example` and `frontend/src/config.example.js` for configuration.

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan passport:install
php artisan serve
```

### Frontend
```bash
cd frontend
cp src/config.example.js src/config.js
yarn install
yarn start
```
