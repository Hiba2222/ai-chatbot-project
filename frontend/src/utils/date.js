export const formatLocalizedDate = (dateString, language = 'en-US') => {
  const date = new Date(dateString);
  const locale = language === 'ar' ? 'ar-TN' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
