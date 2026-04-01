# SDHC — Shree Dhanvantari Herbal Corporation

A full-stack Ayurvedic e-commerce platform built with the MERN stack.  
Live B2B catalog + transactional e-commerce for premium herbal raw materials.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite, TailwindCSS |
| Backend | Node.js + Express 5 |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT — separate admin + customer tokens |
| Images | Cloudinary |
| Payments | Razorpay (mock mode by default) |

---

## Features

- **Product Catalog** — search, filter by form, paginated
- **Customer Auth** — register, login, profile, order history
- **Shopping Cart** — localStorage persistence, qty selector
- **Checkout** — 3-step: Shipping → Review → Payment
- **Orders** — server-side price validation, 18% GST, free shipping ≥ ₹500
- **Razorpay** — mock mode ready; plug in keys to go live
- **Admin Dashboard** — Products, Orders, Inquiries, Admin Users
- **Security** — Helmet, rate limiting, restricted CORS, input validation

---

## Local Development

```bash
# 1. Clone
git clone https://github.com/pranavamrutkar9/SDHC-Baroda.git
cd SDHC-Baroda

# 2. Backend
cd backend
cp .env.example .env        # fill in your values
npm install
npm run dev                 # runs on :5000

# 3. Frontend (new terminal)
cd frontend
cp .env.example .env.local  # set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # runs on :5173
```

---

## Deployment

See [Deployment Guide](#deployment-guide) below.

### Backend → Render (recommended)
1. New Web Service → connect GitHub repo
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all env vars from `backend/.env.example`

### Frontend → Netlify (recommended)
1. New site → connect GitHub repo
2. Base directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `frontend/dist`
5. Add env var: `VITE_API_URL=https://your-backend.onrender.com/api`

### After deploying both:
- Add `FRONTEND_URL=https://your-site.netlify.app` to backend env vars on Render
- Update backend `CORS` allowed origins if needed

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random secret (min 32 chars) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary config |
| `CLOUDINARY_API_KEY` | Cloudinary config |
| `CLOUDINARY_API_SECRET` | Cloudinary config |
| `FRONTEND_URL` | Deployed frontend URL (for CORS) |
| `PORT` | Server port (default 5000) |
| `RAZORPAY_KEY_ID` | Razorpay key (when going live) |
| `RAZORPAY_KEY_SECRET` | Razorpay secret (when going live) |

### Frontend (`frontend/.env.local`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL |
| `VITE_RAZORPAY_KEY_ID` | Razorpay frontend key (when going live) |

---

## Razorpay — Going Live

1. Create account at [razorpay.com](https://razorpay.com)
2. `cd backend && npm install razorpay`
3. Add keys to backend env vars
4. Uncomment the Razorpay blocks in `backend/controllers/paymentController.js`
5. Add `VITE_RAZORPAY_KEY_ID` to frontend env
6. Add to `frontend/index.html` `<head>`: `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>`
7. Uncomment the Razorpay options block in `frontend/src/pages/Checkout.jsx`

---

## API Routes

```
POST   /api/users/register
POST   /api/users/login
GET    /api/users/profile           [customer auth]
PUT    /api/users/profile           [customer auth]

GET    /api/products
GET    /api/products/:id
POST   /api/products                [admin auth]
PUT    /api/products/:id            [admin auth]
DELETE /api/products/:id            [admin auth]

POST   /api/orders                  [customer auth]
GET    /api/orders/myorders         [customer auth]
GET    /api/orders/:id              [customer/admin]
GET    /api/orders                  [admin auth]
PUT    /api/orders/:id/status       [admin auth]

POST   /api/payment/create-order    [customer auth]
POST   /api/payment/verify          [customer auth]

POST   /api/inquiries
GET    /api/inquiries               [admin auth]

POST   /api/admin/login
GET    /api/admin/me                [admin auth]
```
