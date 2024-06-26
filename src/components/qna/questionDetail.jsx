import React from "react";
import styles from "../../styles/qna/questionDetail.module.css";

const QuestionDetail = ({ question, onClose }) => {
    return (
        <div className={styles.detailContainer}>
            <div className={styles.top}>
                <h2>질 문</h2>
            </div>
            <div className={styles.header}>
                <label>제 목</label>
                <span className={styles.title}>{question.questionTitle}</span>
            </div>
            <div className={styles.contentContainer}>
                <label>내 용</label>
                <textarea className={styles.content} readOnly value={question.questionContent}></textarea>
            </div>
            <div className={styles.footer}>
                <button onClick={onClose} className={styles.closeButton}>닫기</button>
            </div>
        </div>
    );
};

export default QuestionDetail;
