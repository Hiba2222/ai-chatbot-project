import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Calendar, MessageSquare, Globe, Sparkles, Download, FileText, FileDown, RefreshCcw } from 'lucide-react';
//import axios from 'axios';
import api from '../api/axios';
import './UserProfile.css';


export const UserProfile = () => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/user/profile/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const regenerateSummary = async () => {
    try {
      setRegenerating(true);
      const token = localStorage.getItem('token');
      await api.post('/api/user/profile/generate-summary/', {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchProfile();
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setRegenerating(false);
    }
  };

  const exportHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/chat/export/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Create downloadable JSON file
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chat_history_${new Date().toISOString()}.json`;
      link.click();
    } catch (error) {
      console.error('Error exporting history:', error);
    }
  };

  const exportHistoryTxt = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/chat/export/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const { chats = [], user = 'user', export_date } = response.data || {};
      const lines = [];
      lines.push(`# Chat export for ${user} on ${export_date}`);
      lines.push('');
      chats.forEach((c, idx) => {
        lines.push(`--- Message ${idx + 1} ---`);
        lines.push(`Date: ${c.date}`);
        lines.push(`Model: ${c.model}`);
        lines.push('You:');
        lines.push(c.user_message || '');
        lines.push('AI:');
        lines.push(c.ai_response || '');
        lines.push('');
      });
      const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chat_history_${new Date().toISOString()}.txt`;
      link.click();
    } catch (error) {
      console.error('Error exporting TXT history:', error);
    }
  };

  const exportHistoryPdf = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/chat/export/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const { chats = [], user = 'user', export_date } = response.data || {};

      // Ensure html2canvas & jsPDF (for direct download)
      const ensureScript = (src, check) => new Promise((resolve, reject) => {
        if (check()) return resolve();
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => (check() ? resolve() : reject(new Error('Script loaded but check failed')));
        s.onerror = () => reject(new Error('Failed to load script'));
        document.body.appendChild(s);
      });

      await ensureScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', () => window.html2canvas);
      await ensureScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', () => window.jspdf?.jsPDF);

      const { jsPDF } = window.jspdf;

      // Build styled HTML (emojis supported by browser rendering)
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '800px';
      container.style.padding = '24px';
      container.style.fontFamily = "'Segoe UI', 'Noto Color Emoji', system-ui, -apple-system, sans-serif";
      container.style.color = '#111827';
      container.style.background = '#ffffff';

      const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');

      const header = document.createElement('div');
      header.innerHTML = `
        <h1 style="margin:0 0 8px 0;font-size:20px;">Chat Export</h1>
        <div style="margin:0 0 16px 0;font-size:12px;line-height:1.4;">
          <div><strong>User:</strong> ${esc(user)}</div>
          <div><strong>Exported:</strong> ${esc(export_date)}</div>
        </div>
      `;
      container.appendChild(header);

      chats.forEach((c, idx) => {
        const section = document.createElement('div');
        section.style.marginBottom = '16px';
        section.innerHTML = `
          <div style="font-weight:600;margin:0 0 6px 0;">Conversation ${idx + 1}</div>
          <div style="font-size:12px;color:#374151;margin:0 0 12px 0;">Date: ${esc(c.date)} • Model: ${esc(c.model)}</div>
          <div style="border-radius:8px;background:#e8f4ff;padding:12px 14px;margin:0 0 10px 0;">
            <div style="font-weight:600;margin:0 0 6px 0;">You</div>
            <div style="white-space:pre-wrap;word-break:break-word;">${esc(c.user_message)}</div>
          </div>
          <div style="border-radius:8px;background:#f5f5f5;padding:12px 14px;">
            <div style="font-weight:600;margin:0 0 6px 0;">AI</div>
            <div style="white-space:pre-wrap;word-break:break-word;">${esc(c.ai_response)}</div>
          </div>
        `;
        container.appendChild(section);
      });

      document.body.appendChild(container);

      // Render to canvas and create paginated PDF
      const canvas = await window.html2canvas(container, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = canvas.height * (imgWidth / canvas.width);

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(`chat_history_${new Date().toISOString()}.pdf`);

      document.body.removeChild(container);
    } catch (error) {
      console.error('Error exporting PDF history:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="profile-content">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar-container">
              <User size={40} className="profile-avatar-icon" />
            </div>
            <div className="profile-info">
              <h1 className="profile-username">
                {profile?.user?.username}
              </h1>
              <p className="profile-email">{profile?.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <MessageSquare className="stat-icon blue" size={24} />
              <h3 className="stat-label">
                {t('profile.total_chats')}
              </h3>
            </div>
            <p className="stat-value">
              {profile?.total_chats || 0}
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <Calendar className="stat-icon green" size={24} />
              <h3 className="stat-label">
                {t('profile.joined_date')}
              </h3>
            </div>
            <p className="stat-value-small">
              {new Date(profile?.user?.date_joined).toLocaleDateString()}
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <Globe className="stat-icon purple" size={24} />
              <h3 className="stat-label">
                {t('profile.language_pref')}
              </h3>
            </div>
            <p className="stat-value-small">
              {profile?.language_preference === 'ar' ? 'العربية' : 'English'}
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <Calendar className="stat-icon" size={24} />
              <h3 className="stat-label">
                {t('common.last_updated')}
              </h3>
            </div>
            <p className="stat-value-small">
              {profile?.summary_updated_at ? new Date(profile.summary_updated_at).toLocaleString() : '-'}
            </p>
          </div>
        </div>

        {/* AI-Generated Summary */}
        <div className="ai-summary-container">
          <div className="ai-summary-header">
            <Sparkles className="ai-summary-icon" size={28} />
            <h2 className="ai-summary-title">
              {t('profile.ai_summary_title')}
            </h2>
            <button className="export-button" onClick={regenerateSummary} disabled={regenerating} style={{ marginLeft: 'auto', opacity: regenerating ? 0.7 : 1, cursor: regenerating ? 'not-allowed' : 'pointer' }}>
              <RefreshCcw size={18} className="export-button-icon" />
              <span>{regenerating ? (t('common.loading') || 'Loading...') : (t('common.refresh') || 'Regenerate')}</span>
            </button>
          </div>
          
          {profile?.ai_summary ? (
            <div className="ai-summary-content">
              <p className="ai-summary-text">
                {profile.ai_summary}
              </p>
              <p className="ai-summary-updated">
                {t('common.last_updated')}: {new Date(profile.summary_updated_at).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="ai-summary-empty">
              <Sparkles size={48} className="ai-summary-empty-icon" />
              <p className="ai-summary-empty-text">{t('profile.no_summary')}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="actions-container">
          <div className="export-menu">
            <button className="export-button">
              <Download size={20} className="export-button-icon" />
              <span>{t('profile.export_history')}</span>
            </button>
            <div className="export-menu-content">
              <button className="export-menu-item" onClick={exportHistoryTxt}>
                <FileText size={18} className="export-button-icon" />
                <span>{t('profile.export_history_txt')}</span>
              </button>
              <button className="export-menu-item" onClick={exportHistoryPdf}>
                <FileDown size={18} className="export-button-icon" />
                <span>{t('profile.export_history_pdf')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;