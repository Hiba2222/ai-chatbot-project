from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('models/', views.get_models, name='get_models'),
    path('chat/', views.chat, name='chat'),
    path('history/', views.chat_history, name='chat_history'),
    path('history/<int:chat_id>/', views.delete_chat, name='delete_chat'),
    path('profile/', views.user_profile, name='user_profile'),
    path('profile/summary/', views.generate_profile_summary, name='generate_profile_summary'),
    path('profile/language/', views.update_language, name='update_language'),
    path('export/', views.export_history, name='export_history'),
    path('auth/test/', views.test_auth, name='test_auth'),
]
