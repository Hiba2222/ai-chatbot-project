# config/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from api import views  # Add this import

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Root path
    path('', views.index, name='index'),
    
    # Health check at root level
    path('health/', views.health_check, name='health_check'),
    
    # Include all API routes under /api/
    path('api/', include('api.urls')),
    
    # JWT Token refresh
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]