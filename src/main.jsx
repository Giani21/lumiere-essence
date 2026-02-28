import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
// 1. Importar el componente de Analytics
import { Analytics } from '@vercel/analytics/react' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <Analytics /> 
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)