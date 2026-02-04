# AI Todo Application

A full-stack AI-powered todo application built with modern web technologies. The project includes both frontend and backend components with authentication, task management, and testimonials system.

## 🚀 Features

- **User Authentication**: Complete login/signup flow with email/username and password
- **Task Management**: Full CRUD operations on tasks with optimistic updates
- **Testimonials System**: User-submitted testimonials with ratings and feedback
- **Responsive UI**: Mobile-friendly design with loading states and error handling
- **JWT Authentication**: Secure token-based authentication with proper session management
- **Database Integration**: PostgreSQL with Neon hosting for serverless scalability

## 🛠️ Tech Stack

### Frontend
- Next.js 16.1.2 with App Router
- React 18+
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

### Backend
- Python 3.11+
- FastAPI
- SQLModel
- PostgreSQL (Neon serverless)
- JWT for authentication
- bcrypt for password hashing

## 📋 Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- PostgreSQL database (or Neon account)

## 🚀 Quick Start

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file and configure:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Copy the environment file and configure:
```bash
cp .env.example .env
```

5. Start the backend server:
```bash
python -m uvicorn main:app --reload
```

## 🔧 Environment Variables

### Frontend (.env)
```env
# API Base URL for backend connection
# For local development
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# For production
# NEXT_PUBLIC_API_BASE_URL=https://aliaskariface-backend-todo-app.hf.space

# Better Auth Configuration
BETTER_AUTH_SECRET="your-secret-key-here"
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
# For production
# NEXT_PUBLIC_BETTER_AUTH_URL=https://ai-todo-psi.vercel.app
```

### Backend (.env)
```env
# Database Configuration
# For local development with SQLite
DATABASE_URL=sqlite:///./todo_app.db

# For production with PostgreSQL (Neon example):
# DATABASE_URL=postgresql://username:password@hostname:port/database_name

# Authentication Settings
BETTER_AUTH_SECRET="your-secret-key-here"

# Application Settings
LOG_LEVEL=info
DEBUG=true

# For production, set DEBUG to false
# DEBUG=false

# JWT Secret for custom auth
JWT_SECRET="your-jwt-secret-key-here"
JWT_EXPIRATION_DELTA_MINUTES=30
```

## 🏗️ Project Structure

```
├── backend/                 # Python FastAPI backend
│   ├── src/
│   │   ├── api/           # API routes
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utilities
│   ├── main.py            # Application entry point
│   └── requirements.txt
├── frontend/               # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── lib/               # Shared utilities
│   ├── providers/         # React context providers
│   ├── services/          # API clients
│   └── .env               # Environment variables
├── CLAUDE.md              # Project documentation
└── README.md              # This file
```

## 🧪 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linter

### Backend
- `python -m uvicorn main:app --reload` - Start development server
- `python -m py_compile $(find . -name "*.py")` - Compile all Python files

## 🔐 Authentication Flow

1. Users register with email/username and password
2. Passwords are securely hashed using bcrypt
3. Successful login returns a JWT token
4. Token is stored in localStorage and used for authenticated requests
5. Session is maintained using React Context

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Stores user information (email, username, hashed password)
- **Tasks**: User's todo items (title, description, completion status)
- **Testimonials**: User reviews (name, email, rating, message)

## 🚀 Deployment

### Production URLs
- **Frontend**: [https://ai-todo-psi.vercel.app](https://ai-todo-psi.vercel.app)
- **Backend**: [https://aliaskariface-backend-todo-app.hf.space](https://aliaskariface-backend-todo-app.hf.space)

### Local Development
1. Follow the quick start instructions above to run locally

### Frontend Deployment (Vercel)
1. Build the application: `npm run build`
2. Deploy to Vercel using their CLI or GitHub integration
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_BASE_URL=https://aliaskariface-backend-todo-app.hf.space`
   - `NEXT_PUBLIC_BETTER_AUTH_URL=https://ai-todo-psi.vercel.app`
   - `NEXT_PUBLIC_SITE_URL=https://ai-todo-psi.vercel.app`

### Backend Deployment (Hugging Face Spaces)
1. Set `DEBUG=false` in environment
2. Configure production database connection
3. Deploy to Hugging Face Spaces with the appropriate runtime
4. Set environment variables in Hugging Face Secrets:
   - `DATABASE_URL=your_production_database_url`
   - `BETTER_AUTH_SECRET=your_secret_key`
   - `JWT_SECRET=your_jwt_secret`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Issues & Support

If you encounter any issues or have questions, please file an issue in the repository.