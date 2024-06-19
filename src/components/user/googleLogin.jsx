import React from 'react';
import styles from "../../styles/user/login/googleLogin.module.css";

const GoogleLogin = () => {
  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const url = 'http://localhost:3000/user/googleLoginPopupPage';
    const options = `width=${width},height=${height},left=${left},top=${top}`;
    
    window.open(url, 'Google Login', options);
  };

  return (
    <button className={styles.GoogleLoginBtn} onClick={handleGoogleLogin}>
        
    </button>
  );
};

export default GoogleLogin;
