# api/views.py
from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Chat, UserProfile
from django.urls import reverse
from .serializers import ChatSerializer, UserProfileSerializer
from .ai_service import ai_service
from .services import get_or_create_profile
from django.utils import timezone
import logging

logger = logging.getLogger('api.views')

# Root endpoint
def index(request):
    """Root endpoint"""
    return HttpResponse("AI Chatbot API is running! Use /api/ endpoints.")

# Health check
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({'status': 'ok', 'message': 'API is healthy'})

# Authentication endpoints
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """User registration endpoint"""
    try:
        username = (request.data.get('username') or '').strip()
        email = (request.data.get('email') or '').strip().lower()
        password = request.data.get('password')
        language = request.data.get('language', 'en')
        
        logger.info(f"Signup attempt - username: {username}")
        
        # Validate required fields
        if not username or not email or not password:
            return Response(
                {'error': 'Username, email, and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate email format
        if '@' not in email or '.' not in email:
            return Response(
                {'error': 'Please enter a valid email address'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email__iexact=email).exists():
            return Response(
                {'error': 'Email already in use'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(password) < 6:
            return Response(
                {'error': 'Password must be at least 6 characters long'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        # Create profile
        profile = get_or_create_profile(user, default_language=language)
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'language': language
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.exception("Signup error")
        return Response(
            {'error': 'Internal server error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """User login endpoint"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user:
        profile = get_or_create_profile(user)
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'language': profile.language_preference
            }
        })
    
    return Response(
        {'error': 'Invalid credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_auth(request):
    """Test authentication endpoint"""
    return Response({
        'message': 'Authentication successful',
        'user': request.user.username
    })

# AI Models endpoint
@api_view(['GET'])
@permission_classes([AllowAny])
def get_models(request):
    """Get list of available AI models"""
    try:
        models = ai_service.get_available_models()
        return Response({
            'models': models,
            'count': len(models)
        })
    except Exception as e:
        logger.exception("Error getting models")
        return Response(
            {'error': 'Internal server error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Chat endpoints
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat(request):
    """Handle chat requests with AI models"""
    try:
        message = request.data.get('message')
        model = request.data.get('model', 'grok')
        
        profile = get_or_create_profile(request.user)
        language = profile.language_preference
        
        ai_response = ai_service.get_response(model, message, language)
        
        chat = Chat.objects.create(
            user=request.user,
            model=model,
            user_message=message,
            ai_response=ai_response,
            language=language
        )
        
        return Response({
            'id': chat.id,
            'message': message,
            'response': ai_response,
            'model': model,
            'timestamp': chat.created_at
        })
        
    except Exception as e:
        logger.exception("Chat error")
        return Response(
            {'error': 'Internal server error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_history(request):
    """Get user's chat history"""
    chats = Chat.objects.filter(user=request.user).order_by('-created_at')
    serializer = ChatSerializer(chats, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_chat(request, chat_id):
    """Delete a specific chat"""
    try:
        chat = Chat.objects.get(id=chat_id, user=request.user)
        chat.delete()
        return Response({'message': 'Chat deleted successfully'})
    except Chat.DoesNotExist:
        return Response(
            {'error': 'Chat not found'},
            status=status.HTTP_404_NOT_FOUND
        )

# User profile endpoints
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get user profile"""
    try:
        profile = get_or_create_profile(request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    except Exception as e:
        logger.exception("User profile error")
        return Response(
            {'error': 'Internal server error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_profile_summary(request):
    """Generate user profile summary"""
    try:
        profile = get_or_create_profile(request.user)
        chats = Chat.objects.filter(user=request.user).order_by('-created_at')[:50]
        chat_data = [
            {
                'user_message': chat.user_message,
                'ai_response': chat.ai_response
            }
            for chat in chats
        ]

        if not chat_data:
            return Response({'error': 'No chat data to summarize'}, status=status.HTTP_400_BAD_REQUEST)

        summary = ai_service.generate_user_summary(chat_data, profile.language_preference)
        profile.ai_summary = summary
        profile.summary_updated_at = timezone.now()
        profile.save()

        return Response({'summary': summary, 'updated_at': profile.summary_updated_at})
    except Exception as e:
        logger.exception("Profile summary error")
        return Response(
            {'error': 'Internal server error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_language(request):
    """Update user's language preference"""
    try:
        language = request.data.get('language')
        profile = get_or_create_profile(request.user)
        profile.language_preference = language
        profile.save()
        return Response({'message': 'Language updated successfully'})
    except Exception as e:
        logger.exception("Language update error")
        return Response(
            {'error': 'Internal server error'},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_history(request):
    """Export chat history as JSON"""
    chats = Chat.objects.filter(user=request.user).order_by('-created_at')
    export_data = [
        {
            'date': chat.created_at.isoformat(),
            'model': chat.model,
            'user_message': chat.user_message,
            'ai_response': chat.ai_response,
            'language': chat.language
        }
        for chat in chats
    ]
    return Response({
        'user': request.user.username,
        'export_date': timezone.now().isoformat(),
        'total_chats': len(export_data),
        'chats': export_data
    })
     
# api/views.py - Update api_root function
@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """API root endpoint that lists all available endpoints"""
    base_url = request.build_absolute_uri('/api/')
    
    endpoints = {
        "message": "AI Chatbot API - Available Endpoints",
        "version": "1.0",
        "endpoints": {
            "authentication": {
                "signup": f"{base_url}auth/signup/",
                "login": f"{base_url}auth/login/",
                "test_auth": f"{base_url}auth/test/",
                "token_refresh": f"{base_url}auth/token/refresh/"
            },
            "ai_models": {
                "list_models": f"{base_url}models/"
            },
            "chat": {
                "send_message": f"{base_url}chat/",
                "get_history": f"{base_url}chat/history/",  # Updated
                "delete_chat": f"{base_url}chat/history/<id>/",  # Updated
                "export_chats": f"{base_url}chat/export/"  # Updated
            },
            "user_profile": {
                "get_profile": f"{base_url}user/profile/",
                "generate_summary": f"{base_url}user/profile/summary/",
                "update_language": f"{base_url}user/language/"
            }
        },
        "quick_start": {
            "1": "Register: POST /api/auth/signup/",
            "2": "Login: POST /api/auth/login/", 
            "3": "Get models: GET /api/models/",
            "4": "Start chatting: POST /api/chat/",
            "5": "View history: GET /api/chat/history/"  # Updated
        }
    }
    
    return Response(endpoints)

@api_view(['GET'])
@permission_classes([AllowAny])
def debug_db(request):
    """Debug endpoint to check database state"""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    users = User.objects.all()
    user_data = []
    
    for user in users:
        user_data.append({
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'is_active': user.is_active
        })
    
    return Response({
        'total_users': len(users),
        'users': user_data,
        'database_engine': settings.DATABASES['default']['ENGINE']
    })