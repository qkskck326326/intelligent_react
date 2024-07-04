import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { handleAxiosError } from '../../axiosApi/errorAxiosHandler';
import { axiosClient } from '../../axiosApi/axiosClient';
import authStore from "../../stores/authStore";
import { observer } from "mobx-react";
import Link from 'next/link';
import KakaoLogin from "./kakaoLogin";
import NaverLogin from "./naverLogin";
import GoogleLogin from "./googleLogin";
import styles from "../../styles/user/login/loginForm.module.css";

const LoginForm = observer(() => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userEmail: '',
    userPwd: '',
    provider: 'intelliclass', // provider 값을 설정합니다.
  });

  useEffect(() => {
    const { signupSuccess } = router.query;
    if (signupSuccess) {
      alert("회원가입이 성공적으로 완료되었습니다!");
    }
  }, [router.query]);

  // input의 값이 변경되면 작동될 이벤트 핸들러로 준비
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post('/login', formData); // 로그인 엔드포인트로 요청
      console.log('로그인 성공:', response.data);
      const token = response.headers['authorization'] || response.headers['Authorization'];
      if (token) {
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

        // 로그인 성공 후 출석 체크
        await axiosClient.post('/users/check-attendance', {
          email: response.data.userEmail,
          provider: response.data.provider
        });

        // 메인 페이지로 즉시 이동
        window.location.href = 'http://localhost:3000';

        // 로그인 상태를 1초 후에 업데이트
        setTimeout(() => {
          authStore.setIsLoggedIn(true);
          authStore.setIsStudent(response.data.isStudent);
          authStore.setIsTeacher(response.data.isTeacher);
          authStore.setIsAdmin(response.data.isAdmin);
          authStore.setNickname(response.data.nickname);
          authStore.setUserEmail(response.data.userEmail);
          authStore.setProvider(response.data.provider);
          authStore.setProfileImageUrl(response.data.profileImageUrl);
        }, 1000); // 1초 지연
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      handleAxiosError(error);
    }
  };

  return (
    <div className={styles.center_div}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.form_group}>
          <h2>InTelliClass에 로그인 하세요</h2>
          <input
            type="text"
            id="userEmail"
            name="userEmail"
            placeholder="이메일 입력"
            value={formData.userEmail}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.form_group}>
          <input
            type="password"
            id="userPwd"
            name="userPwd"
            placeholder="비밀번호 입력"
            value={formData.userPwd}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.button_container}>
          <button type="submit">로그인</button>
        </div>
      </form>
      <div className={styles.signup_link}>
        <p className={styles.signup_link}>
          아직 회원이 아니신가요? <Link href="/user/enroll">회원가입</Link>
        </p>
        <p className={styles.signup_link}>
          비밀번호를 잊으셨나요? <Link href="/user/resetPasswordPage">비밀번호 찾기</Link>
        </p>
      </div>
      <div className={styles.buttons_face_and_social}>
        <div style={{ display: "flex", alignItems: "center", height: "50px" }}>
          <Link href="/user/faceLoginPage" passHref>
            <button
              style={{
                border: "none",
                background: "none",
                padding: "0",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#80DAEB",
                  color: "black",
                  padding: "10px 20px",
                  borderRadius: "7px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  textDecoration: "none",
                  border: "none",
                }}
              >
                <span style={{ marginRight: "5px" }}>😊</span>
                얼굴로 시작하기
              </div>
            </button>
          </Link>
        </div>
        <KakaoLogin />
        <NaverLogin />
        <GoogleLogin />
      </div>
    </div>
  );
});

export default LoginForm;
