#!/bin/bash

echo "=========================================="
echo "   AI Chatbot Application Startup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Warning: .env file not found in backend/!${NC}"
    echo "Creating .env from .env.example..."
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}Please edit backend/.env and add your API keys!${NC}"
    read -p "Press Enter to continue or Ctrl+C to exit and edit .env..."
fi

echo -e "${GREEN}[1/6] Setting up Backend...${NC}"
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    if command -v python3 >/dev/null 2>&1; then
        python3 -m venv venv
    else
        python -m venv venv
    fi
fi

# Activate virtual environment (Linux/macOS Git Bash/WSL vs Windows Git Bash)
echo "Activating virtual environment..."
if [ -f "venv/bin/activate" ]; then
    # POSIX
    source venv/bin/activate
elif [ -f "venv/Scripts/activate" ]; then
    # Windows venv structure (Git Bash)
    source venv/Scripts/activate
else
    echo -e "${RED}Could not find venv activate script. Exiting.${NC}"
    exit 1
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Run migrations
echo -e "${GREEN}[2/6] Running database migrations...${NC}"
python manage.py makemigrations
python manage.py migrate

# Create superuser if needed
echo -e "${GREEN}[3/6] Checking for superuser...${NC}"
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superuser created: admin/admin123')
else:
    print('Superuser already exists')
EOF

# Start Django server in background
echo -e "${GREEN}[4/6] Starting Django backend server...${NC}"
python manage.py runserver 8000 &
BACKEND_PID=$!
echo "Backend running on http://127.0.0.1:8000 (PID: $BACKEND_PID)"

# Move to frontend
cd ../frontend

echo -e "${GREEN}[5/6] Setting up Frontend...${NC}"

# Install Node dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install
fi

# Start frontend development server
echo -e "${GREEN}[6/6] Starting React frontend server...${NC}"
npm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}=========================================="
echo "   🚀 Application Started Successfully!"
echo "==========================================${NC}"
echo ""
echo -e "Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "Backend:  ${GREEN}http://127.0.0.1:8000${NC}"
echo -e "Admin:    ${GREEN}http://localhost:8000/admin${NC}"
echo ""
echo "Default superuser: admin / admin123"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo 'Shutting down...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait