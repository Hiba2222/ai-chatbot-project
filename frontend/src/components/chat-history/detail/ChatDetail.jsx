import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Calendar, Trash2 } from 'lucide-react';
import { formatLocalizedDate } from '../../../utils/date';
import '../ChatHistory.css';
import './ChatDetail.css';

const ChatDetail = ({ chat, onDelete, isRTL }) => {
  const { t, i18n } = useTranslation();

  if (!chat) return null;

  return (
    <div className="chat-detail-card">
      <div className="chat-detail-header">
        <div className="chat-detail-model-row">
          <span className="chat-detail-model-label">{t('history.model_label')}</span>
          <span className="chat-detail-model-badge">{chat.model.toUpperCase()}</span>
        </div>
        <div className="chat-detail-date">
          <Calendar size={14} className="chat-detail-date-icon" />
          <span>{formatLocalizedDate(chat.created_at, i18n.language)}</span>
        </div>
      </div>

      <div className="chat-detail-content">
        <div className="chat-detail-section">
          <div className="chat-detail-section-label">{isRTL ? 'رسالتك' : 'Your Message'}</div>
          <div className="chat-detail-message user">
            <p className="chat-detail-message-text">{chat.user_message}</p>
          </div>
        </div>

        <div className="chat-detail-section">
          <div className="chat-detail-section-label">{isRTL ? 'رد الذكاء الاصطناعي' : 'AI Response'}</div>
          <div className="chat-detail-message ai">
            <p className="chat-detail-message-text">{chat.ai_response}</p>
          </div>
        </div>
      </div>

      <button onClick={() => onDelete(chat.id)} className="chat-detail-delete-btn">
        <Trash2 size={20} className="chat-detail-delete-icon" />
        <span>{t('history.delete_button')}</span>
      </button>
    </div>
  );
};

ChatDetail.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    model: PropTypes.string.isRequired,
    user_message: PropTypes.string,
    ai_response: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }),
  onDelete: PropTypes.func.isRequired,
  isRTL: PropTypes.bool,
};

export default ChatDetail;
