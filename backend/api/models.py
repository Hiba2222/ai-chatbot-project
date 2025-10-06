from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class UserProfile(models.Model):
    """Extended user profile with language preference and AI summary"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    language_preference = models.CharField(
        max_length=2,
        choices=[('en', 'English'), ('ar', 'Arabic')],
        default='en'
    )
    ai_summary = models.TextField(blank=True, null=True)
    summary_updated_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    class Meta:
        db_table = 'user_profiles'
        # Ensure email uniqueness at the DB level if using a custom user model; for default User,
        # we enforce uniqueness in the signup view.


class Chat(models.Model):
    """Store chat conversations with AI models"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chats')
    model = models.CharField(
        max_length=20,
        choices=[
            ('grok', 'Grok AI'),
            ('deepseek', 'DeepSeek'),
            ('llama', 'LLaMA')
        ]
    )
    user_message = models.TextField()
    ai_response = models.TextField()
    language = models.CharField(
        max_length=2,
        choices=[('en', 'English'), ('ar', 'Arabic')],
        default='en'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Chat {self.id} - {self.user.username} - {self.model}"
    
    class Meta:
        db_table = 'chats'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['model']),
        ]


class ChatSession(models.Model):
    """Group chats into sessions"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_sessions')
    title = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Session {self.id} - {self.user.username}"
    
    class Meta:
        db_table = 'chat_sessions'
        ordering = ['-updated_at']
