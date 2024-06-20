import React, { useRef } from 'react';
import styles from "../../styles/user/login/googleLogin.module.css";
import { GoogleOAuthProvider, GoogleLogin as GoogleOAuthLogin } from '@react-oauth/google';

const GoogleLogin = () => {
  const hiddenButtonRef = useRef(null);

  const handleGoogleLogin = () => {
    if (hiddenButtonRef.current) {
      hiddenButtonRef.current.click();
    }
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const url = 'http://localhost:3000/user/googleLoginPopupPage';
    const options = `width=${width},height=${height},left=${left},top=${top}`;
    
    window.open(url, 'Google Login', options);
  };

  return (
    <div>
      <button className={styles.GoogleLoginBtn} onClick={handleGoogleLogin}>
      </button>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <div style={{ display: 'none' }}>
          <GoogleOAuthLogin
            onSuccess={() => {}}
            onError={() => {}}
            buttonText="구글로 로그인"
            ref={hiddenButtonRef}
          />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleLogin;
