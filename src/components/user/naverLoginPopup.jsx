import React, { useEffect } from "react";
import { axiosClient } from '../../axiosApi/axiosClient';
import authStore from '../../stores/authStore';

const NaverLoginPopup = () => {
  useEffect(() => {
    const urlParams = new URL(window.location.href).hash.substring(1).split('&');
    const params = {};
    urlParams.forEach(param => {
      const [key, value] = param.split('=');
      params[key] = decodeURIComponent(value); // URL 인코딩된 값을 디코딩

    });

    const accessToken = params.access_token;
    console.log("Access Token:", accessToken);

    if (accessToken) {
      // 백엔드로 액세스 토큰을 전달하여 회원가입 또는 로그인 처리
      axiosClient.post('/naver', { token: accessToken })
        .then(response => {
          console.log('네이버 로그인 성공:', response.data);
          const token = response.headers['authorization'] || response.headers['Authorization'];
          const isLogin = response.data.isLogin; // 로그인 여부를 나타내는 필드를 추가했다고 가정

          if (token) {
            // 로컬 스토리지에 토큰 및 유저 정보를 저장
            const access = token.split(' ')[1];
            window.localStorage.setItem("token", access);
            window.localStorage.setItem("refresh", response.data.refresh);
            window.localStorage.setItem("isStudent", response.data.isStudent);
            window.localStorage.setItem("isTeacher", response.data.isTeacher);
            window.localStorage.setItem("isAdmin", response.data.isAdmin);
            window.localStorage.setItem("nickname", response.data.nickname);
            window.localStorage.setItem("userEmail", response.data.userEmail);
            window.localStorage.setItem("provider", response.data.provider);
            window.localStorage.setItem("profileImageUrl", response.data.profileImageUrl);
            window.localStorage.setItem("isSnsUser", response.data.isSnsUser);

            authStore.setIsLoggedIn(true);
            authStore.setIsStudent(response.data.isStudent);
            authStore.setIsTeacher(response.data.isTeacher);
            authStore.setIsAdmin(response.data.isAdmin);
            authStore.setNickname(response.data.nickname);
            authStore.setUserEmail(response.data.userEmail);
            authStore.setProvider(response.data.provider);
            authStore.setProfileImageUrl(response.data.profileImageUrl);

            // 로그인 성공 후 출석 체크
            axiosClient.post('/users/check-attendance', {
              email: response.data.userEmail,
              provider: response.data.provider
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

          

        })
        .catch(error => {
          console.error('네이버 로그인 실패! ', error);
        });
    }
  }, []);

  return (
    <div>
      {/* 로딩 스피너를 여기에 추가할 수 있습니다 */}
      {/* <img src="" alt="로딩" width="10%" /> */}
    </div>
  );
};

export default NaverLoginPopup;
