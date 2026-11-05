<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { TaxProvider } from './context/tax_context.tsx';
import './index.css';
=======
// Hosts the main application entry point for Stateful Taxes
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
>>>>>>> origin/main

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TaxProvider>
      <App />
    </TaxProvider>
  </React.StrictMode>,
);