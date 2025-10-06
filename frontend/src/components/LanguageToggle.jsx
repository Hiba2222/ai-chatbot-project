import React from 'react';
import { useLanguage } from './LanguageProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LanguageToggle = () => {
  const { language, changeLanguage } = useLanguage();

  const languageLabels = {
    en: 'English',
    ar: 'العربية'
  };

  return (
    <Select value={language} onValueChange={changeLanguage}>
      <SelectTrigger className="w-[130px] bg-white border-gray-300 hover:bg-gray-50 text-sm font-medium">
        <SelectValue>{languageLabels[language]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ar">العربية</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageToggle;