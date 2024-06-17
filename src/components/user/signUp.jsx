import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { handleAxiosError } from "../../axiosApi/errorAxiosHandler";
import { axiosClient } from "../../axiosApi/axiosClient";
import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID_TAESEOK,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY_TAESEOK,
    region: process.env.NEXT_PUBLIC_AWS_REGION_TAESEOK,
});

const s3 = new AWS.S3();

const SignUpForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        userEmail: '',
        userName: '',
        userPwd: '',
        confirmPassword: '',
        phone: '',
        nickname: '',
        userType: 0,
        profileImageUrl: 'https://intelliclassbucket.s3.ap-northeast-2.amazonaws.com/ProfileImages/defaultProfile.png',
    });
    const [profileImage, setProfileImage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = async (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const resizedImage = await resizeImage(file, 128, 128);
            setProfileImage(resizedImage);
        } else {
            setProfileImage(null);
            setFormData({
                ...formData,
                profileImageUrl: 'https://intelliclassbucket.s3.ap-northeast-2.amazonaws.com/ProfileImages/defaultProfile.png',
            });
        }
    };

    const resizeImage = (file, width, height) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, { type: file.type }));
                    }, file.type);
                };
                img.onerror = (error) => reject(error);
                img.src = event.target.result;
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { userEmail, userName, userPwd, confirmPassword, phone, nickname, userType } = formData;
        if (userPwd !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        let profileImageUrl = formData.profileImageUrl;
        if (profileImage) {
            try {
                profileImageUrl = await uploadImageToS3(profileImage);
            } catch (err) {
                alert('프로필 이미지를 업로드하는 중 오류가 발생했습니다.');
                return;
            }
        }

        const signUpData = {
            userEmail,
            userName,
            userPwd,
            phone,
            nickname,
            provider: "intelliclass",
            registerTime: "",
            profileImageUrl,
            userType,
            reportCount: 0,
            loginOk: 'Y',
            faceLoginYn: 'N',
            snsAccessToken: "",
        };
        try {
            await axiosClient.post('/users/user', signUpData);
            router.push("/user/login");
        } catch (error) {
            handleAxiosError(error);
        }
    };

    return (
        <div className="center-div">
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="userEmail">이메일:</label>
                    <input type="email" id="userEmail" name="userEmail" value={formData.userEmail} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="userName">이름:</label>
                    <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="userPwd">비밀번호:</label>
                    <input type="password" id="userPwd" name="userPwd" value={formData.userPwd} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">비밀번호 확인:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">휴대폰 번호:</label>
                    <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="nickname">닉네임:</label>
                    <input type="text" id="nickname" name="nickname" value={formData.nickname} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="userType">사용자 유형:</label>
                    <select id="userType" name="userType" value={formData.userType} onChange={handleInputChange} required>
                        <option value={0}>학생</option>
                        <option value={1}>강사</option>
                        <option value={2}>관리자</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="profileImage">프로필 사진:</label>
                    <input type="file" id="profileImage" accept="image/*" onChange={handleFileChange} />
                </div>
                <div className="button-container">
                    <button type="submit">회원가입</button>
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;
