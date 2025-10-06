# 🤖 AI-Powered Chatbot Platform

A full-stack multilingual chatbot application supporting English and Arabic with multiple AI models integration.

## ✨ Features

- 🌐 **Bilingual Support**: Full English and Arabic localization with RTL support
- 🤖 **Multiple AI Models**: OpenRouter models with optional Hugging Face fallback
- 🎯 **AI User Summaries**: Automatic profile generation based on chat history
- 💾 **Chat History**: Save and review all conversations
- 🔐 **JWT Authentication**: Secure user authentication
- 📱 **Responsive Design**: Mobile-friendly interface
- 📥 **Export Feature**: Download chat history as JSON

## 🛠️ Tech Stack

### Frontend
- React 19 + Vite
- React Router
- i18next (Internationalization)
- Axios
- Tailwind CSS 4
- Lucide React Icons

### Backend
- Django 4.2
- Django REST Framework + SimpleJWT
- JWT Authentication
- SQLite Database (default)
- OpenRouter API (primary) + Hugging Face Inference API (fallback)

## 📋 Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn
- API keys (at least one of the following):
  - OPENROUTER_API_KEY (recommended)
  - HUGGINGFACE_API_KEY (optional fallback)

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-chatbot-project

# Make run script executable
chmod +x run.sh

# Run the application
./run.sh
```

The script will:
1. Create Python virtual environment
2. Install all dependencies
3. Run database migrations
4. Create admin user
5. Start backend and frontend servers

Note: On Windows, use Git Bash/WSL to run the script, or follow the manual setup below.

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your API keys

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Ensure translation files exist
# Place your JSON files at: src/locales/en.json and src/locales/ar.json

# Start development server
npm run dev
```

## 🔑 Environment Variables

Create `backend/.env` file:

```env
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=True

# AI API Keys
OPENROUTER_API_KEY=your-openrouter-api-key
HUGGINGFACE_API_KEY=your-huggingface-api-key
```

## 📁 Project Structure

```
ai-chatbot/
├── backend/
│   ├── api/
│   │   ├── models.py          # Database models
│   │   ├── views.py           # API endpoints
│   │   ├── serializers.py     # Data serializers
│   │   ├── ai_service.py      # AI integration
│   │   └── urls.py            # URL routing
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBot.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   └── LanguageToggle.jsx
│   │   ├── i18n.js            # i18n configuration
│   │   ├── locales/
│   │   │   ├── en.json        # English translations
│   │   │   └── ar.json        # Arabic translations
│   │   └── App.jsx
│   └── package.json
├── run.sh                     # Startup script
└── README.md
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/token/refresh` - Refresh JWT token
- `GET /api/auth/test` - Verify JWT-protected route

### Chat
- `POST /api/chat` - Send message to AI
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/<id>` - Delete specific chat
- `GET /api/chat/export` - Export chat history

### Models
- `GET /api/models` - List available AI models

### User
- `GET /api/user/profile` - Get user profile with AI summary
- `PUT /api/user/language` - Update language preference

## 🎨 Internationalization (i18n)

### Structure
```
src/locales/
├── en.json    # English translations
└── ar.json    # Arabic translations
```

### Usage in Components
```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <h1>{t('landing.hero_title')}</h1>
    </div>
  );
};
```

### Switching Languages
```jsx
i18n.changeLanguage('ar'); // Switch to Arabic
i18n.changeLanguage('en'); // Switch to English
```

## 🤖 AI Model Integration

The application uses OpenRouter as the primary provider and falls back to the Hugging Face Inference API when needed. Configure API keys via `OPENROUTER_API_KEY` and optionally `HUGGINGFACE_API_KEY`.

Current models are defined in `backend/api/ai_service.py` and include:

- meta-llama/llama-3.3-70b-instruct:free (Meta)
- deepseek/deepseek-chat-v3.1:free (DeepSeek)
- google/gemma-3-27b-it:free (Google)
- mistralai/mistral-small-3.2-24b-instruct:free (Mistral)

## 📊 Database Models

### UserProfile
- `user` - Foreign key to User
- `language_preference` - User's preferred language
- `ai_summary` - AI-generated profile summary
- `summary_updated_at` - Last update timestamp

### Chat
- `user` - Foreign key to User
- `model` - AI model used
- `user_message` - User's input
- `ai_response` - AI's response
- `language` - Conversation language
- `created_at` - Timestamp

## 🔒 Security Features

- JWT token authentication
- CORS protection
- Environment variable protection
- Secure password hashing

## 🎯 AI User Summary Generation

The system automatically generates user summaries based on:
- Last 20 conversations
- Common topics and interests
- Usage patterns
- Query types

Summaries are updated:
- When accessing profile after 7 days
- Manually via profile page
- After significant new conversations

## 📥 Export Feature

Users can export their chat history in JSON format:

```json
{
  "user": "username",
  "export_date": "2025-10-04T10:30:00Z",
  "total_chats": 50,
  "chats": [
    {
      "date": "2025-10-04T10:00:00Z",
      "model": "meta-llama/llama-3.3-70b-instruct:free",
      "user_message": "Hello",
      "ai_response": "Hi! How can I help?",
      "language": "en"
    }
  ]
}
```

## 🚢 Deployment

### Heroku Deployment

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add buildpacks
heroku buildpacks:add heroku/python
heroku buildpacks:add heroku/nodejs

# Set environment variables
heroku config:set DJANGO_SECRET_KEY=your-secret
heroku config:set OPENROUTER_API_KEY=your-key

# Deploy
git push heroku main

# Run migrations
heroku run python backend/manage.py migrate
```

