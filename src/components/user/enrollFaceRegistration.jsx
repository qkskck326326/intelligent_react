import React, { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "../../styles/user/enroll/enrollFaceRegistration.module.css";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID_TAESEOK,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY_TAESEOK,
  region: process.env.NEXT_PUBLIC_AWS_REGION_TAESEOK,
});

const s3 = new AWS.S3();

const EnrollFaceRegistration = ({ prevPage, basicInfo, educationExperience, careerExperience }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("");
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
      console.error("Error uploading file:", err);
      throw err;
    }
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png").split(",")[1];
  };

  const handleRegister = async () => {
    const defaultWidth = 128;
    const defaultHeight = 128;
    let file;

    if (basicInfo.profileImageUrl) {
      file = basicInfo.profileImageUrl;
    } else {
      const defaultImageBlob = await fetchDefaultImage();
      file = new File([defaultImageBlob], "defaultProfile.png", { type: "image/png" });
    }

    try {
      const resizedImage = await resizeImage(file, defaultWidth, defaultHeight);
      const profileImageUrl = await uploadImageToS3(resizedImage);
      
      const response = await axios.post("http://localhost:5000/register", {
        userEmail: basicInfo.userEmail,
        image: captureImage(),
      });

      setStatus(response.data.message);
      if (response.data.message === "Registration successful") {
        handleUserRegistration(profileImageUrl);
      }
    } catch (err) {
      console.error("Error during registration process:", err);
      alert("회원가입 과정 중 오류가 발생했습니다.");
    }
  };

  const resizeImage = (file, width, height) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: file.type }));
          }, file.type);
        };
        img.onerror = (error) => {
          console.error("Error loading image:", error);
          reject(new Error("Failed to load the image."));
        };
        img.src = event.target.result;
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        reject(new Error("Failed to read the file."));
      };
      reader.readAsDataURL(file);
    });
  };

  const fetchDefaultImage = async () => {
    try {
      const response = await fetch("/images/defaultProfile.png");
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error("Error fetching default image:", error);
      throw new Error("Failed to fetch the default image.");
    }
  };

  const handleUserRegistration = (profileImageUrl) => {
    const enrollForm = {
      ...basicInfo,
      provider: "intelliclass",
      registerTime: "",
      profileImageUrl,
      reportCount: 0,
      loginOk: "Y",
      faceLoginYn: "Y",
      snsAccessToken: "",
      interests: basicInfo.interests.map((interest) => interest.id),
      educations: educationExperience,
      careers: careerExperience,
    };

    axiosClient
      .post("/users/insertuser", enrollForm)
      .then((response) => {
        router.push("/user/login");
        alert("회원가입이 성공적으로 완료되었습니다!");
      })
      .catch((error) => {
        alert("회원가입에 실패했습니다.");
      });
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
        <div className={styles.buttonContainer}>
          <button className={styles.prevButton} onClick={prevPage}>
            이전
          </button>
          <button className={styles.navigationButton} onClick={handleRegister} style={{ margin: "0 10px" }}>
            얼굴 등록 & 계정 생성
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollFaceRegistration;
