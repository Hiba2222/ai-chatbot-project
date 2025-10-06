<img width="1351" height="594" alt="10" src="https://github.com/user-attachments/assets/891b1efc-de93-47ad-8855-030fee89e201" />
<img width="1347" height="579" alt="9" src="https://github.com/user-attachments/assets/64645d48-7e49-4eeb-a7e5-a8428714f7f8" />
<img width="424" height="566" alt="8" src="https://github.com/user-attachments/assets/ec9bd162-1829-47f3-a1f1-78b1621880b9" />
<img width="410" height="594" alt="7" src="https://github.com/user-attachments/assets/14916dd7-ce6e-4f50-9933-9f394cbdec19" />
<img width="1334" height="582" alt="6" src="https://github.com/user-attachments/assets/1a5674a3-c499-476f-a035-6a7ef017f59c" />
# 🤖 AI-Powered Chatbot Platform

A full-stack multilingual chatbot application supporting English and Arabic with multiple AI models integration.

## 🔗 Live Demo

- Backend API (Render): https://ai-chatbot-project-2-chyi.onrender.com
- Frontend App (Vercel): https://ai-chatbot-project-pearl.vercel.app/

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
ai-chatbot-project/
├── backend/
│   ├── api/
│   │   ├── models.py              # Database models
│   │   ├── views.py               # API endpoints
│   │   ├── serializers.py         # Data serializers
│   │   ├── ai_service.py          # AI integration
│   │   └── urls.py                # API URL routing
│   ├── config/
│   │   ├── settings.py            # Django settings (CORS, JWT, DB)
│   │   ├── urls.py                # Project URL routing
│   │   ├── wsgi.py
│   │   ├── asgi.py
│   │   └── __init__.py
│   ├── manage.py
│   ├── requirements.txt
│   ├── runtime.txt                # Python version for deploy
│   └── .env.example               # Example env variables
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance (uses VITE_API_BASE_URL)
│   │   ├── components/
│   │   │   ├── chatbot/
│   │   │   │   ├── Chatbot.jsx
│   │   │   │   ├── Chatbot.css
│   │   │   │   ├── header/ChatbotHeader.jsx
│   │   │   │   ├── input/InputContainer.jsx
│   │   │   │   └── messages/MessagesContainer.jsx
│   │   │   ├── chat-history/
│   │   │   │   ├── ChatHistory.jsx
│   │   │   │   └── list/ChatList.jsx
│   │   │   ├── landing-page/LandingPage.jsx
│   │   │   ├── language-section/LanguageProvider.jsx
│   │   │   ├── login/Login.jsx
│   │   │   ├── sign-up/SignUp.jsx
│   │   │   ├── navbar/Navbar.jsx
│   │   │   └── user-profile/UserProfile.jsx
│   │   ├── locales/
│   │   │   ├── en.json            # English translations
│   │   │   └── ar.json            # Arabic translations
│   │   ├── i18n.js                # i18n configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js (implicit)
├── run.sh                         # Local dev startup script
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

### Backend → Render (Django)

1) Create Web Service
- Connect your GitHub repo.
- Root Directory: `backend/`
- Start Command:
  ```bash
  gunicorn config.wsgi:application
  ```
- Build Command:
  ```bash
  pip install --upgrade pip setuptools wheel && \
  pip install --no-cache-dir -r requirements.txt && \
  python manage.py migrate && \
  python manage.py collectstatic --noinput
  ```

2) Python version
- Keep `backend/runtime.txt` with:
  ```
  python-3.12.5
  ```
- If you cannot set Root Directory, add a `runtime.txt` at repo root with the same content.

3) Database choice
- SQLite (default): do NOT set `DATABASE_URL` on the service. Data is ephemeral on free plan unless you attach a Disk.
- Postgres (recommended for production): provision Render PostgreSQL and set `DATABASE_URL` on the service.

4) Environment and hosts
- Set in dashboard if available (or use code defaults already present):
  - `DJANGO_SECRET_KEY`: strong random value
  - `DJANGO_DEBUG`: `False`
  - `OPENROUTER_API_KEY`, `HUGGINGFACE_API_KEY` (optional)
- `backend/config/settings.py` includes safe defaults for:
  - `ALLOWED_HOSTS` including your Render host
  - `CSRF_TRUSTED_ORIGINS` including your Render host
  - CORS for Vercel (`CORS_ALLOWED_ORIGIN_REGEXES` for `*.vercel.app`), plus explicit allow for your project domain

5) Deploy
- Click “Clear build cache & deploy” to ensure changes take effect.
- Health check: `GET https://<your-service>.onrender.com/api/models/` should return HTTP 200.

Troubleshooting (Render)
- If you see Python 3.13 in logs, Root Directory isn’t `backend/` or root `runtime.txt` is missing.
- `DisallowedHost`: ensure your Render hostname is included (defaults already cover this).
- `sqlite sslmode` during migrate: ensure `DATABASE_URL` is not set unless you’re using Postgres.

### Frontend → Vercel (Vite React)

1) Create Project
- Root directory: `frontend/`
- Build Command: `npm run build`
- Output Directory: `dist`

2) Environment Variable
- Add in Vercel Project → Settings → Environment Variables:
  ```
  VITE_API_BASE_URL=https://<your-service>.onrender.com
  ```
- Redeploy after saving.

3) Case-sensitive paths
- Vercel uses a case-sensitive filesystem. Ensure imports match file names exactly (e.g., `Chatbot.jsx` not `ChatBot.jsx`).

Troubleshooting (Vercel)
- CORS blocked: backend must allow your Vercel origin. Defaults include `*.vercel.app`; we also explicitly added your domain. If you change domains, update backend CORS.
- 404 on `/`: expected on backend; verify `/api/models/` instead.

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
- Contact: hiba.nahdi@ensi-uma.tn

## 📄 License

MIT License - see LICENSE file

## 👨‍💻 Author

Hiba Nahdi - https://github.com/Hiba2222

## 🙏 Acknowledgments

- Anthropic (Claude API)
- OpenAI (GPT API)
- xAI (Grok API)
- DeepSeek Team

---

**Made with ❤️ **
