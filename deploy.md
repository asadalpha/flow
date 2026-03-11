# Flow Application Deployment Guide

## API Routes

Base URL: `http://localhost:5000/api` (Development)
Production URL: `https://your-backend.onrender.com/api` (Render)

## Deployment

### Backend Deployment (Render)

1. **Environment Variables** (Set in Render Dashboard):

   ```env
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   SESSION_SECRET=your_session_secret
   FRONTEND_URL=https://your-frontend.vercel.app
   GOOGLE_CLIENT_ID=your_google_client_id (optional)
   GOOGLE_CLIENT_SECRET=your_google_client_secret (optional)
   GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback
   GEMINI_API_KEY=your_gemini_api_key
   ```

2. **Deploy Steps**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Create a new Web Service
   - Connect your GitHub repository
   - Set the root directory to `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add all environment variables listed above

### Frontend Deployment (Vercel)

1. **Environment Variables** (Set in Vercel Dashboard):

   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

2. **Deploy Steps**:
   - Go to [Vercel Dashboard](https://vercel.com/)
   - Import your GitHub repository
   - Set the root directory to `frontend`
   - Framework Preset: Vite
   - Add environment variable `VITE_API_URL`
   - Deploy

## API Documentation

### Authentication (`/api/auth`)

### Register

Create a new user account.

- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "status": "success",
    "token": "jwt_token_here",
    "data": {
      "user": { ... }
    }
  }
  ```

### Login

Sign in to an existing account.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "status": "success",
    "token": "jwt_token_here",
    "data": {
      "user": { ... }
    }
  }
  ```

### Google OAuth

Initiate Google Login.

- **URL**: `/api/auth/google`
- **Method**: `GET`
- **Description**: Redirects user to Google sign-in page.

## Jobs (`/api/jobs`)

_Requires Authentication Header: `Authorization: Bearer <token>`_

### Get All Jobs

Retrieve all tracked jobs.

- **URL**: `/api/jobs`
- **Method**: `GET`
- **Response**: `200 OK`

### Create Job

Track a new job application.

- **URL**: `/api/jobs`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "company": "Google",
    "position": "Software Engineer",
    "status": "applied", // applied, interviewing, offer, rejected
    "dateApplied": "2024-01-01"
  }
  ```

### Update Job

Update job details or status.

- **URL**: `/api/jobs/:id`
- **Method**: `PATCH`
- **Body**: (Partial object)
  ```json
  {
    "status": "interviewing"
  }
  ```

### Delete Job

Remove a job application.

- **URL**: `/api/jobs/:id`
- **Method**: `DELETE`

### Get Job Stats

Get aggregation statistics of job applications.

- **URL**: `/api/jobs/stats`
- **Method**: `GET`

## Resume (`/api/resume`)

_Requires Authentication Header: `Authorization: Bearer <token>`_

### Analyze Resume

Upload a PDF resume for AI analysis.

- **URL**: `/api/resume/analyze`
- **Method**: `POST`
- **Body**: Consumes `multipart/form-data`
  - `resume`: PDF file
  - `jobDescription`: string (optional)
- **Response**: `200 OK` with analysis results.

### Get All Analyses

Get history of resume analyses.

- **URL**: `/api/resume`
- **Method**: `GET`

---

# Old Deployment Guide (Legacy)

This section documents the old Vercel serverless deployment. The current setup uses Render for backend.

## Backend (Vercel Serverless - Legacy)

If you want to use Vercel instead of Render for the backend:

1. Ensure `backend/api/index.js` is the entry point (already configured in `backend/vercel.json`).
2. In Vercel, create a new Project and import the repo.
3. Set the Project Root to `backend/`.
4. Set the following environment variables in Vercel (Project Settings -> Environment Variables):
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `SESSION_SECRET`
   - `GEMINI_API_KEY`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CALLBACK_URL` (e.g. `https://<your-backend-domain>/api/auth/google/callback`)
   - `FRONTEND_URL` (comma-separated if multiple)
   - `NODE_ENV=production`
5. Deploy. Your base API URL will be `https://<your-backend-domain>/api`.

## Google OAuth Checklist

1. In Google Cloud Console, add the backend callback URL to Authorized redirect URIs:
   - For Render: `https://your-backend.onrender.com/api/auth/google/callback`
   - For Vercel: `https://your-backend.vercel.app/api/auth/google/callback`
2. Ensure `FRONTEND_URL` includes your deployed frontend URL.

## Quick Smoke Tests

1. `GET https://<your-backend-domain>/` should return a JSON status payload.
2. `POST https://<your-backend-domain>/api/auth/signup` should create a user.
3. `GET https://<your-backend-domain>/api/health` should return healthy status.
