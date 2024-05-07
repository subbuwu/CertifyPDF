import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from "../constants/googleAuth.js"

// USE YOUR OWN GOOGLE CLIENT ID HERE INSTEAD OF GOOGLE_CLIENT_ID

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={`${GOOGLE_CLIENT_ID}`}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
