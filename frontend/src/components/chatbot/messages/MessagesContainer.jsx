import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Loader } from 'lucide-react';
import MessageItem from '../message/MessageItem';
import './MessagesContainer.css';

const MessagesContainer = ({ messages, loading, t, messagesEndRef }) => {
  return (
    <ScrollArea className="messages-container">
      <div className="messages-content">
        {messages.length === 0 ? (
          <div className="empty-state">
            <MessageSquare size={64} className="empty-state-icon" />
            <p className="empty-state-text">{t('chat.no_messages')}</p>
          </div>
        ) : (
          messages.map((msg, idx) => <MessageItem key={idx} msg={msg} />)
        )}

        {loading && (
          <div className="loading-message">
            <div className="loading-content">
              <Avatar className="loading-avatar">
                <AvatarFallback className="loading-avatar-fallback">AI</AvatarFallback>
              </Avatar>
              <div className="loading-details">
                <div className="loading-header">
                  <span className="loading-author">AI Assistant</span>
                </div>
                <div className="loading-bubble-container">
                  <div className="loading-bubble">
                    <div className="loading-content-inner">
                      <Loader className="loading-spinner" size={16} />
                      <span className="loading-text">{t('chat.thinking')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessagesContainer;
