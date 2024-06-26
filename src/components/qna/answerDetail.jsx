import React, { useEffect, useState } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "../../styles/qna/answerDetail.module.css";

const AnswerDetail = ({ questionId, onClose }) => {
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const questionResponse = await axiosClient.get(`/qna/qList/detail/${questionId}`);
                setQuestion(questionResponse.data);
                const answerResponse = await axiosClient.get(`/qna/aList/detail/${questionId}`);
                setAnswer(answerResponse.data);
            } catch (error) {
                console.error("Error fetching details:", error);
            }
        };
        fetchDetails();
    }, [questionId]);

    if (!question || !answer) return <p>Loading...</p>;

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
                        <textarea className={styles.content} value={question.questionContent} readOnly />
                    </div>
                </div>
                <div className={styles.verticalLine}></div>
                <div className={styles.section}>
                    <h2 className={styles.top}>답 변</h2>
                        <div className={styles.header}>
                            <span>{answer.nickname}</span>
                        <span>{new Date(answer.answerDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.\s*/g, '-').replace(/-$/, '')}</span>
                    </div>
                    
                    <div className={styles.contentContainer}>
                        <textarea className={styles.content} value={answer.answerContent} readOnly />
                    </div>
                </div>
                <div className={styles.footer}>
                    <button className={styles.closeButton} onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default AnswerDetail;
