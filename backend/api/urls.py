# api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # API root - this will be at /api/
    path('', views.api_root, name='api_root'),
    
    # Authentication - these will be at /api/auth/
    path('auth/signup/', views.signup, name='signup'),
    path('auth/login/', views.login, name='login'),
    path('auth/test/', views.test_auth, name='test_auth'),

    # Models - these will be at /api/models/
    path('models/', views.get_models, name='get_models'),

    # Chat - these will be at /api/chat/
    path('chat/', views.chat, name='chat'),
    path('chat/history/', views.chat_history, name='chat_history'),
    path('chat/history/<int:chat_id>/', views.delete_chat, name='delete_chat'),
    path('chat/export/', views.export_history, name='export_history'),

    # User profile - these will be at /api/user/
    path('user/profile/', views.user_profile, name='user_profile'),
    path('user/profile/summary/', views.generate_profile_summary, name='generate_profile_summary'),
    path('user/language/', views.update_language, name='update_language'),
    
    path('debug/db/', views.debug_db, name='debug_db'),
]