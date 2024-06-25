import React, { useRef, useState } from 'react';
import axios from 'axios';

const FaceLogin = () => {
  const videoRef = useRef(null);
  const [userEmail, setUserEmail] = useState('');
  const [status, setStatus] = useState('');
  const [similarity, setSimilarity] = useState(null); // 유사도 상태 추가
  const [identifiedUser, setIdentifiedUser] = useState(''); // 인식된 사용자 ID 추가
  const [webcamActive, setWebcamActive] = useState(false); // 웹캠 활성화 상태 추가

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

  const handleRegister = () => {
    const image = captureImage();
    axios.post('http://localhost:5000/register', {
      userEmail: userEmail,
      image: image,
    })
    .then(response => {
      setStatus(response.data.message);
    })
    .catch(error => {
      setStatus('Registration failed.');
    });
  };

  const handleLogin = () => {
    const image = captureImage();
    axios.post('http://localhost:5000/login', {
      userEmail: userEmail, // 로그인 요청 시 ID 포함
      image: image,
    })
    .then(response => {
      setStatus(response.data.message);
      if (response.data.similarity !== undefined) {
        setSimilarity(response.data.similarity); // 유사도 상태 업데이트
        setIdentifiedUser(response.data.userEmail); // 인식된 사용자 ID 업데이트
      } else {
        setSimilarity(null); // 유사도가 없을 때 null로 설정
        setIdentifiedUser(''); // 인식된 사용자 ID 초기화
      }
    })
    .catch(error => {
      setStatus('Login failed.');
      setSimilarity(null); // 로그인 실패 시 유사도 초기화
      setIdentifiedUser(''); // 로그인 실패 시 인식된 사용자 ID 초기화
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>      
      <h1>Face Login</h1>
      <input
        type="text"
        placeholder="Enter User Email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        style={{ margin: '5px 0' }}
      />
      <label style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
        <span>CAMERA</span>
        <div onClick={toggleWebcam} style={{
          width: '40px',
          height: '20px',
          background: webcamActive ? 'green' : 'gray',
          borderRadius: '10px',
          marginLeft: '10px',
          position: 'relative',
          cursor: 'pointer'
        }}>
          <div style={{
            width: '18px',
            height: '18px',
            background: 'white',
            borderRadius: '50%',
            position: 'absolute',
            top: '1px',
            left: webcamActive ? '20px' : '2px',
            transition: 'left 0.2s'
          }}></div>
        </div>
      </label>
      <div style={{ width: '400px', height: '300px', backgroundColor: webcamActive ? 'transparent' : 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5px 0' }}>
        <video ref={videoRef} style={{ width: '100%', height: '100%', transform: 'scaleX(-1)', display: webcamActive ? 'block' : 'none' }}></video>
      </div>
      <div style={{ margin: '10px 0' }}>
        <button onClick={handleRegister} style={{ margin: '0 10px' }}>얼굴 등록</button>
        <button onClick={handleLogin}>로그인</button>
      </div>
      <div style={{ margin: '10px 0' }}>
        <h2>Status: {status}</h2>
        {similarity !== null && !isNaN(similarity) && (
          <>
            <h2>Similarity: {similarity.toFixed(4)}</h2>
            <h2>Identified User: {identifiedUser}</h2>
          </>
        )}
      </div>
    </div>
  );
};

export default FaceLogin;
