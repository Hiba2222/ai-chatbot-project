from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Chat, UserProfile
from .serializers import ChatSerializer, UserProfileSerializer
from .ai_service import ai_service
from django.utils import timezone
import json

# Rate limiting
from rest_framework.throttling import UserRateThrottle

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return HttpResponse("Hello from API 👋")

class ChatRateThrottle(UserRateThrottle):
    rate = '30/minute'


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """User registration endpoint"""
    try:
        print(f"Signup request data: {request.data}")
        username = (request.data.get('username') or '').strip()
        email = (request.data.get('email') or '').strip().lower()
        password = request.data.get('password')
        language = request.data.get('language', 'en')
        
        print(f"Parsed data - Username: {username}, Email: {email}, Password: {'*' * len(password) if password else 'None'}, Language: {language}")
        
        # Validate required fields
        if not username or not email or not password:
            print("Validation failed - missing required fields")
            return Response(
                {'error': 'Username, email, and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(username=username).exists():
            print("Username already exists")
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Enforce unique email (case-insensitive)
        if User.objects.filter(email__iexact=email).exists():
            print("Email already in use")
            return Response(
                {'error': 'Email already in use', 'code': 'email_exists'},
                status=status.HTTP_409_CONFLICT
            )
        
        print("Creating user...")
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        print(f"User created: {user.username}")
        
        # Create user profile
        UserProfile.objects.create(
            user=user,
            language_preference=language
        )
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'username': user.username,
                'email': user.email,
                'language': language
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        import traceback
        print(f"Signup error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return Response(
            {'error': str(e), 'details': traceback.format_exc()},
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
        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={'language_preference': 'en'}
        )
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
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
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_auth(request):
    """Test authentication endpoint"""
    return Response({
        'message': 'Authentication successful',
        'user': request.user.username,
        'authenticated': request.user.is_authenticated
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat(request):
    """Handle chat requests with AI models"""
    try:
        message = request.data.get('message')
        model = request.data.get('model', 'grok')  # Default to grok
        
        # Get user's language preference
        profile = UserProfile.objects.get(user=request.user)
        language = profile.language_preference
        
        # Get AI response
        ai_response = ai_service.get_response(model, message, language)
        
        # Save chat to database
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
        return Response(
            {'error': str(e)},
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get user profile with AI-generated summary"""
    try:
        profile, created = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={'language_preference': 'en'}
        )
        
        
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_profile_summary(request):
    """Force-generate or refresh the user's AI profile summary now"""
    try:
        profile, created = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={'language_preference': 'en'}
        )

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
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_language(request):
    """Update user's language preference"""
    try:
        language = request.data.get('language')
        profile, created = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={'language_preference': 'en'}
        )
        profile.language_preference = language
        profile.save()
        
        return Response({'message': 'Language updated successfully'})
    except Exception as e:
        return Response(
            {'error': str(e)},
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