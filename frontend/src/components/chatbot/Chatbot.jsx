import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ChatbotHeader from './header/ChatbotHeader';
import MessagesContainer from './messages/MessagesContainer';
import InputContainer from './input/InputContainer';
import api from '../../api/axios';
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
      <ChatbotHeader
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        modelsLoading={modelsLoading}
        availableModels={availableModels}
      />

      {/* Messages Area */}
      <MessagesContainer
        messages={messages}
        loading={loading}
        t={t}
        messagesEndRef={messagesEndRef}
      />

      {/* Input Area */}
      <InputContainer
        input={input}
        setInput={setInput}
        loading={loading}
        t={t}
        onSubmit={sendMessage}
      />
    </div>
  );
};

export default ChatBot;