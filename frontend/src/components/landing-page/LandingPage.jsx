import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bot, Languages, History, Sparkles, ArrowRight } from 'lucide-react';
import './LandingPage.css';
import api from '../../api/axios';

const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const features = [
    {
      icon: <Bot size={40} />,
      title: t('landing.feature_1_title'),
      description: t('landing.feature_1_desc'),
      color: 'blue'
    },
    {
      icon: <Languages size={40} />,
      title: t('landing.feature_2_title'),
      description: t('landing.feature_2_desc'),
      color: 'green'
    },
    {
      icon: <History size={40} />,
      title: t('landing.feature_3_title'),
      description: t('landing.feature_3_desc'),
      color: 'purple'
    }
  ];

  const handleGetStarted = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await api.get('/api/test-auth/');
      navigate('/chat');
    } catch (e) {
      navigate('/login');
    }
  };

  return (
    <div className="landing-container" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
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

      {/* Features Section */}
      <div className="features-container">
        <div className="features-inner">
          <div className="features-header">
            <h2 className="features-title">
              {t('landing.features_title')}
            </h2>
            <div className="features-divider"></div>
          </div>

          <div className="features-grid">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="feature-card"
              >
                <div className={`feature-icon-container ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">
                  {feature.title}
                </h3>
                <p className="feature-description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
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

      {/* CTA Section */}
      <div className="cta-container">
        <div className="cta-inner">
          <h2 className="cta-title">
            {isRTL ? 'ابدأ رحلتك مع الذكاء الاصطناعي اليوم' : 'Start Your AI Journey Today'}
          </h2>
          <button
            onClick={handleGetStarted}
            className="cta-button"
          >
            <span>{t('landing.hero_cta')}</span>
            <ArrowRight size={24} className="cta-button-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;