import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import LoginForm from "../../components/user/loginForm";
import { axiosClient } from "../../axiosApi/axiosClient";

const Login = observer(() => {
    const router = useRouter();

    useEffect(() => {
        // 페이지가 마운트될 때 body에 overflow: hidden; 적용
        document.body.style.overflow = 'hidden';

        // 로그인한 유저가 로그인페이지 들어오려고하면 메인으로 보내버림
        if (authStore.checkIsLoggedIn()) {
            router.push("/");
        }

        // 페이지가 언마운트될 때 원래 상태로 복구
        return () => {
            document.body.style.overflow = '';
        };
    }, [router]);

    useEffect(() => {
        const showLoginAlert = localStorage.getItem('showLoginAlert');
        if (showLoginAlert) {
            alert('로그인해야 사용가능한 기능입니다.\n로그인을 해주세요.');
            localStorage.removeItem('showLoginAlert');
        }
    }, []);

    useEffect(() => {
        const { access, refresh, userEmail, provider, nickname, profileImageUrl, isStudent, isTeacher, isAdmin, isSnsUser } = router.query;

        if (access) {
            window.localStorage.setItem("token", access);
            window.localStorage.setItem("refresh", refresh);
            window.localStorage.setItem("userEmail", userEmail);
            window.localStorage.setItem("provider", provider);
            window.localStorage.setItem("nickname", nickname);
            window.localStorage.setItem("profileImageUrl", profileImageUrl);
            window.localStorage.setItem("isStudent", isStudent === 'true');
            window.localStorage.setItem("isTeacher", isTeacher === 'true');
            window.localStorage.setItem("isAdmin", isAdmin === 'true');
            window.localStorage.setItem("isSnsUser", isSnsUser === 'true');
            
            // 메인 페이지로 즉시 이동
            router.push("/");

            // 로그인 상태를 1초 후에 업데이트
            setTimeout(() => {
                authStore.setIsLoggedIn(true);
                authStore.setIsTeacher(isStudent === 'true');
                authStore.setIsTeacher(isTeacher === 'true');
                authStore.setIsAdmin(isAdmin === 'true');
                authStore.setUserEmail(userEmail);
                authStore.setProvider(provider);
                authStore.setNickname(nickname);
                authStore.setProfileImageUrl(profileImageUrl);
            }, 1000); // 1초 지연

            // 로그인 성공 후 출석 체크
            axiosClient.post('/users/check-attendance', {
                email: userEmail,
                provider: provider
            });
        }
    }, [router.query]);

    return (
        <div>
            <LoginForm />
        </div>
    );
});

export default Login;
