# Nykaa Clone (MERN)

This repository contains a minimal MERN-stack Nykaa-style eCommerce demo.

Structure:
- server/: Express + MongoDB backend
- client/: React (Vite) + Tailwind frontend

Quick start (local):

1) Server

 - cd server
 - copy `.env.example` to `.env` and fill values (MONGODB_URI, JWT_SECRET)
 - npm install
 - npm run seed   # optional: seed sample products
 - npm run dev

2) Client

 - cd client
 - create `.env` with VITE_API_URL=http://localhost:5000/api
 - npm install
 - npm run dev

Notes:
- Authentication uses JWT. Token stored in localStorage for demo.
- Payment integration, image uploads, email flows are stubbed or left as extensions.
