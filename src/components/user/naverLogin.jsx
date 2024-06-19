import { useEffect, useRef } from 'react';
import styles from "../../styles/user/login/naverLogin.module.css";

const NaverLogin = () => {
    const naverRef = useRef();

    const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
    const NAVER_CALLBACK_URL = process.env.NEXT_PUBLIC_NAVER_CALLBACK_URL;
    const STATE = "false";

    const loadNaverScript = () => {
        return new Promise((resolve) => {
            if (document.getElementById('naver-sdk')) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.id = 'naver-sdk';
            script.src = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    };

    const initializeNaverLogin = () => {
        if (typeof window !== "undefined" && window.naver) {
            const naverLogin = new window.naver.LoginWithNaverId({
                clientId: NAVER_CLIENT_ID,
                callbackUrl: NAVER_CALLBACK_URL,
                isPopup: true,
                loginButton: { color: 'green', type: 3, height: 58 },
                callbackHandle: true,
            });
            naverLogin.init();
        }
    };

    useEffect(() => {
        loadNaverScript().then(() => {
            initializeNaverLogin();
        });
    }, []);

    const handleNaverLogin = () => {
        naverRef.current.children[0].click();
    };

    return (
        <>
            <div className={styles.NaverIdLogin} id="naverIdLogin" ref={naverRef} style={{ display: 'none' }} />
            <button className={styles.NaverLoginBtn} onClick={handleNaverLogin}>
                <div className={styles.NaverIcon} alt="navericon" />
                <span className={styles.NaverLoginTitle}>네이버로 시작하기</span>
            </button>
        </>
    );
};

export default NaverLogin;
