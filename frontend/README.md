# Frontend (React + Vite)

This is the React frontend for the AI Chatbot project. It uses Vite, React Router, i18next, Tailwind CSS, and Axios.

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Dev server runs at http://localhost:5173

## Scripts

- dev: Start the Vite dev server
- build: Build for production
- preview: Preview the production build locally
- lint: Run ESLint

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Environment & API

The frontend expects the backend API at http://localhost:8000. Update API base URLs in `src/api/` if needed.

## Internationalization (i18n)

- Config: `src/i18n.js`
- Translation files: `src/locales/en.json`, `src/locales/ar.json`

Usage example:

```jsx
import { useTranslation } from 'react-i18next';

function Title() {
  const { t } = useTranslation();
  return <h1>{t('landing.hero_title')}</h1>;
}
```

## Styling

Tailwind CSS 4 is configured via PostCSS. Utility-first classes are used throughout components.

## Notes

- Ensure backend is running at http://localhost:8000 for API calls.
- Set your API keys in `backend/.env` as documented in the root `README.md`.
