# PRIMESTAR Backend Phase 1

Node.js, Express, Mongoose, and MongoDB foundation for the future Customer, Rider, and Admin PWAs. The existing root `assets/` and `prototype/` folders are intentionally not used or modified.

## Prerequisites

- Node.js 18+
- MongoDB 6+ locally or a MongoDB Atlas URI

## Setup

```powershell
npm install
Copy-Item .env.example .env
```

Set `MONGODB_URI`, JWT secrets, and the admin/SMTP values in `.env`. Never commit `.env`.

## Commands

```powershell
npm run dev
npm start
npm test
npm run seed-admin
```

The seed command creates the first admin from `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_EMAIL`; it never uses a hardcoded password. Admin login requires the password and a six-digit email OTP when SMTP is configured.

## Health

`GET /api/health` returns the service status and a non-sensitive MongoDB connection state.

## API foundation

- `/api/auth` customer, rider, and admin authentication
- `/api/vendors` and `/api/products` dynamic public catalog reads plus admin mutations
- `/api/orders` guest and customer order creation, payment-submitted state, and admin payment confirmation
- `/api/zones` and `/api/settings` delivery pricing configuration
- `/api/package-delivery` package delivery requests
- `/api/admin` protected admin endpoints

Orders use NGN, do not integrate a payment gateway, and only permit payment confirmation through an admin-protected route. A cron job checks unpaid orders every 15 minutes and expires those older than two hours. Vendor/product catalogs are stored in MongoDB and are not hardcoded.
