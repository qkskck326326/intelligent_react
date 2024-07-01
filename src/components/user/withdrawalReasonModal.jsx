import React, { useState } from "react";
import styles from '../../styles/user/mypage/withdrawalReasonModal.module.css';
import { axiosClient } from "../../axiosApi/axiosClient";
import { useRouter } from 'next/router';
import authStore from "../../stores/authStore";

const WithdrawalReasonModal = ({ isOpen, onClose }) => {
    const [reason, setReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const router = useRouter();  

    const handleChange = (e) => {
        setReason(e.target.value);
        if (e.target.value !== "직접 입력") {
            setCustomReason("");
        }
    };

    const handleCustomReasonChange = (e) => {
        setCustomReason(e.target.value);
    };

    const handleSubmit = async () => {
        const finalReason = reason === "직접 입력" ? customReason : reason;
        if (!finalReason) {
            alert("탈퇴 사유를 입력해주세요.");
            return;
        }

        const userEmail = localStorage.getItem("userEmail");
        const provider = localStorage.getItem("provider");

        try {
            await axiosClient.delete(`/users/deleteuser/${userEmail}/${provider}`, {
                params: {
                    reason: finalReason
                }
            });
            onClose();
            authStore.reset();
            localStorage.clear();
            router.push('/');  // 메인 페이지로 이동
            alert('탈퇴가 완료되었습니다.');
            
        } catch (error) {
            console.error("Error during user deletion:", error);
            alert("탈퇴 중 오류가 발생했습니다.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.title}>탈퇴 사유를 골라주세요</div>
                <select value={reason} onChange={handleChange} className={styles.select}>
                    <option value="">탈퇴이유</option>
                    <option value="더 좋은 사이트를 찾았어요">더 좋은 사이트를 찾았어요</option>
                    <option value="사이트가 유용하지 않아요">사이트가 유용하지 않아요</option>
                    <option value="이용이 불편해요">이용이 불편해요</option>
                    <option value="직접 입력">직접 입력</option>
                </select>
                {reason === "직접 입력" && (
                    <textarea
                        value={customReason}
                        onChange={handleCustomReasonChange}
                        placeholder="탈퇴 사유를 입력해주세요"
                        className={styles.textarea}
                    />
                )}
                <div className={styles.buttons}>
                    <button onClick={onClose} className={styles.cancelButton}>취소</button>
                    <button onClick={handleSubmit} className={styles.submitButton}>탈퇴</button>
                </div>
            </div>
        </div>
    );
};

export default WithdrawalReasonModal;
