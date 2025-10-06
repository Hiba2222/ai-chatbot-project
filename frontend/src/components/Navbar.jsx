import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bot, LogOut, User, MessageSquare, Home, History } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import './Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';
  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear any persisted chat messages keys
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key === 'chat_messages' || key.startsWith('chat_messages_'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {}
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="navbar-content">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <Bot size={28} className="navbar-logo-icon" />
            <span className="navbar-logo-text">AI Chatbot</span>
          </Link>

          {/* Navigation Links */}
          <div className="navbar-links">
            {isLoggedIn ? (
              <>
                <Link
                  to="/chat"
                  className={`navbar-link ${isActive('/chat') ? 'active' : ''}`}
                >
                  <MessageSquare size={18} className="navbar-link-icon" />
                  <span className="navbar-link-text">{t('nav.chatbot')}</span>
                </Link>

                <Link
                  to="/history"
                  className={`navbar-link ${isActive('/history') ? 'active' : ''}`}
                >
                  <History size={18} className="navbar-link-icon" />
                  <span className="navbar-link-text">{t('chat.chat_history')}</span>
                </Link>

                <Link
                  to="/profile"
                  className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
                >
                  <User size={18} className="navbar-link-icon" />
                  <span className="navbar-link-text">{user.username || t('nav.profile')}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="navbar-logout-btn"
                >
                  <LogOut size={18} className="navbar-logout-icon" />
                  <span className="navbar-logout-text">{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                >
                  <Home size={18} className="navbar-link-icon" />
                  <span className="navbar-link-text">{t('nav.home')}</span>
                </Link>

                <Link
                  to="/login"
                  className="navbar-login-link"
                >
                  {t('nav.login')}
                </Link>

                <Link
                  to="/signup"
                  className="navbar-signup-link"
                >
                  {t('nav.signup')}
                </Link>
              </>
            )}

            <LanguageToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;