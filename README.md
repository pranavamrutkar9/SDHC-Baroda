# SDHC Supplier Platform

A full-stack web application for an Ayurvedic raw material supplier. Includes a beautiful, responsive frontend catalog and an administrative dashboard for securely managing products.

## Project Structure

This repository is split into two parts:
- **`frontend/`**: React SPA application built using Vite, styled with Tailwind CSS, and using Lucide React for modern icons.
- **`backend/`**: RESTful API server using Node.js, Express, and MongoDB (via Mongoose) to manage products and administrators.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB instance (local server or MongoDB Atlas)

### 1. Backend Setup
1. Navigate into the backend repository:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` folder. Example:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sdhc
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *(Note: uses `nodemon` for auto-restarts)*

**Initial Admin Setup**: 
To access the admin dashboard the very first time, make a POST request to `http://localhost:5000/api/admin/seed` to generate the default admin account (Username: `admin`, Password: `admin123`).

### 2. Frontend Setup
1. Navigate into the frontend repository:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` folder (optional, defaults to port 5000):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## 🛡️ Admin Dashboard
You can access the admin dashboard by navigating to the `/admin` route on your frontend URL (e.g., `http://localhost:5173/admin`).

**Features:**
- Secure JWT-based authentication
- Create, Read, Update, and Delete products instantly
- Manage multiple Administrator access credentials (exclusive to the main `admin` account)
