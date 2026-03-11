# API Simplification - Setup Guide

## What Changed

✅ **Simplified API routes** - Removed `/api/v1` prefix, now using `/api` for cleaner URLs
✅ **Consistent axios usage** - All API calls now use the configured axios instance
✅ **Fixed resume upload** - Properly uses axios with auth headers
✅ **Updated for Vercel deployment** - Routes optimized for serverless functions

## Updated API Routes

| Old Route          | New Route       |
| ------------------ | --------------- |
| `/api/v1/auth/*`   | `/api/auth/*`   |
| `/api/v1/jobs/*`   | `/api/jobs/*`   |
| `/api/v1/resume/*` | `/api/resume/*` |

## Local Development Setup

### 1. Backend (.env file)

Copy `backend/.env.example` to `backend/.env` and update:

```env
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_key
```

### 2. Frontend (.env file)

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start the servers

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## Vercel Deployment

### Backend (Render)

Your backend is deployed on Render at: `https://flow-7mhj.onrender.com`

Set these environment variables in your Render dashboard:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=https://flow-app-weld-seven.vercel.app
GOOGLE_CLIENT_ID=your_google_id (optional)
GOOGLE_CLIENT_SECRET=your_google_secret (optional)
GOOGLE_CALLBACK_URL=https://flow-7mhj.onrender.com/api/auth/google/callback
```

### Frontend (Vercel)

Your frontend is deployed on Vercel at: `https://flow-app-weld-seven.vercel.app`

Set this in your Vercel frontend project settings:

```
VITE_API_URL=https://flow-7mhj.onrender.com/api
```

## Testing the Changes

1. **Health check**: `GET http://localhost:5000/` or `GET https://flow-7mhj.onrender.com/`
2. **API health**: `GET http://localhost:5000/api/health` or `GET https://flow-7mhj.onrender.com/api/health`
3. **Register**: `POST http://localhost:5000/api/auth/signup`
4. **Login**: `POST http://localhost:5000/api/auth/login`

## Redeploying

### Backend (Render)

- Render automatically deploys when you push to your main branch
- Or manually trigger deploy from Render dashboard

### Frontend (Vercel)

- Vercel automatically deploys when you push to your main branch
- Or manually trigger deploy from Vercel dashboard

- See [deploy.md](deploy.md) for full API documentation
- All API calls use axios with automatic JWT token handling
- CORS is configured for your Vercel domains
