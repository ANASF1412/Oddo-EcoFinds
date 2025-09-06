# EcoFinds

EcoFinds is a second-hand marketplace web app for buying and selling used items.

## Project Structure

- **Backend:** Node.js, Express, MySQL (Sequelize or mysql2)
  - `/config`: Database and external service configs
  - `/models`: Sequelize or custom MySQL models
  - `/routes`: API routes
  - `/middleware`: JWT authentication middleware
  - `server.js`: Entry point
- **Frontend:** Static HTML/CSS/JS in `/frontend`
  - `/css`, `/js`, `/img` subfolders

## Setup

1. Copy `.env.example` to `.env` and fill in your credentials.
2. Run `npm install` to install dependencies.
3. Start backend: `npm run dev`
4. Frontend static files are in `/frontend`.

## API Development
- See comments in backend files for guidance on routes, models, and authentication.

## Authentication
- JWT-based authentication middleware stub provided in `/middleware/authMiddleware.js`.

## Frontend-Backend Integration
- Use `/frontend/js/api.js` for sample API calls to backend endpoints.

## Deployment
- See `vercel.json` for frontend deployment config.
