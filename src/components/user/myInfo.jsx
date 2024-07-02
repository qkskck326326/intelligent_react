import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import { axiosClient } from '../../axiosApi/axiosClient';
import AWS from "aws-sdk";
import ChangePasswordModal from "./changePasswordModal"; // 모달 컴포넌트 import
import WithdrawalReasonModal from "./withdrawalReasonModal"; // 탈퇴 모달 컴포넌트 import
import styles from '../../styles/user/mypage/myInfo.module.css';

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
        phone: '',
        nickname: '',
        profileImageUrl: ''
    });

    const [previewImageUrl, setPreviewImageUrl] = useState("/images/defaultProfile.png");
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
    const [provider, setProvider] = useState("");

    useEffect(() => {
        const provider = localStorage.getItem("provider");
        setProvider(provider);

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
            setUserData(prevState => ({
                ...prevState,
                userName: data.userName || '',
                userEmail: data.userEmail || '',
                phone: formatPhoneNumber(data.phone || ''),
                nickname: data.nickname || '',
                profileImageUrl: data.profileImageUrl || "/images/defaultProfile.png"
            }));
            setPreviewImageUrl(data.profileImageUrl || "/images/defaultProfile.png");
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const onlyNums = value.replace(/[^0-9]/g, '');
            setUserData(prevState => ({
                ...prevState,
                [name]: formatPhoneNumber(onlyNums)
            }));
        } else {
            setUserData(prevState => ({
                ...prevState,
                [name]: value || ''
            }));
        }
    };

    const formatPhoneNumber = (phone) => {
        const cleaned = ('' + phone).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
        if (match) {
          return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return phone;
    };

    const isValidPhoneNumber = (phone) => {
        const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
        return phoneRegex.test(phone);
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
            // alert('이미지 파일만 업로드할 수 있습니다.');
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
        if (!isValidPhoneNumber(userData.phone)) {
            alert("휴대폰 번호를 확인하세요.");
            return;
        }

        let profileImageUrl = userData.profileImageUrl;
        if (userData.profileImageUrl instanceof File) {
            profileImageUrl = await uploadImageToS3(userData.profileImageUrl);
        }

        const updateData = {
            nickname: userData.nickname,
            phone: userData.phone,
            profileImageUrl: profileImageUrl
        };

        try {
            await axiosClient.put(`/users/update-profile`, {
                userEmail: localStorage.getItem("userEmail"),
                provider: localStorage.getItem("provider"),
                ...updateData
            });

            localStorage.setItem("profileImageUrl", profileImageUrl);
            authStore.setProfileImageUrl(profileImageUrl);

            alert('프로필이 성공적으로 업데이트되었습니다.');
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("프로필 업데이트 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className={styles.container}>
          <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)} />
          <WithdrawalReasonModal isOpen={isWithdrawalModalOpen} onClose={() => setIsWithdrawalModalOpen(false)} />
          <div className={styles.form}>
            <div style={{ display: 'block', fontSize: '2rem', marginBlockStart: '0.83em', marginBlockEnd: '0.83em', marginInlineStart: '0px', marginInlineEnd: '0px', fontWeight: 'bold', textAlign: 'center' }}>
                회원 정보 수정
            </div>
            <div className={styles.formBody}>
              <div className={styles.imageSection}>
                <div className={styles.imageUpload}>
                  <div className={styles.profileImageContainer}>
                    <img src={previewImageUrl} alt="프로필 이미지" className={styles.profileImage} />
                    <label htmlFor="fileUpload" className={styles.fileUploadLabel}></label>
                  </div>
                  <input type="file" id="fileUpload" name="profileImageUrl" onChange={handleImageChange} className={styles.fileInput} accept="image/*"/>
                  <span className={styles.userTypeSpan}>
                    {authStore.checkIsStudent() && "학생"}
                    {authStore.checkIsTeacher() && "강사"}
                    {authStore.checkIsAdmin() && "관리자"}
                  </span>
                </div>
              </div>
              <div className={styles.inputSection}>
                <div className={styles.inputGroup}>
                  <label htmlFor="userName" className={styles.label}>이름</label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    placeholder="이름"
                    value={userData.userName}
                    onChange={handleChange}
                    className={styles.input}
                    maxLength="20"
                    readOnly
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="userEmail" className={styles.label}>이메일</label>
                  <input
                    type="text"
                    id="userEmail"
                    name="userEmail"
                    placeholder="이메일"
                    value={userData.userEmail}
                    className={styles.input}
                    maxLength="30"
                    readOnly
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="nickname" className={styles.label}>닉네임</label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    placeholder="닉네임"
                    value={userData.nickname}
                    onChange={handleChange}
                    className={styles.input}
                    maxLength="15"
                    readOnly
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="phone" className={styles.label}>연락처</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="연락처"
                    value={userData.phone}
                    onChange={handleChange}
                    className={styles.input}
                    maxLength="13"
                  />
                </div>
              </div>
            </div>
            <div className={styles.buttons}>
              <button onClick={handleUpdateProfile} className={styles.navigationButton}>수정</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 20px', width: '100%' }}>
                {provider === "intelliclass" && (
                  <button onClick={() => setIsChangePasswordModalOpen(true)} style={{ fontSize: '0.8rem', color: '#999', textDecoration: 'none', cursor: 'pointer', marginBottom: '10px', background: 'none', border: 'none' }}>비밀번호 변경</button>
                )}
                <button onClick={() => setIsWithdrawalModalOpen(true)} style={{ fontSize: '0.8rem', color: '#999', textDecoration: 'none', cursor: 'pointer', marginBottom: '10px', background: 'none', border: 'none' }}>회원탈퇴</button>
                {/* <a href="/user/delete" style={{ fontSize: '0.8rem', color: '#999', textDecoration: 'none', cursor: 'pointer' }}>회원탈퇴</a> */}
            </div>
          </div>
        </div>
    );
});

export default MyInfo;
