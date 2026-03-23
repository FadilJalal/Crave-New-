# 🍔 Crave — Food Ordering Platform

A production-ready multi-tenant food ordering platform built with React + Node.js + MongoDB.

[![CI](https://github.com/your-username/Crave/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/Crave/actions)

---

## What's included

| App | Port | Description |
|---|---|---|
| **Customer Frontend** | 5174 | Browse restaurants, order food, live tracking |
| **Super Admin Panel** | 5173 | Manage restaurants, platform orders, subscriptions |
| **Restaurant Admin Panel** | 5175 | Menu, orders, promos, email campaigns |
| **Backend API** | 4000 | Node.js + Express + MongoDB |

**Features:** Stripe payments · Split billing · Subscription plans · Cloudinary images · AI recommendations · Live delivery map · Email campaigns · Promo codes · Reviews · Bulk XLSX upload

---

## Quick start (Docker)

```bash
git clone https://github.com/your-username/Crave.git && cd Crave
cp backend/.env.example .env   # fill in your values
docker compose up --build
docker compose exec backend node seedSuperAdmin.js   # first run only
```

- Customer app:    http://localhost:5174  
- Super admin:     http://localhost:5173  
- Restaurant admin: http://localhost:5175

---

## Manual setup

### Backend
```bash
cd backend
cp .env.example .env        # fill in your values
npm install
node seedSuperAdmin.js      # run once
npm run server
```

### Frontend apps (repeat for admin-super and restaurant-admin)
```bash
cd frontend
cp .env.example .env        # set VITE_BACKEND_URL=http://localhost:4000
npm install && npm run dev
```

---

## Running tests

```bash
cd backend && npm install && npm test
```

Covers: recommendation algorithm, Zod validation, delivery fee tiers, Haversine distance.

---

## Key environment variables

See `backend/.env.example` for the full list.

| Variable | Description |
|---|---|
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET` | 64-char random string |
| `ADMIN_JWT_SECRET` | 64-char random string (different from above) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SUPER_ADMIN_EMAIL` | Super admin login email |
| `SUPER_ADMIN_PASSWORD` | Super admin login password |

Generate JWT secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## API pagination

Order endpoints support `?page=1&limit=20` and return:
```json
{ "pagination": { "page": 1, "limit": 20, "total": 143, "pages": 8 } }
```

---

## Project structure

```
Crave/
├── backend/                  Node.js API
│   ├── controllers/          Route handlers
│   ├── middleware/            Auth (3 roles)
│   ├── models/               Mongoose schemas
│   ├── routes/               Express routers
│   ├── tests/                Jest unit tests
│   └── utils/                Cloudinary, validators, scheduler
├── frontend/                 Customer React app
├── admin-super/              Super admin React app
├── restaurant-admin/         Restaurant admin React app
├── docker-compose.yml
└── .github/workflows/ci.yml  GitHub Actions CI
```

---

## Security checklist before going live

- [ ] Fill all `.env` values — never use placeholder strings  
- [ ] Use 64+ character random JWT secrets  
- [ ] Set `ALLOWED_ORIGINS` to your actual domain(s)  
- [ ] Change `SUPER_ADMIN_PASSWORD` before first deploy  
- [ ] Enable HTTPS  
- [ ] Never commit `.env` to git  
# Crave-New-
