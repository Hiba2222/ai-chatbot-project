import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { History, Trash2, Calendar, Bot, MessageSquare } from 'lucide-react';
//import axios from 'axios';
import api from '../../api/axios';
import './ChatHistory.css';


const ChatHistory = () => {
  const { t, i18n } = useTranslation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/chat/history/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async (chatId) => {
    if (!window.confirm(t('history.delete_confirm'))) return;

    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/chat/${chatId}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setChats(chats.filter(chat => chat.id !== chatId));
      if (selectedChat?.id === chatId) setSelectedChat(null);
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert(t('errors.server_error'));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-TN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-history-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="chat-history-content">
        {/* Header */}
        <div className="chat-history-header">
          <History size={32} className="chat-history-icon" />
          <h1 className="chat-history-title">{t('history.title')}</h1>
          <span className="chat-history-count">
            {chats.length} {t('history.total')}
          </span>
        </div>

        {chats.length === 0 ? (
          <div className="empty-history">
            <MessageSquare size={64} className="empty-history-icon" />
            <p className="empty-history-text">{t('history.no_history')}</p>
          </div>
        ) : (
          <div className="chat-history-grid">
            {/* Chat List */}
            <div className="chat-list">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`chat-item ${
                    selectedChat?.id === chat.id ? 'selected' : ''
                  }`}
                >
                  <div className="chat-item-header">
                    <div className="chat-item-info">
                      <Bot size={20} className="chat-item-bot-icon" />
                      <span className="chat-item-model">
                        {chat.model.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="chat-item-delete-btn"
                    >
                      <Trash2 size={18} className="chat-item-delete-icon" />
                    </button>
                  </div>

                  <p className="chat-item-message">
                    {chat.user_message}
                  </p>

                  <div className="chat-item-date">
                    <Calendar size={14} className="chat-item-date-icon" />
                    <span>{formatDate(chat.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Detail */}
            <div className="chat-detail">
              {selectedChat ? (
                <div className="chat-detail-card">
                  <div className="chat-detail-header">
                    <div className="chat-detail-model-row">
                      <span className="chat-detail-model-label">
                        {t('history.model_label')}
                      </span>
                      <span className="chat-detail-model-badge">
                        {selectedChat.model.toUpperCase()}
                      </span>
                    </div>
                    <div className="chat-detail-date">
                      <Calendar size={14} className="chat-detail-date-icon" />
                      <span>{formatDate(selectedChat.created_at)}</span>
                    </div>
                  </div>

                  <div className="chat-detail-content">
                    {/* User Message */}
                    <div className="chat-detail-section">
                      <div className="chat-detail-section-label">
                        {isRTL ? 'رسالتك' : 'Your Message'}
                      </div>
                      <div className="chat-detail-message user">
                        <p className="chat-detail-message-text">
                          {selectedChat.user_message}
                        </p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="chat-detail-section">
                      <div className="chat-detail-section-label">
                        {isRTL ? 'رد الذكاء الاصطناعي' : 'AI Response'}
                      </div>
                      <div className="chat-detail-message ai">
                        <p className="chat-detail-message-text">
                          {selectedChat.ai_response}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteChat(selectedChat.id)}
                    className="chat-detail-delete-btn"
                  >
                    <Trash2 size={20} className="chat-detail-delete-icon" />
                    <span>{t('history.delete_button')}</span>
                  </button>
                </div>
              ) : (
                <div className="chat-detail-placeholder">
                  <MessageSquare size={48} className="chat-detail-placeholder-icon" />
                  <p className="chat-detail-placeholder-text">{isRTL ? 'اختر محادثة لعرض التفاصيل' : 'Select a chat to view details'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;