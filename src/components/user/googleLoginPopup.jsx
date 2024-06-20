import React, { useEffect } from 'react';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { axiosClient } from '../../axiosApi/axiosClient';
// import authStore from '../../stores/authStore';

const GoogleLoginPopup = () => {
//   const handleSuccess = async (response) => {
//     const { credential } = response;
//     try {
//       const res = await axiosClient.post('/google', { token: credential });

//       console.log('구글 로그인 성공:', res.data);
//       const token = res.headers['authorization'] || res.headers['Authorization'];
//       const isLogin = res.data.isLogin;

//       if (token) {
//         const access = token.split(' ')[1];
//         window.localStorage.setItem("token", access);
//         window.localStorage.setItem("refresh", res.data.refresh);
//         window.localStorage.setItem("isStudent", res.data.isStudent);
//         window.localStorage.setItem("isTeacher", res.data.isTeacher);
//         window.localStorage.setItem("isAdmin", res.data.isAdmin);
//         window.localStorage.setItem("nickname", res.data.nickname);
//         window.localStorage.setItem("userEmail", res.data.userEmail);
//         window.localStorage.setItem("provider", res.data.provider);
//         window.localStorage.setItem("profileImageUrl", res.data.profileImageUrl);

//         authStore.setIsLoggedIn(true);
//         authStore.setIsStudent(res.data.isStudent);
//         authStore.setIsTeacher(res.data.isTeacher);
//         authStore.setIsAdmin(res.data.isAdmin);
//         authStore.setNickname(res.data.nickname);
//         authStore.setUserEmail(res.data.userEmail);
//         authStore.setProvider(res.data.provider);
//         authStore.setProfileImageUrl(res.data.profileImageUrl);
//       }

//       if (isLogin) {
//         window.opener.location.href = '/'; // 부모 창을 메인 페이지로 이동
//       } else {
//         window.opener.location.href = '/user/login'; // 부모 창을 로그인 페이지로 유지
//       }
//       window.close(); // 팝업 창 닫기
//     } catch (error) {
//       console.error('구글 로그인 실패:', error);
//     }
//   };

//   const handleFailure = (response) => {
//     console.error('구글 로그인 실패:', response);
//   };

  return (
    // <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
    //   <div>
    //     <GoogleLogin
    //       onSuccess={handleSuccess}
    //       onFailure={handleFailure}
    //       buttonText="구글로 로그인"
    //     />
    //   </div>
    // </GoogleOAuthProvider>
    <div>ㅎㅇ?</div>
  );
};

export default GoogleLoginPopup;
