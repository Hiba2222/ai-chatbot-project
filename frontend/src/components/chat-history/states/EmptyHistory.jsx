import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react';
import '../ChatHistory.css';
import './EmptyHistory.css';

const EmptyHistory = () => {
  const { t } = useTranslation();
  return (
    <div className="empty-history">
      <MessageSquare size={64} className="empty-history-icon" />
      <p className="empty-history-text">{t('history.no_history')}</p>
    </div>
  );
};

export default EmptyHistory;
