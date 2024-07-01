import { useEffect, useRef } from 'react';
import styles from "../../styles/user/login/naverLogin.module.css";

const NaverLogin = () => {
    const naverRef = useRef();

    const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
    const NAVER_CALLBACK_URL = process.env.NEXT_PUBLIC_NAVER_CALLBACK_URL;

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

        // 메시지 수신 이벤트 핸들러
        const handleMessage = (event) => {
            console.log('Message received:', event.data);
            if (event.origin !== window.location.origin) return;

            if (event.data.type === 'LOGIN_SUCCESS') {
                //alert("로그인이 성공적으로 완료되었습니다!");
                window.location.href = '/'; // 메인 페이지로 이동
            } else if (event.data.type === 'REGISTER_SUCCESS') {
                alert("회원가입이 성공적으로 완료되었습니다!");
                window.location.href = '/user/login'; // 로그인 페이지로 이동
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
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
