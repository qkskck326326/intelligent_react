import React, { useState, useEffect } from "react";
import styles from '../../styles/user/mypage/changePasswordModal.module.css';
import { axiosClient } from "../../axiosApi/axiosClient";

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasUpperCase: false,
        hasNumber: false
    });

    useEffect(() => {
        if (isOpen) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setPasswordValidation({
                minLength: false,
                hasUpperCase: false,
                hasNumber: false
            });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'newPassword') {
            setNewPassword(value);
        } else if (name === 'currentPassword') {
            setCurrentPassword(value);
        } else if (name === 'confirmNewPassword') {
            setConfirmNewPassword(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { minLength, hasUpperCase, hasNumber } = passwordValidation;
    
        if (newPassword !== confirmNewPassword) {
            alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }
    
        if (!minLength || !hasUpperCase || !hasNumber) {
            alert("새 비밀번호가 조건을 충족하지 않습니다. 다시 시도해 주세요.");
            return;
        }
    
        try {
            const userEmail = localStorage.getItem("userEmail"); // userEmail 가져오기
            await axiosClient.put('/users/change-password', {
                userEmail,
                currentPassword,
                newPassword
            });
            alert("비밀번호가 성공적으로 변경되었습니다.");
            onClose();
        } catch (error) {
            console.error("Error changing password:", error);
            alert("현재 비밀번호와 일치하지 않습니다.");
        }
    };
    
    

    useEffect(() => {
        const validatePassword = (userPwd) => {
            const minLength = userPwd.length >= 8;
            const hasUpperCase = /[A-Z]/.test(userPwd);
            const hasNumber = /[0-9]/.test(userPwd);
        
            return {
              minLength,
              hasUpperCase,
              hasNumber
            };
        };
        
        setPasswordValidation(validatePassword(newPassword));
    }, [newPassword]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>비밀번호 변경</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="currentPassword" className={styles.label}>현재 비밀번호</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            placeholder="현재 비밀번호"
                            value={currentPassword}
                            onChange={handleChange}
                            className={styles.input}
                            maxLength="20"
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="newPassword" className={styles.label}>새 비밀번호</label>
                        <div className={styles.tooltip}>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                placeholder="새 비밀번호"
                                value={newPassword}
                                onChange={handleChange}
                                className={styles.input}
                                maxLength="20"
                            />
                            <div className={styles.tooltiptext}>
                                <p className={passwordValidation.minLength ? styles.valid : styles.invalid}>{passwordValidation.minLength ? '✔' : '✖'} 8자 이상</p>
                                <p className={passwordValidation.hasUpperCase ? styles.valid : styles.invalid}>{passwordValidation.hasUpperCase ? '✔' : '✖'} 대문자 한 개 이상</p>
                                <p className={passwordValidation.hasNumber ? styles.valid : styles.invalid}>{passwordValidation.hasNumber ? '✔' : '✖'} 숫자 한 개 이상</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmNewPassword" className={styles.label}>비밀번호 확인</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            placeholder="비밀번호 확인"
                            value={confirmNewPassword}
                            onChange={handleChange}
                            className={styles.input}
                            maxLength="20"
                            required
                        />
                    </div>
                    <div className={styles.buttons}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>취소</button>
                        <button type="submit" className={styles.submitButton}>변경</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
