// App.js
import React, { useState } from 'react';
import GoogleLoginButton from './components/GoogleLoginButton.jsx';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(null);
  const [fileId, setFileId] = useState(null);

  const handleLoginSuccess = (accessToken) => {
    setToken(accessToken);
  };

  const handleLoginFailure = (error) => {
    console.error('Google login failed:', error);
  };

  const handleUpload = async () => {
    try {
      const response = await axios.post('/upload', {
        name: 'John Doe',
        completionDate: '2024-05-07',
        courseName: 'React Development',
        token: token,
      });

      setFileId(response.data.fileId);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      {!token && <GoogleLoginButton onLoginSuccess={handleLoginSuccess} onLoginFailure={handleLoginFailure} />}
      {token && <button onClick={handleUpload}>Upload to Google Drive</button>}
      {fileId && <p>File uploaded successfully! File ID: {fileId}</p>}
    </div>
  );
}

export default App;
