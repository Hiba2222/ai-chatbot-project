// Login.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import axios from 'axios';
import './Login.css';

export const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isRTL = i18n.language === 'ar';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login/', formData);
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      i18n.changeLanguage(response.data.user.language);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.error || t('errors.server_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="login-card">
        <div className="login-header">
          <div className="icon-container">
            <LogIn className="icon" size={32} />
          </div>
          <h2 className="login-title">{t('auth.login_title')}</h2>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">
              {t('auth.username')}
            </label>
            <div className="relative">
              <Mail className="form-input-icon" size={20} />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              {t('auth.password')}
            </label>
            <div className="relative has-toggle">
              <Lock className="form-input-icon" size={20} />              
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="form-input"
                required
              />
              <button
                type="button"
                className="form-input-toggle"
                aria-label={showPassword ? t('auth.hide_password') : t('auth.show_password')}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`login-button ${loading ? 'loading' : ''}`}
          >
            {loading ? t('common.loading') : t('auth.login_button')}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-footer-text">
            {t('auth.have_account')}{' '}
            <Link to="/signup" className="login-footer-link">
              {t('auth.signup_button')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;