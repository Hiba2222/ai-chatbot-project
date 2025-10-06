import { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language') || 'en';
    if (savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
    
    // Apply RTL/LTR direction
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLanguage;
  }, [i18n]);

  const changeLanguage = async (newLang) => {
    if (newLang === i18n.language) return;
    
    // Update i18n
    await i18n.changeLanguage(newLang);
    
    // Update DOM
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    
    // Save to localStorage
    localStorage.setItem('language', newLang);

    // Save to backend if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch('http://localhost:8000/api/user/language/', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ language: newLang })
        });
      } catch (err) {
        console.error('Failed to save language preference:', err);
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ language: i18n.language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};