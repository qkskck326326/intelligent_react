import React, { useEffect, useState } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "../../styles/qna/adminQuestionDetail.module.css";

const AdminQuestionDetail = ({ question, onClose, onAnswerSubmitSuccess }) => {
    const [answerContent, setAnswerContent] = useState("");

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post("/qna/answer", {
                questionId: question.questionId,
                answerContent,
                nickname: localStorage.getItem("nickname")
            });
            alert("답변이 등록되었습니다.");
            onAnswerSubmitSuccess(question.questionId);
        } catch (error) {
            console.error("Error submitting answer:", error);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.detailContainer}>
                <div className={styles.section}>
                    <h2 className={styles.top}>질 문</h2>
                    <div className={styles.header}>
                        <label>작성자</label>
                        <label>제목</label>
                        <label>작성일</label>
                    </div>
                    <div className={styles.header}>
                        <span>{question.nickname}</span>
                        <span>{question.questionTitle}</span>
                        <span>{new Date(question.questionDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.\s*/g, '-').replace(/-$/, '')}</span>
                    </div>
                    <div className={styles.contentContainer}>
                        <textarea className={styles.questionContent} value={question.questionContent} readOnly />
                    </div>
                </div>
                <div className={styles.verticalLine}></div>
                <div className={styles.section}>
                <h2 className={styles.top}>답 변</h2>
                    <form onSubmit={handleAnswerSubmit}>
                        <div className={styles.contentContainer}>
                            <textarea
                                className={styles.answerContent}
                                value={answerContent}
                                onChange={(e) => setAnswerContent(e.target.value)}
                            />
                        </div>
                        <div className={styles.footer}>
                            <button type="button" className={styles.closeButton} onClick={onClose}>닫기</button>
                            <button type="submit" className={styles.submitButton}>답변하기</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminQuestionDetail;
