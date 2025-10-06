import React from 'react';
import HeroContainer from './hero-container/HeroContainer';
import FeaturesContainer from './features-container/FeaturesContainer';
import AboutContainer from './about-container/AboutContainer';
import CtaContainer from './cta-container/CtaContainer';
import { useTranslation } from 'react-i18next';
import './LandingPage.css';

const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="landing-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <HeroContainer />

      <FeaturesContainer />
    
      <AboutContainer />

      <CtaContainer />    
    </div>
  );
};

export default LandingPage;