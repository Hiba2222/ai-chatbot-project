import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import './InputContainer.css';

const InputContainer = ({ input, setInput, loading, t, onSubmit }) => {
  return (
    <div className="input-container">
      <form onSubmit={onSubmit} className="input-form">
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
  );
};

export default InputContainer;
