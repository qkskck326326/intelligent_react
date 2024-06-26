import React, { useState } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "../../styles/qna/insertQuestion.module.css";

const InsertQuestion = ({ onClose }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const nickname = localStorage.getItem("nickname");  // authStore에서 가져올 수도 있습니다.
            await axiosClient.post("/qna/qList", {
                questionTitle: title,
                questionContent: content,
                nickname: nickname,
            });
            alert("등록이 완료되었습니다.");
            onClose();
        } catch (error) {
            console.error("Error submitting question:", error);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.detailContainer}>
                <h2 className={styles.top}>질문 등록</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.header}>
                        <label>제목</label>
                        <input
                            type="text"
                            className={styles.title}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className={styles.contentContainer}>
                        <label>내용</label>
                        <textarea
                            className={styles.content}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className={styles.footer}>
                        <button type="button" className={styles.closeButton} onClick={onClose}>취소</button>
                        <button type="submit" className={styles.submitButton}>등록하기</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InsertQuestion;
