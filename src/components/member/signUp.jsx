import React, { useState } from 'react';
import { signUp } from "../../axiosApi/MemberAxios";
import { useRouter } from 'next/router';
import { handleAxiosError } from "../../axiosApi/errorAxiosHandler";

const SignUpForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        userEmail: '',
        userName: '',
        userPwd: '',
        confirmPassword: '',
        phone: '',
        nickname: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { userEmail, userName, userPwd, confirmPassword, phone, nickname } = formData;
        if (userPwd !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        const signUpData = {
            userEmail,
            userName,
            userPwd,
            phone,
            nickname,
            provider: "intelliclass",
            registerTime: new Date().toISOString(),
            profileImageUrl: "",
            userType: 0,
            reportCount: 0,
            loginOk: 'Y',
            faceLoginYn: 'N',
            snsAccessToken: "",
        };
        try {
            await signUp(signUpData);
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
                <div className="button-container">
                    <button type="submit">회원가입</button>
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;