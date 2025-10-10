import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import './MessageItem.css';

const MessageItem = ({ msg }) => {
  return (
    <div className="message-item">
      <div className={`message-content ${msg.role === 'user' ? 'user' : ''}`}>
        <a href={msg.role === 'user' ? '/profile' : ''}>
          <Avatar className="message-avatar">
            <AvatarImage 
              src={msg.role === 'user' ? '/user-avatar.png' : '/ai-avatar.png'}
              onError={(e) => {
                e.target.style.display = 'none'; // Hide broken image
              }}
            />
            <AvatarFallback className="message-avatar-fallback">
              {msg.role === 'user' ? 'You' : 'AI'}
            </AvatarFallback>
          </Avatar>
        </a>
        <div className={`message-details ${msg.role === 'user' ? 'user' : 'ai'}`}>
          <div className="message-header">
            <span className="message-author">
              {msg.role === 'user' ? 'You' : 'AI Assistant'}
            </span>
            {msg.model && (
              <Badge variant="secondary" className="message-model-badge">
                {msg.model}
              </Badge>
            )}
          </div>
          <div className={`message-bubble-container ${msg.role === 'user' ? 'user' : 'ai'}`}>
            <div className={`message-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
              <p className="message-text">{msg.content}</p>
            </div>
            <div className={`message-timestamp ${msg.role === 'user' ? 'user' : ''}`}>
              {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
