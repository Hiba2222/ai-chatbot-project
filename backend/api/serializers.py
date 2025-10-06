from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Chat, UserProfile, ChatSession


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    total_chats = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'language_preference', 'ai_summary',
            'summary_updated_at', 'created_at', 'total_chats'
        ]
    
    def get_total_chats(self, obj):
        return Chat.objects.filter(user=obj.user).count()


class ChatSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Chat
        fields = [
            'id', 'username', 'model', 'user_message',
            'ai_response', 'language', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ChatSessionSerializer(serializers.ModelSerializer):
    message_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatSession
        fields = ['id', 'title', 'created_at', 'updated_at', 'message_count']
    
    def get_message_count(self, obj):
        return Chat.objects.filter(user=obj.user, created_at__gte=obj.created_at).count()