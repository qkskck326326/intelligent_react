import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import { axiosClient } from '../../axiosApi/axiosClient';
import styles from '../../styles/user/enroll/basicInfo.module.css';
import AWS from "aws-sdk";

AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID_TAESEOK,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY_TAESEOK,
    region: process.env.NEXT_PUBLIC_AWS_REGION_TAESEOK,
});

const s3 = new AWS.S3();

const MyInfo = observer(() => {
    const router = useRouter();
    const [userData, setUserData] = useState({
        userName: '',
        userEmail: '',
        userPwd: '',
        confirmUserPwd: '',
        phone: '',
        nickname: '',
        profileImageUrl: ''
    });

    const [isNicknameValid, setIsNicknameValid] = useState(true);
    const [previewImageUrl, setPreviewImageUrl] = useState("/path/to/default-profile-image.png");

    useEffect(() => {
        if (!authStore.checkIsLoggedIn()) {
            router.push("/user/login"); // 로그인 페이지로 리디렉션
        } else {
            fetchUserData();
        }
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axiosClient.get(`/users`, {
                params: {
                    userEmail: localStorage.getItem("userEmail"),
                    provider: localStorage.getItem("provider")
                }
            });

            const data = response.data;
            setUserData({
                userName: data.userName,
                userEmail: data.userEmail,
                phone: data.phone,
                nickname: data.nickname,
                profileImageUrl: data.profileImageUrl || "/path/to/default-profile-image.png"
            });
            setPreviewImageUrl(data.profileImageUrl || "/path/to/default-profile-image.png");
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'nickname') {
            setIsNicknameValid(value.length >= 2);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setUserData(prevState => ({
                ...prevState,
                profileImageUrl: file
            }));
            setPreviewImageUrl(URL.createObjectURL(file));
        } else {
            alert('이미지 파일만 업로드할 수 있습니다.');
        }
    };

    const handleCheckNickname = async () => {
        if (userData.nickname.length < 2) {
            alert('닉네임은 최소 2자 이상이어야 합니다.');
            return;
        }
        try {
            const response = await axiosClient.get('/users/check-nickname', {
                params: { nickname: userData.nickname }
            });
            if (response.status === 200) {
                alert('사용 가능한 닉네임입니다.');
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert('닉네임 중복입니다.');
            } else {
                alert('닉네임 중복 확인 중 오류가 발생했습니다.');
            }
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

    const handleUpdateProfile = async () => {
        let profileImageUrl = userData.profileImageUrl;
        if (userData.profileImageUrl instanceof File) {
            profileImageUrl = await uploadImageToS3(userData.profileImageUrl);
        }

        const updateData = {
            nickname: userData.nickname,
            phone: userData.phone,
            profileImageUrl: profileImageUrl
        };

        // 비밀번호가 입력된 경우에만 포함시키기
        if (userData.userPwd && userData.confirmUserPwd) {
            if (userData.userPwd !== userData.confirmUserPwd) {
                alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
                return;
            }
            updateData.userPwd = userData.userPwd;
        }

        try {
            await axiosClient.put(`/users/update-profile`, {
                userEmail: localStorage.getItem("userEmail"),
                provider: localStorage.getItem("provider"),
                ...updateData
            });

            alert('프로필이 성공적으로 업데이트되었습니다.');
            router.push("/user/login");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("프로필 업데이트 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className={styles.container}>
          <div className={styles.form}>
            <div className={styles.formBody}>
              <div className={styles.imageSection}>
                <div className={styles.imageUpload}>
                  <div className={styles.profileImageContainer}>
                    <img src={previewImageUrl} alt="프로필 이미지" className={styles.profileImage} />
                    <label htmlFor="fileUpload" className={styles.fileUploadLabel}></label>
                  </div>
                  <input type="file" id="fileUpload" name="profileImageUrl" onChange={handleImageChange} className={styles.fileInput} accept="image/*"/>
                </div>
              </div>
              <div className={styles.inputSection}>
                <input
                  type="text"
                  name="userName"
                  placeholder="이름"
                  value={userData.userName}
                  onChange={handleChange}
                  className={styles.input}
                  maxLength="20"
                  readOnly
                />
                <input
                  type="text"
                  name="userEmail"
                  placeholder="이메일"
                  value={userData.userEmail}
                  className={styles.input}
                  maxLength="30"
                  readOnly
                />
                <input
                  type="password"
                  name="userPwd"
                  placeholder="새 비밀번호"
                  value={userData.userPwd}
                  onChange={handleChange}
                  className={styles.input}
                  maxLength="20"
                />
                <input
                  type="password"
                  name="confirmUserPwd"
                  placeholder="비밀번호 확인"
                  value={userData.confirmUserPwd}
                  onChange={handleChange}
                  className={styles.input}
                  maxLength="20"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="연락처"
                  value={userData.phone}
                  onChange={handleChange}
                  className={styles.input}
                  maxLength="13"
                />
                <div className={styles.nicknameSection}>
                  <input
                    type="text"
                    name="nickname"
                    placeholder="닉네임"
                    value={userData.nickname}
                    onChange={handleChange}
                    className={styles.input}
                    maxLength="15"
                  />
                  <button
                    type="button"
                    className={`${styles.checkButton} ${isNicknameValid ? styles.enabled : styles.disabled}`}
                    onClick={handleCheckNickname}
                    disabled={!isNicknameValid}
                  >
                    중복 체크
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.buttons}>
              <button onClick={() => router.push("/user/login")} className={styles.prevButton}>취소</button>
              <button onClick={handleUpdateProfile} className={styles.navigationButton}>수정</button>
            </div>
          </div>
        </div>
    );
});

export default MyInfo;
