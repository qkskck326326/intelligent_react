import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { axiosClient } from "../../axiosApi/axiosClient";
import AWS from 'aws-sdk';
import styles from '../../styles/user/enroll/enrollFaceRegistration.module.css';

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID_TAESEOK,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY_TAESEOK,
  region: process.env.NEXT_PUBLIC_AWS_REGION_TAESEOK,
});

const s3 = new AWS.S3();

const EnrollFaceRegistration = ({ prevPage, basicInfo }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('');
  const [similarity, setSimilarity] = useState(null);
  const [identifiedUser, setIdentifiedUser] = useState('');
  const [webcamActive, setWebcamActive] = useState(false);
  const router = useRouter();

  const toggleWebcam = () => {
    if (!webcamActive) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setWebcamActive(true);
      });
    } else {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });

      videoRef.current.srcObject = null;
      setWebcamActive(false);
    }
  };

  const uploadImageToS3 = async (file) => {
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_TAESEOK,
      Key: `ProfileImages/${Date.now()}_${file.name}`,
      Body: file,
      ContentType: file.type,
    };

    try {
      const { Location } = await s3.upload(params).promise();
      return Location;
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err;
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
    const file = basicInfo.profileImageUrl;
    const image = captureImage();
    
    uploadImageToS3(file)
      .then(profileImageUrl => {
        return axios.post('http://localhost:5000/register', {
          userEmail: basicInfo.userEmail,
          image: image,
        }).then(response => {
          setStatus(response.data.message);
          if (response.data.message === 'Registration successful') {
            handleUserRegistration(profileImageUrl);
          }
        }).catch(error => {
          setStatus('Registration failed.');
        });
      })
      .catch(err => {
        alert('프로필 이미지를 업로드하는 중 오류가 발생했습니다.');
      });
  };

  const handleUserRegistration = (profileImageUrl) => {
    const enrollForm = {
      ...basicInfo,
      profileImageUrl,
      faceLoginYn: 'y', // faceLoginYn을 'y'로 설정
      interests: basicInfo.interests.map(interest => interest.id), // 관심사 ID 배열로 변환
    };

    axiosClient.post('/users/insertuser', enrollForm)
      .then(response => {
        router.push("/user/login");
        alert('회원가입이 성공적으로 완료되었습니다!');
      })
      .catch(error => {
        alert('회원가입에 실패했습니다.');
      });
  };
  

  return (
    <div className={styles.enrollFaceBigContainer}>
      <div className={styles.container}>         
        <label className={styles.label}>
          <span>CAMERA</span>
          <div onClick={toggleWebcam} className={`${styles.toggleButton} ${webcamActive ? styles.toggleButtonActive : ''}`}>
            <div className={`${styles.toggleKnob} ${webcamActive ? styles.toggleKnobActive : ''}`}></div>
          </div>
        </label>
        <div className={`${styles.videoContainer} ${webcamActive ? styles.videoContainerActive : ''}`}>
          <video ref={videoRef} className={`${styles.video} ${webcamActive ? styles.videoActive : ''}`}></video>
        </div>
        <div className={styles.statusContainer}>
          <h2>Status: {status}</h2>
          {similarity !== null && !isNaN(similarity) && (
            <>
              <h2>Similarity: {similarity.toFixed(4)}</h2>
              <h2>Identified User: {identifiedUser}</h2>
            </>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.prevButton} onClick={prevPage}>이전</button>
          <button className={styles.navigationButton} onClick={handleRegister} style={{ margin: '0 10px' }}>얼굴 등록</button>
          {/* <button onClick={handleLogin}>로그인</button> */}
        </div>
      </div>
    </div>
  );
};


export default EnrollFaceRegistration;