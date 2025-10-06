import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import axios from 'axios';
import './SignUp.css';

// SignUp.jsx
export const SignUp = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      language: 'en'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const isRTL = i18n.language === 'ar';
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
  
      if (formData.password !== formData.confirmPassword) {
        setError(t('errors.password_mismatch'));
        return;
      }
  
      setLoading(true);
  
      try {
        const response = await api.post('/api/auth/signup/', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          language: formData.language
        });

        console.log('Response:', response.data); 

        localStorage.setItem('token', response.data.access);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        i18n.changeLanguage(response.data.user.language);
        navigate('/chat');
      } catch (err) {
        console.error('Full error:', err);
        console.error('Error response:', err.response);
        if (err.response?.status === 409 || err.response?.data?.code === 'email_exists') {
          setError(t('errors.email_in_use') || 'Email is already in use.');
        } else {
          setError(err.response?.data?.error || t('errors.server_error'));
        }
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="signup-container" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="signup-card">
          <div className="signup-header">
            <h2 className="signup-title">{t('auth.signup_title')}</h2>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label className="form-label">
                {t('auth.username')}
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {t('auth.password')}
              </label>
              <div className="relative has-toggle">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="form-input"
                  required
                  minLength={8}
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

            <div className="form-group">
              <label className="form-label">
                {t('auth.confirm_password')}
              </label>
              <div className="relative has-toggle">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="form-input-toggle"
                  aria-label={showConfirmPassword ? t('auth.hide_password') : t('auth.show_password')}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                {t('auth.language_preference')}
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
                className="form-input"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            <button
            type="submit"
            disabled={loading}
            className={`signup-button ${loading ? 'loading' : ''}`}
          >
            {loading ? t('common.loading') : t('auth.signup_button')}
          </button>
        </form>

        <div className="signup-footer">
          <p className="signup-footer-text">
            {t('auth.have_account')}{' '}
            <Link to="/login" className="signup-footer-link">
              {t('auth.login_button')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;