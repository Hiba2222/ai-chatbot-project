import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import { ArrowRight } from 'lucide-react';
import './CtaContainer.css';

export const CtaContainer = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const handleGetStarted = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        try {
          await api.get('/api/auth/test/');
          navigate('/chat');
        } catch {
          navigate('/login');
        }
      };

    return(
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
    );
}

export default CtaContainer;