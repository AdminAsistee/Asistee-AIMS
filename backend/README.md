# AIMSCoreBE
AIMS Core System Backend Built on Laravel

### Installation

After cloning run the following commands

```bash
composer install
cp .env.example .env
php artisan key:generate
```

`.env` edit .env file to point to your database. After that run:

```bash
php artisan migrate
php artisan passport:install
```

NOTE: A listing must have at least 1 associated location for booking integrity to be respected.