import React from 'react';
import PropTypes from 'prop-types';
import { MessageSquare } from 'lucide-react';
import '../ChatHistory.css';
import './ChatDetail.css';

const ChatDetailPlaceholder = ({ isRTL }) => {
  return (
    <div className="chat-detail-placeholder">
      <MessageSquare size={48} className="chat-detail-placeholder-icon" />
      <p className="chat-detail-placeholder-text">
        {isRTL ? 'اختر محادثة لعرض التفاصيل' : 'Select a chat to view details'}
      </p>
    </div>
  );
};

ChatDetailPlaceholder.propTypes = {
  isRTL: PropTypes.bool,
};

export default ChatDetailPlaceholder;
