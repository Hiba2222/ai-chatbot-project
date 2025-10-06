import React from 'react';
import PropTypes from 'prop-types';
import { Bot, Calendar, Trash2 } from 'lucide-react';
import '../ChatHistory.css';
import './ChatList.css';

const ChatListItem = ({ chat, selected, onSelect, onDelete, formatDate }) => {
  return (
    <div
      onClick={() => onSelect(chat)}
      className={`chat-item ${selected ? 'selected' : ''}`}
    >
      <div className="chat-item-header">
        <div className="chat-item-info">
          <Bot size={20} className="chat-item-bot-icon" />
          <span className="chat-item-model">{chat.model.toUpperCase()}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(chat.id);
          }}
          className="chat-item-delete-btn"
        >
          <Trash2 size={18} className="chat-item-delete-icon" />
        </button>
      </div>

      <p className="chat-item-message">{chat.user_message}</p>

      <div className="chat-item-date">
        <Calendar size={14} className="chat-item-date-icon" />
        <span>{formatDate(chat.created_at)}</span>
      </div>
    </div>
  );
};

ChatListItem.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    model: PropTypes.string.isRequired,
    user_message: PropTypes.string,
    ai_response: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  selected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
};

export default ChatListItem;
