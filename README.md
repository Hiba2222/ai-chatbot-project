# 🤖 AI-Powered Chatbot Platform

A full-stack multilingual chatbot application supporting English and Arabic with multiple AI models integration.

## ✨ Features

- 🌐 **Bilingual Support**: Full English and Arabic localization with RTL support
- 🤖 **3 AI Models**: Grok, DeepSeek, and LLaMA integration
- 🎯 **AI User Summaries**: Automatic profile generation based on chat history
- 💾 **Chat History**: Save and review all conversations
- 🔐 **JWT Authentication**: Secure user authentication
- 📱 **Responsive Design**: Mobile-friendly interface
- 📊 **User Analytics**: Track conversation patterns and interests
- 📥 **Export Feature**: Download chat history as JSON

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router
- i18next (Internationalization)
- Axios
- Tailwind CSS
- Lucide React Icons

### Backend
- Django 4.2
- Django REST Framework
- JWT Authentication
- SQLite Database
- OpenAI/Grok/DeepSeek APIs

## 📋 Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn
- API Keys for AI models (at least one)

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-chatbot

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

# Create locales folder
mkdir -p public/locales
# Copy en.json and ar.json to public/locales/

# Start development server
npm run dev
```

## 🔑 Environment Variables

Create `backend/.env` file:

```env
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True

# AI API Keys
GROK_API_KEY=your-grok-api-key
DEEPSEEK_API_KEY=your-deepseek-api-key
OPENAI_API_KEY=your-openai-api-key

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
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
│   │   └── App.jsx
│   ├── public/
│   │   └── locales/
│   │       ├── en.json        # English translations
│   │       └── ar.json        # Arabic translations
│   └── package.json
├── run.sh                     # Startup script
└── README.md
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/token/refresh` - Refresh JWT token

### Chat
- `POST /api/chat` - Send message to AI
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/<id>` - Delete specific chat
- `GET /api/chat/export` - Export chat history

### User
- `GET /api/user/profile` - Get user profile with AI summary
- `PUT /api/user/language` - Update language preference

## 🎨 Internationalization (i18n)

### Structure
```
public/locales/
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

The application supports three AI models:

1. **Grok AI** (xAI) - Primary model
2. **DeepSeek** - Alternative model
3. **LLaMA** (via OpenAI API) - Fallback model

### Adding New Models

Edit `backend/api/ai_service.py`:

```python
def get_new_model_response(self, message: str, language: str) -> str:
    # Your implementation
    pass

# Add to model_map in get_response()
model_map = {
    'grok': self.get_grok_response,
    'deepseek': self.get_deepseek_response,
    'llama': self.get_llama_response,
    'newmodel': self.get_new_model_response  # Add here
}
```

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
- Rate limiting (100 requests/hour per user)
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
      "model": "grok",
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
heroku config:set GROK_API_KEY=your-key

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
# Kill process on port 8000
kill -9 $(lsof -t -i:8000)

# Kill process on port 5173
kill -9 $(lsof -t -i:5173)
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