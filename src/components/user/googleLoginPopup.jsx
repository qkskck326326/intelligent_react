import { useEffect } from 'react';
import { axiosClient } from '../../axiosApi/axiosClient';
import authStore from '../../stores/authStore';

const GoogleLoginPopup = () => {
    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const GOOGLE_CALLBACK_URL = process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL;

    useEffect(() => {
        console.log('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);
        console.log('GOOGLE_CALLBACK_URL:', GOOGLE_CALLBACK_URL);

        const handleSuccess = async (code) => {
            try {
                const res = await axiosClient.post('/google', { code });

                console.log('구글 로그인 성공:', res.data);
                const token = res.headers['authorization'] || res.headers['Authorization'];
                const isLogin = res.data.isLogin;

                if (token) {
                    const access = token.split(' ')[1];
                    window.localStorage.setItem("token", access);
                    window.localStorage.setItem("refresh", res.data.refresh);
                    window.localStorage.setItem("isStudent", res.data.isStudent);
                    window.localStorage.setItem("isTeacher", res.data.isTeacher);
                    window.localStorage.setItem("isAdmin", res.data.isAdmin);
                    window.localStorage.setItem("nickname", res.data.nickname);
                    window.localStorage.setItem("userEmail", res.data.userEmail);
                    window.localStorage.setItem("provider", res.data.provider);
                    window.localStorage.setItem("profileImageUrl", res.data.profileImageUrl);

                    authStore.setIsLoggedIn(true);
                    authStore.setIsStudent(res.data.isStudent);
                    authStore.setIsTeacher(res.data.isTeacher);
                    authStore.setIsAdmin(res.data.isAdmin);
                    authStore.setNickname(res.data.nickname);
                    authStore.setUserEmail(res.data.userEmail);
                    authStore.setProvider(res.data.provider);
                    authStore.setProfileImageUrl(res.data.profileImageUrl);

                    // 로그인 성공 후 출석 체크
                    await axiosClient.post('/users/check-attendance', {
                        email: res.data.userEmail,
                        provider: res.data.provider
                    });
                }

                // 팝업 창 닫기
                window.close();

                // 부모 창에 메시지 전달
                if (window.opener) {
                    console.log('Sending message to opener');
                    if (isLogin) {
                        window.opener.postMessage({ type: 'LOGIN_SUCCESS' }, window.location.origin);
                    } else {
                        window.opener.postMessage({ type: 'REGISTER_SUCCESS' }, window.location.origin);
                    }
                }

                

            } catch (error) {
                console.error('구글 로그인 실패! ', error);
            }
        };

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const code = urlParams.get('code');

        if (code) {
            handleSuccess(code);
        } else {
            window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&response_type=code&scope=email profile`;
        }
    }, []);

    return null;
};

export default GoogleLoginPopup;
