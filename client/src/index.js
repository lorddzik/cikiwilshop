import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { CartProvider } from './context/CartContext'; // <-- 1. IMPOR BARU

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider> {/* <-- 2. BUNGKUS APP */}
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);