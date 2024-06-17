import React, { useState, useEffect } from 'react';
import authStore from '../../stores/authStore';
import { observer } from "mobx-react-lite";

const ResetPassword = observer(() => {
    const [nickname, setNickname] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [provider, setProvider] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileImage = () => {
            try {
                const email = authStore.getUserEmail();
                const provider = authStore.getProvider();
                const nickname = authStore.getNickname();
                const profileImageUrl = authStore.getProfileImageUrl();

                console.log("Fetching profile image for email:", email, "and provider:", provider);

                if (!email || !provider) {
                    throw new Error("Email or provider is missing from authStore");
                }

                // 상태 변수 설정
                setUserEmail(email);
                setProvider(provider);
                setNickname(nickname);
                setProfileImageUrl(profileImageUrl);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (typeof window !== 'undefined') {
            // 클라이언트 측에서만 로컬 스토리지 값을 읽어옴
            const email = localStorage.getItem("userEmail");
            const provider = localStorage.getItem("provider");
            const nickname = localStorage.getItem("nickname");
            const profileImageUrl = localStorage.getItem("profileImageUrl");
            authStore.setUserEmail(email);
            authStore.setProvider(provider);
            authStore.setNickname(nickname);
            authStore.setProfileImageUrl(profileImageUrl);

            fetchProfileImage();
        }
    }, []);

    return (
        <div>
            <h1>User Profile Page</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error loading profile image: {error.message}</p>}
            {profileImageUrl && (
                <div>
                    <div>{nickname}</div>
                    <div>{userEmail}</div>
                    <div>{provider}</div>
                    <div>{profileImageUrl}</div>
                    <img src={profileImageUrl} alt="User's profile" />
                </div>
            )}
        </div>
    );
});

export default ResetPassword;
