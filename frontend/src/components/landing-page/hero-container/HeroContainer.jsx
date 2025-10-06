import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import './HeroContainer.css';

export const HeroContainer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/chat');
  };

  return (
    <div className="hero-container">
      <div className="hero-content">
        <div className="badge-container">
          <Sparkles size={20} className="badge-icon" />
          <span className="badge-text">AI-Powered Chatbot Platform</span>
        </div>
        
        <h1 className="hero-title">
          {t('landing.hero_title')}
        </h1>
        
        <p className="hero-subtitle">
          {t('landing.hero_subtitle')}
        </p>
        
        <button
          onClick={handleGetStarted}
          className="hero-cta"
        >
          <span>{t('landing.hero_cta')}</span>
          <ArrowRight size={24} className="hero-cta-icon" />
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="decorative-container">
        <div className="decorative-circle decorative-circle-1"></div>
        <div className="decorative-circle decorative-circle-2"></div>
        <div className="decorative-circle decorative-circle-3"></div>
      </div>
    </div>
  );
};

export default HeroContainer;
