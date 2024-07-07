import React, { useRef, useEffect } from 'react';
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

  useEffect(() => {
    const handleMessage = (event) => {
      console.log('Message received:', event.data);
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'LOGIN_SUCCESS') {
        window.location.href = '/'; // 메인 페이지로 이동
      } else if (event.data.type === 'REGISTER_SUCCESS') {
        alert("회원가입이 성공적으로 완료되었습니다!");
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div>
      <button className={styles.GoogleLoginBtn} onClick={handleGoogleLogin}>
        <div className={styles.GoogleIcon} alt="googleicon" />
        <span className={styles.GoogleLoginTitle}></span>
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
