// Hosts the main application entry point for Stateful Taxes
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { TaxProvider } from './context/tax_context.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TaxProvider>
      <App />
    </TaxProvider>
  </React.StrictMode>,
);