### Vercel Deployment (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

### Monorepo: Backend on Render (backend/)

Here’s exactly how to deploy your monorepo:

#### Backend on Render (points to `backend/`)

1) Connect repo
- Render Dashboard → New → Web Service → Connect your GitHub account.
- Select the repo: https://github.com/Hiba2222/ai-chatbot-project (not the `/tree/main/backend` URL).

2) Configure service
- Root Directory: `backend`
- Environment: Python
- Region/Instance: as you prefer
- Build Command:
  ```bash
  pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
  ```
- Start Command:
  ```bash
  gunicorn config.wsgi:application
  ```

3) Environment variables (Render → Service → Environment)
- `DJANGO_SECRET_KEY` = a strong random string
- `DJANGO_DEBUG` = False
- `OPENROUTER_API_KEY` = your key
- `HUGGINGFACE_API_KEY` = your key (optional)
- `ALLOWED_HOSTS` = your-service-name.onrender.com
- `CORS_ALLOWED_ORIGINS` = https://your-frontend.vercel.app
- Optional for Postgres: `DATABASE_URL` (if you add Render PostgreSQL and wire it in settings)

4) Notes for your codebase
- In `backend/config/settings.py`, either:
  - Add your Render and Vercel URLs to the existing `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`, or
  - Make them read from env:
    ```python
    ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
    CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')
    ```
- Static files are already handled with WhiteNoise in your settings.
- If you want to use Postgres, add `dj-database-url` and parse `DATABASE_URL` in `settings.py` (snippet below):
  ```python
  import dj_database_url
  if os.getenv('DATABASE_URL'):
      DATABASES = {
          'default': dj_database_url.parse(os.getenv('DATABASE_URL'), conn_max_age=600, ssl_require=True)
      }
  ```

## 🧪 Testing

```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm test
```

## 🛠️ Development Tools Used

- **GitHub Copilot** - Code completion and suggestions
- **Cursor AI** - AI-assisted coding
- **VS Code** - Primary IDE

## 📝 API Response Examples

### Login Response
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "username": "testuser",
    "email": "test@example.com",
    "language": "en"
  }
}
```

### Chat Response
```json
{
  "id": 123,
  "message": "What is AI?",
  "response": "AI stands for Artificial Intelligence...",
  "model": "grok",
  "timestamp": "2025-10-04T10:30:00Z"
}
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# macOS/Linux
# Kill process on port 8000
kill -9 $(lsof -t -i:8000)
# Kill process on port 5173
kill -9 $(lsof -t -i:5173)
```

On Windows (PowerShell):
```powershell
# Find PID on a port
Get-NetTCPConnection -LocalPort 8000 | Select-Object -Expand OwningProcess
Stop-Process -Id <PID> -Force

Get-NetTCPConnection -LocalPort 5173 | Select-Object -Expand OwningProcess
Stop-Process -Id <PID> -Force
```

### Database Issues
```bash
# Reset database
rm backend/db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### API Key Errors
- Verify .env file exists
- Check API keys are valid
- Ensure no extra spaces in keys

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check documentation at `/docs`
- Contact: your-email@example.com

## 📄 License

MIT License - see LICENSE file

## 👨‍💻 Author

Your Name - [GitHub Profile]

## 🙏 Acknowledgments

- Anthropic (Claude API)
- OpenAI (GPT API)
- xAI (Grok API)
- DeepSeek Team

---

**Made with ❤️ using AI-assisted development tools**