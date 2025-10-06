import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { formatLocalizedDate } from '../../../utils/date';
import '../ChatHistory.css';
import './ChatList.css';
import ChatListItem from './ChatListItem';

const ChatList = ({ chats, selectedChatId, onSelect, onDelete }) => {
  const { i18n } = useTranslation();

  const formatDate = useMemo(() => (dateString) => (
    formatLocalizedDate(dateString, i18n.language)
  ), [i18n.language]);

  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          selected={selectedChatId === chat.id}
          onSelect={onSelect}
          onDelete={onDelete}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};

ChatList.propTypes = {
  chats: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    model: PropTypes.string.isRequired,
    user_message: PropTypes.string,
    ai_response: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  })).isRequired,
  selectedChatId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ChatList;
