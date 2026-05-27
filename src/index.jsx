import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './main.scss';
import { unregister as unregisterServiceWorker } from './registerServiceWorker';
import { TranslationProvider } from './hooks/useTranslation';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <TranslationProvider>
    <App />
  </TranslationProvider>
);

unregisterServiceWorker();


