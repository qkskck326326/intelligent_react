import React from 'react';

const KakaoLogin = () => {
    const handleLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_API_KAKAO_CLIENT_ID; // 환경 변수에서 클라이언트 ID를 가져옵니다.
        const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI; // 환경 변수에서 리다이렉트 URI를 가져옵니다.
        const encodedRedirectUri = encodeURIComponent(redirectUri); // 리다이렉트 URI를 인코딩합니다.

        window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}&through_account=true`;
    };

    return (
        <div className="button-container">
            <button onClick={handleLogin} style={{ border: 'none', background: 'none', padding: '0', cursor: 'pointer' }}>
                <img
                    src="/images/kakao_sync_login/complete/ko/kakao_login_medium_narrow.png"
                    alt="카카오로 시작하기"
                    style={{ display: 'block', width: '100%' }}
                />
            </button>
        </div>
    );
};

export default KakaoLogin;
