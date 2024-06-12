import React from 'react';

const KakaoLogin = () => {
    const handleLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_API_KAKAO_CLIENT_ID; // 환경 변수에서 클라이언트 ID를 가져옵니다. // NEXT_PUBLIC_API_KAKAO_CLIENT_ID=0b5c49e67644103f6cb6e38aed909ef7
        const redirectUri = 'http://localhost:8080/auth/kakao/callback'; // 리다이렉트 URI //
        const encodedRedirectUri = encodeURIComponent(redirectUri); // 리다이렉트 URI를 인코딩합니다.

        window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}&through_account=true`;
    };

    return (
        <div className="button-container">
            <button onClick={handleLogin} style={{ border: 'none', background: 'none', padding: '0', cursor: 'pointer' }}>
                <img
                    src="/images/kakao_sync_login/complete/ko/kakao_login_medium_narrow.png"
                    alt="카카오 로그인"
                    style={{ display: 'block', width: '100%' }}
                />
            </button>
        </div>
    );
};

export default KakaoLogin;