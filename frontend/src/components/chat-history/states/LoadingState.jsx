import React from 'react';
import { useTranslation } from 'react-i18next';
import '../ChatHistory.css';
import './LoadingState.css';

const LoadingState = () => {
  const { t } = useTranslation();
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <p className="loading-text">{t('common.loading')}</p>
      </div>
    </div>
  );
};

export default LoadingState;
