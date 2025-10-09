from django.contrib import admin
from django.contrib.auth.models import User
from django.utils.html import format_html
from django.db.models import Count
from .models import UserProfile, Chat, ChatSession


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'user_email', 'language_preference', 'chat_count', 'session_count', 'created_at')
    list_filter = ('language_preference', 'created_at', 'summary_updated_at')
    search_fields = ('user__username', 'user__email', 'ai_summary')
    readonly_fields = ['created_at', 'updated_at', 'summary_updated_at', 'get_profile_summary']
    list_select_related = ['user']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'language_preference')
        }),
        ('AI Summary', {
            'fields': ('ai_summary', 'summary_updated_at'),
            'classes': ('wide',)
        }),
        ('Profile Summary & Statistics', {
            'fields': ('get_profile_summary',),
            'classes': ('wide',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def user_email(self, obj):
        return obj.user.email
    
    user_email.short_description = 'Email'
    user_email.admin_order_field = 'user__email'
    
    def chat_count(self, obj):
        count = obj.user.chats.count()
        return format_html('<strong>{}</strong>', count)
    
    chat_count.short_description = 'Total Chats'
    
    def session_count(self, obj):
        count = obj.user.chat_sessions.count()
        return format_html('<strong>{}</strong>', count)
    
    session_count.short_description = 'Sessions'
    
    # Simplified get_profile_summary method

    def get_profile_summary(self, obj):
        if not obj.pk:
            return "Save profile to see summary"
        
        total_chats = obj.user.chats.count()
        total_sessions = obj.user.chat_sessions.count()
        
        # Simple text summary instead of complex HTML
        summary = f"""
        User: {obj.user.username}
        Email: {obj.user.email}
        Language: {obj.get_language_preference_display()}
        Total Chats: {total_chats}
        Chat Sessions: {total_sessions}
        Member Since: {obj.created_at.strftime('%Y-%m-%d')}
        """
        
        return summary

    get_profile_summary.short_description = 'Profile Summary'


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'model', 'language', 'created_at', 'message_preview')
    list_filter = ('model', 'language', 'created_at')
    search_fields = ('user__username', 'user_message', 'ai_response')
    readonly_fields = ['created_at']
    list_select_related = ['user']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Chat Information', {
            'fields': ('user', 'model', 'language')
        }),
        ('Conversation', {
            'fields': ('user_message', 'ai_response'),
            'classes': ('wide',)
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def message_preview(self, obj):
        return obj.user_message[:50] + '...' if len(obj.user_message) > 50 else obj.user_message
    
    message_preview.short_description = 'Message Preview'


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'get_title_display', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('user__username', 'title', 'id')  # Added 'id' to search
    readonly_fields = ['created_at', 'updated_at', 'get_session_summary']
    list_select_related = ['user']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Session Information', {
            'fields': ('user', 'title')
        }),
        ('Session Summary', {
            'fields': ('get_session_summary',),
            'classes': ('wide',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_title_display(self, obj):
        """Display title or a placeholder"""
        if obj.title:
            return obj.title
        return format_html('<em style="color: #999;">Untitled Session #{}</em>', obj.id)
    
    get_title_display.short_description = 'Title'
    get_title_display.admin_order_field = 'title'
    
    def get_session_summary(self, obj):
        if not obj.pk:
            return "Save session to see summary"
        
        duration = obj.updated_at - obj.created_at
        days = duration.days
        hours = duration.seconds // 3600
        minutes = (duration.seconds % 3600) // 60
        
        html = f"""
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #6c757d;">
            <h3 style="margin-top: 0; color: #6c757d;">💬 Chat Session Summary</h3>
            
            <div style="background: white; padding: 15px; border-radius: 6px;">
                <p style="margin: 8px 0;"><strong>Session ID:</strong> #{obj.id}</p>
                <p style="margin: 8px 0;"><strong>User:</strong> {obj.user.username} ({obj.user.email})</p>
                <p style="margin: 8px 0;"><strong>Title:</strong> {obj.title if obj.title else '<em>Untitled Session</em>'}</p>
                <p style="margin: 8px 0;"><strong>Created:</strong> {obj.created_at.strftime('%Y-%m-%d %H:%M:%S')}</p>
                <p style="margin: 8px 0;"><strong>Last Updated:</strong> {obj.updated_at.strftime('%Y-%m-%d %H:%M:%S')}</p>
                <p style="margin: 8px 0;"><strong>Duration:</strong> {days} day{'s' if days != 1 else ''}, {hours} hour{'s' if hours != 1 else ''}, {minutes} minute{'s' if minutes != 1 else ''}</p>
            </div>
            
            <div style="background: #d1ecf1; padding: 10px; border-radius: 6px; margin-top: 15px; border-left: 4px solid #0c5460;">
                <strong>ℹ️ Note:</strong> Add a ForeignKey relationship from Chat to ChatSession to track chats within this session.
            </div>
        </div>
        """
        return format_html(html)
    
    get_session_summary.short_description = 'Session Summary'