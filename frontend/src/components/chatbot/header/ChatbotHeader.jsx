import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '../../theme/ThemeToggle';
import { MessageSquare } from 'lucide-react';
import './ChatbotHeader.css';

export const ChatbotHeader = ({ selectedModel, setSelectedModel, modelsLoading, availableModels }) => {
  const { t } = useTranslation();

  return (
    <header className="chatbot-header">
      <div className="chatbot-header-content">
        <div className="chatbot-title-section">
          <MessageSquare className="chatbot-icon" size={28} />
          <h1 className="chatbot-title">{t('chat.title')}</h1>
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
                    <Badge variant="secondary" className="text-xs">{model.provider}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default ChatbotHeader;
