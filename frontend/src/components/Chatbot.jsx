import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Loader, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
//import { Sidebar } from '@/Components/ui/sidebar';
import { ThemeToggle } from './ThemeToggle';
import api from '../api/axios';
import './Chatbot.css';


const ChatBot = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const hasLoadedMessagesRef = useRef(false);
  const isRTL = i18n.language === 'ar';
  
  const getMessagesStorageKey = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const ns = user?.username || user?.email || 'guest';
      return `chat_messages_${ns}`;
    } catch {
      return 'chat_messages_guest';
    }
  };

  const tryParseMessages = (raw) => {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch available models on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchModels = async () => {
      try {
        const response = await api.get('/api/models/');
        setAvailableModels(response.data.models);
        if (response.data.models.length > 0) {
          setSelectedModel(response.data.models[0].id);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        // Fallback to default models
        setAvailableModels([
          { id: 'grok-beta', name: 'Grok AI', provider: 'x-ai' },
          { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat', provider: 'deepseek' },
          { id: 'meta-llama/llama-3.1-8b-instruct', name: 'LLaMA 3.1 8B', provider: 'meta' }
        ]);
        setSelectedModel('grok-beta');
      } finally {
        setModelsLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const key = getMessagesStorageKey();
      const raw = localStorage.getItem(key);
      const local = raw ? tryParseMessages(raw) : null;
      if (local) setMessages(local);
    } catch (e) {
      console.error('Failed to load saved messages', e);
    } finally {
      hasLoadedMessagesRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) {
      alert(t('chat.error_empty'));
      return;
    }

    // Check token before sending message
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    const nextUserMessages = [...messages, userMessage];
    setMessages(nextUserMessages);
    try {
      const key = getMessagesStorageKey();
      localStorage.setItem(key, JSON.stringify(nextUserMessages));
    } catch {}
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/api/chat/', {
        message: input,
        model: selectedModel
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.response,
        model: selectedModel,
        timestamp: new Date()
      };

      setMessages(prev => {
        const next = [...prev, aiMessage];
        try {
          const key = getMessagesStorageKey();
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return next;
      });
    } catch (error) {
      console.error('Error:', error);
      
      if (error.response?.status === 401) {
        // Token expired or invalid - redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      const errorMessage = error.response?.data?.error || t('chat.error_network');
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="chatbot-header">
        <div className="chatbot-header-content">
          <div className="chatbot-header-left">
            <div className="chatbot-title-section">
              <MessageSquare className="chatbot-icon" size={28} />
              <h1 className="chatbot-title">
                {t('chat.title')}
              </h1>
            </div>
          </div>
          
          <div className="chatbot-header-right">
            <Select value={selectedModel} onValueChange={setSelectedModel} disabled={modelsLoading}>
              <SelectTrigger className="model-selector">
                <SelectValue placeholder={modelsLoading ? t('common.loading') : t('chat.select_model')} />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="model-selector-item">
                      <span>{model.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {model.provider}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <ScrollArea className="messages-container">
        <div className="messages-content">
          {messages.length === 0 ? (
            <div className="empty-state">
              <MessageSquare size={64} className="empty-state-icon" />
              <p className="empty-state-text">{t('chat.no_messages')}</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className="message-item"
              >
                <div className={`message-content ${msg.role === 'user' ? 'user' : ''}`}>
                  <a href={msg.role === 'user' ? '/profile' : ''}>
                    <Avatar className="message-avatar">
                      <AvatarImage src={msg.role === 'user' ? '/user-avatar.png' : '/ai-avatar.png'} />
                      <AvatarFallback className="message-avatar-fallback">
                        {msg.role === 'user' ? 'You' : 'AI'}
                      </AvatarFallback>
                    </Avatar> 
                  </a>
                  <div className={`message-details ${msg.role === 'user' ? 'user' : 'ai'}`}>
                    <div className="message-header">
                      <span className="message-author">
                        {msg.role === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                      {msg.model && (
                        <Badge variant="secondary" className="message-model-badge">
                          {msg.model}
                        </Badge>
                      )}
                    </div>
                    <div className={`message-bubble-container ${msg.role === 'user' ? 'user' : 'ai'}`}>
                      <div className={`message-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
                        <p className="message-text">{msg.content}</p>
                      </div>
                      <div className={`message-timestamp ${msg.role === 'user' ? 'user' : ''}`}>
                        {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="loading-message">
              <div className="loading-content">
                <Avatar className="loading-avatar">
                  <AvatarFallback className="loading-avatar-fallback">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="loading-details">
                  <div className="loading-header">
                    <span className="loading-author">AI Assistant</span>
                  </div>
                  <div className="loading-bubble-container">
                    <div className="loading-bubble">
                      <div className="loading-content-inner">
                        <Loader className="loading-spinner" size={16} />
                        <span className="loading-text">{t('chat.thinking')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="input-container">
        <form onSubmit={sendMessage} className="input-form">
          <div className="input-row">
            <div className="input-field-container">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat.placeholder')}
                disabled={loading}
                className="input-field"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="send-button"
            >
              <Send size={18} className="send-button-icon" />
              {t('chat.send_button')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;