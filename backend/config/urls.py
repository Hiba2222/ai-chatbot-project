from django.urls import path, include
from django.contrib import admin
from rest_framework_simplejwt.views import TokenRefreshView
from api import views

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    
    # Authentication
    path('api/auth/signup/', views.signup, name='signup'),
    path('api/auth/login/', views.login, name='login'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Chat endpoints
    path('api/models/', views.get_models, name='get_models'),
    path('api/test-auth/', views.test_auth, name='test_auth'),
    path('api/chat/', views.chat, name='chat'),
    path('api/chat/history/', views.chat_history, name='chat_history'),
    path('api/chat/<int:chat_id>/', views.delete_chat, name='delete_chat'),
    path('api/chat/export/', views.export_history, name='export_history'),
    
    # User endpoints
    path('api/user/profile/', views.user_profile, name='user_profile'),
    path('api/user/language/', views.update_language, name='update_language'),
    path('api/user/profile/generate-summary/', views.generate_profile_summary, name='generate_profile_summary'),
]