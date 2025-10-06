import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { History } from 'lucide-react';
import '../ChatHistory.css';
import './ChatHistoryHeader.css';

const ChatHistoryHeader = ({ count }) => {
  const { t } = useTranslation();
  return (
    <div className="chat-history-header">
      <History size={32} className="chat-history-icon" />
      <h1 className="chat-history-title">{t('history.title')}</h1>
      <span className="chat-history-count">
        {count} {t('history.total')}
      </span>
    </div>
  );
};

ChatHistoryHeader.propTypes = {
  count: PropTypes.number.isRequired,
};

export default ChatHistoryHeader;
