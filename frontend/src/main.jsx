import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

// USE YOUR OWN GOOGLE CLIENT ID HERE INSTEAD OF GOOGLE_CLIENT_ID

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={`${process.env.GOOGLE_CLIENT_ID}`}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
