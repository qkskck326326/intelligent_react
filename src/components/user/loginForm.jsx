import React, { useState } from "react";
import { useRouter } from "next/router";
import { handleAxiosError } from '../../axiosApi/errorAxiosHandler';
import { axiosClient } from '../../axiosApi/axiosClient';
import authStore from "../../stores/authStore";
import { observer } from "mobx-react";
import Link from 'next/link';
import KakaoLogin from "./KakaoLogin";

const LoginForm = observer(() => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userEmail: '',
    userPwd: '',
    provider: 'intelliclass', // provider 값을 설정합니다.
  });

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
        const pureToken = token.split(' ')[1];
        window.localStorage.setItem("token", pureToken);
        window.localStorage.setItem("isAdmin", response.data.isAdmin);
        window.localStorage.setItem("nickname", response.data.nickname);
        window.localStorage.setItem("userEmail", response.data.userEmail);
        window.localStorage.setItem("provider", response.data.provider);

        authStore.setIsLoggedIn(true);
        authStore.setIsAdmin(response.data.isAdmin);
        authStore.setNickname(response.data.nickname);
        authStore.setUserEmail(response.data.userEmail);
        authStore.setProvider(response.data.provider);
      }
      window.location.href = 'http://localhost:3000'; // 로그인 성공 시 이동
    } catch (error) {
      console.error('로그인 실패:', error);
      handleAxiosError(error);
    }
  };

  return (
    <div className="center-div">
      <h1>임시 로그인 페이지</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userEmail">이메일</label>
          <input
            type="text"
            id="userEmail"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="userPwd">비밀번호</label>
          <input
            type="password"
            id="userPwd"
            name="userPwd"
            value={formData.userPwd}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="button-container">
          <button type="submit">로그인</button>
        </div>
      </form>
      <div className="signup-link">
        <p>아직 회원이 아니신가요? <Link href="/user/enroll">회원가입</Link></p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', height: '100px' }}>
        <Link href="/user/faceLoginPage" passHref>
          <button style={{ border: 'none', background: 'none', padding: '0', cursor: 'pointer' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              backgroundColor: '#80DAEB', 
              color: 'black', 
              padding: '10px 20px', 
              borderRadius: '7px', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              textDecoration: 'none',
              border: 'none'
            }}>
              <span style={{ marginRight: '5px' }}>😊</span>얼굴로 시작하기
            </div>
          </button>
        </Link>
      </div>
      <KakaoLogin/>
    </div>
  );
});

export default LoginForm;