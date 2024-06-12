import React, { useRef, useState } from 'react';
import axios from 'axios';

const FaceLogin = () => {
  const videoRef = useRef(null);
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('');
  const [similarity, setSimilarity] = useState(null); // 유사도 상태 추가
  const [identifiedUser, setIdentifiedUser] = useState(''); // 인식된 사용자 ID 추가

  const startWebcam = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    });
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
      user_id: userId,
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
      image: image,
    })
    .then(response => {
      setStatus(response.data.message);
      if (response.data.similarity !== undefined) {
        setSimilarity(response.data.similarity); // 유사도 상태 업데이트
        setIdentifiedUser(response.data.user_id); // 인식된 사용자 ID 업데이트
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
    <div>
      <h1>Face Recognition Login</h1>
      <input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <div>
        <button onClick={startWebcam}>Start Webcam</button>
        <video ref={videoRef} style={{ width: '400px', height: '300px', transform: 'scaleX(-1)' }}></video>
      </div>
      <div>
        <button onClick={handleRegister}>Register Face</button>
        <button onClick={handleLogin}>Login</button>
      </div>
      <div>
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