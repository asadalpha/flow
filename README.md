# JobFlow - Job Tracker & Resume Analyzer

A modern job application tracking system with AI-powered resume analysis and Google OAuth authentication.

## Features

✨ **Google OAuth Authentication** - Seamless sign-in with Google
📊 **Job Application Tracking** - Track all your job applications in one place
🤖 **AI Resume Analysis** - Get AI-powered insights on your resume
📱 **Responsive Design** - Beautiful UI that works on all devices
🔔 **Toast Notifications** - Clear feedback for all user actions
🎨 **Modern UI** - Built with Tailwind CSS and Radix UI

## Tech Stack

### Frontend

- React + TypeScript
- Vite
- TanStack Query (React Query)
- React Router
- Tailwind CSS
- Radix UI Components
- Framer Motion
- Zod (validation)

### Backend

- Node.js + Express
- MongoDB + Mongoose
- Passport.js (Google OAuth)
- JWT Authentication
- Google Gemini AI
- Multer (file uploads)
- PDF Parse

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Google Cloud Console account (for OAuth)
- Google AI Studio account (for Gemini API)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd flow
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=90d
SESSION_SECRET=your_session_secret_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Server
PORT=5000
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production (Render): `https://flow-7mhj.onrender.com/api/auth/google/callback`
7. Copy the Client ID and Client Secret to your backend `.env` file

### 5. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to your backend `.env` file

### 6. Start the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Features Guide

### Authentication

- **Email/Password**: Traditional signup and login
- **Google OAuth**: One-click sign-in with Google account
- Clear error messages and success notifications

### Job Tracking

- Add job applications with company, role, status, and notes
- Track application status (Not Applied, Applied, Interview, Offer, Rejected, Ghosted)
- View statistics dashboard
- Delete applications
- Click on applications to view details

### Resume Analysis

- Upload PDF resumes
- Select job category
- Get AI-powered analysis including:
  - Match score
  - Missing skills
  - Strengths
  - Improvement suggestions

### User Experience

- **Toast Notifications**: Clear feedback for all actions
  - Success messages (green)
  - Error messages (red)
  - Warning messages (yellow)
  - Info messages (default)
- **Loading States**: Visual feedback during operations
- **Form Validation**: Client-side validation with clear error messages
- **Responsive Design**: Works on desktop, tablet, and mobile

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

### Jobs

- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job
- `GET /api/jobs/:id` - Get job by ID
- `PATCH /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/jobs/stats` - Get job statistics

### Resume

- `POST /api/resume/analyze` - Analyze resume (multipart/form-data)
- `GET /api/resume` - Get all analyses

## Troubleshooting

### Google OAuth Issues

- Ensure redirect URI matches exactly in Google Console
- Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- Verify FRONTEND_URL is set correctly in backend .env

### Resume Analysis Issues

- Ensure PDF file is valid and contains readable text
- Check GEMINI_API_KEY is valid
- Verify file size is under 10MB

### Database Connection

- Ensure MongoDB is running
- Check MONGODB_URI is correct
- Verify network access if using MongoDB Atlas

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
