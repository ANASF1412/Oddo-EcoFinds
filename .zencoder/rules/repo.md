# Repository Overview: EcoFinds

- **Name**: EcoFinds
- **Type**: Node.js + Express backend with vanilla HTML/CSS/JS frontend
- **Primary entry**: server.js
- **Package manager**: npm
- **Runtime env**: Node.js, MySQL

## Key Paths
- **Backend**: server.js, routes/*.js, models/*.js, middleware/*.js
- **DB**: config/database.js (creates tables on startup via mysql2/promise)
- **Frontend**: frontend/* (served statically via /frontend)
- **Env**: .env (see .env.example for defaults)
- **CI/CD**: .github/workflows/deploy.yml
- **Deployment**: vercel.json (static frontend), Procfile (for dyno-style hosts)

## Environment Variables
- **DB_HOST, DB_USER, DB_PASSWORD, DB_NAME**: MySQL connection
- **JWT_SECRET, JWT_EXPIRES_IN**: Auth tokens
- **PORT, NODE_ENV**: Server config
- **FRONTEND_URL**: CORS origin

## Notable Endpoints
- **Auth**: /api/auth/register, /api/auth/login, /api/auth/me, /api/auth/profile, /api/auth/password, /api/auth/avatar
- **Products**: /api/products (CRUD), /api/products/user/:userId or /user/me
- **Cart**: /api/cart (protected)
- **Orders**: /api/orders (protected)
- **Wishlist**: /api/wishlist (protected)
- **Messages**: /api/messages (protected)

## Local Run
1. npm install
2. Create DB and .env
3. npm start (or npm run dev)
4. Open http://localhost:3000/frontend/index.html

## Notes
- Database init order fixed to avoid FK errors.
- Multer used for avatar uploads, storing under frontend/img/uploads.
- Frontend API_URL points to http://localhost:3000/api for local.