import React from 'react';
import { useTranslation } from 'react-i18next';
import './AboutContainer.css';

export const AboutContainer = () => {
    const { t } = useTranslation();
    return(
        <div className="about-container">
        <div className="about-inner">
          <h2 className="about-title">
            {t('landing.about_title')}
          </h2>
          <p className="about-text">
            {t('landing.about_text')}
          </p>
        </div>
      </div>
    );
}

export default AboutContainer;