import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import './ChatHistory.css';
import LoadingState from './states/LoadingState';
import ChatHistoryHeader from './header/ChatHistoryHeader';
import EmptyHistory from './states/EmptyHistory';
import ChatList from './list/ChatList';
import ChatDetail from './detail/ChatDetail';
import ChatDetailPlaceholder from './detail/ChatDetailPlaceholder';

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

  if (loading) {
    return (
      <LoadingState />
    );
  }

  return (
    <div className="chat-history-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="chat-history-content">
        {/* Header */}
        <ChatHistoryHeader count={chats.length} />

        {chats.length === 0 ? (
          <EmptyHistory />
        ) : (
          <div className="chat-history-grid">
            {/* Chat List */}
            <ChatList
              chats={chats}
              selectedChatId={selectedChat?.id}
              onSelect={setSelectedChat}
              onDelete={deleteChat}
            />

            {/* Chat Detail */}
            <div className="chat-detail">
              {selectedChat ? (
                <ChatDetail chat={selectedChat} onDelete={deleteChat} isRTL={isRTL} />
              ) : (
                <ChatDetailPlaceholder isRTL={isRTL} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;