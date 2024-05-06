// GoogleLoginButton.js
import React from 'react';
import { GoogleLogin } from 'react-google-login';

const GoogleLoginButton = ({ onLoginSuccess, onLoginFailure }) => {
  const clientId = '170723303875-r24dvnnk53gjsnbev6hrivv7pg2eko06.apps.googleusercontent.com '; 

  const onSuccess = (response) => {
    console.log('Login Success. Access Token:', response.accessToken);
    onLoginSuccess(response.accessToken);
  };

  const onFailure = (error) => {
    console.error('Login Failure:', error);
    onLoginFailure(error);
  };

  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Sign in with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default GoogleLoginButton;
