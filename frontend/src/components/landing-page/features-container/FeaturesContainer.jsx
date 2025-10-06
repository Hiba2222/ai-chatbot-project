import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, Languages, History } from 'lucide-react';
import './FeaturesContainer.css';

export const FeaturesContainer = () => {
    const { t } = useTranslation();
    
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

    return (
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
    );
};

export default FeaturesContainer;