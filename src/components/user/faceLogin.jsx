import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../../styles/user/enroll/enrollFaceRegistration.module.css";
import { useRouter } from "next/router";
import { axiosClient } from "../../axiosApi/axiosClient";
import authStore from '../../stores/authStore';

const FaceLogin = () => {
  const videoRef = useRef(null);
  const [userEmail, setUserEmail] = useState('');
  const [status, setStatus] = useState('');
  const [similarity, setSimilarity] = useState(null); // 유사도 상태 추가
  const [identifiedUser, setIdentifiedUser] = useState(''); // 인식된 사용자 ID 추가
  const [webcamActive, setWebcamActive] = useState(false); // 웹캠 활성화 상태 추가
  const router = useRouter();

  useEffect(() => {
    // 페이지가 마운트될 때 body에 overflow: hidden; 적용
    document.body.style.overflow = 'hidden';
    
    // 페이지가 언마운트될 때 원래 상태로 복구
    return () => {
        document.body.style.overflow = '';
    };
  }, []);

  const toggleWebcam = () => {
    if (!webcamActive) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setWebcamActive(true); // 웹캠 활성화 상태 업데이트
      });
    } else {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });

      videoRef.current.srcObject = null;
      setWebcamActive(false); // 웹캠 비활성화 상태 업데이트
    }
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png').split(',')[1];
  };

  const handleLogin = async () => {
    const image = captureImage();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        userEmail: userEmail, 
        image: image,
      });

      setStatus(response.data.message);
      if (response.data.similarity !== undefined) {
        console.log("유사도 : ", response.data.similarity);
        setSimilarity(response.data.similarity); // 유사도 상태 업데이트
        setIdentifiedUser(response.data.userEmail); // 인식된 사용자 ID 업데이트

        try {
          const res = await axiosClient.post('/face', null, {
            params: {
              userEmail: response.data.userEmail,
              provider: 'intelliclass'
            }
          });

          const token = res.headers['authorization'] || res.headers['Authorization'];

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

            setStatus('JWT 토큰 발급 성공');
            router.push('/'); 
          }
        } catch (tokenError) {
          setStatus('JWT 토큰 발급 실패');
        }
      } else {
        setSimilarity(null); // 유사도가 없을 때 null로 설정
        setIdentifiedUser(''); // 인식된 사용자 ID 초기화
      }
    } catch (error) {
      setStatus('Login failed.');
      setSimilarity(null); // 로그인 실패 시 유사도 초기화
      setIdentifiedUser(''); // 로그인 실패 시 인식된 사용자 ID 초기화
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className={styles.enrollFaceBigContainer}>
      <div className={styles.container}>
        <label className={styles.label}>
          <span>CAMERA</span>
          <div
            onClick={toggleWebcam}
            className={`${styles.toggleButton} ${webcamActive ? styles.toggleButtonActive : ""}`}
          >
            <div
              className={`${styles.toggleKnob} ${webcamActive ? styles.toggleKnobActive : ""}`}
            ></div>
          </div>
        </label>
        <div className={`${styles.videoContainer} ${webcamActive ? styles.videoContainerActive : ""}`}>
          <video ref={videoRef} className={`${styles.video} ${webcamActive ? styles.videoActive : ""}`}></video>
        </div>
        
        <div className={styles.inputContainer}>
          <input
            type="email"
            name="userEmail"
            placeholder="이메일을 입력하세요"
            id="emailInput"
            className={styles.emailInput}
            value={userEmail}
            maxLength="30"
            onChange={(e) => setUserEmail(e.target.value)}
            onKeyPress={handleKeyPress} // 엔터 키 이벤트 추가
          />
          <button className={styles.sendButton} onClick={handleLogin}>
           ⮕
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaceLogin;
