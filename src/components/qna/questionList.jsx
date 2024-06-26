import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import authStore from "../../stores/authStore";
import QuestionDetail from "./questionDetail";
import InsertQuestion from "./insertQuestion";
import styles from "../../styles/qna/questionList.module.css";

const QuestionList = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);

    useEffect(() => {
        fetchQuestions(page);
    }, [page]);

    const fetchQuestions = async (page) => {
        try {
            const nickname = authStore.getNickname();
            const response = await axiosClient.get(`/qna/qList/${nickname}?page=${page}&size=10`);
            setQuestions(response.data.content);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching questions:", error);
            setError(error);
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleRowClick = (question) => {
        setSelectedQuestion(question);
    };

    const handleCloseModal = () => {
        setSelectedQuestion(null);
    };

    const handleInsertClick = () => {
        setIsInsertModalOpen(true);
    };

    const handleCloseInsertModal = () => {
        setIsInsertModalOpen(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const emptyRows = Array.from({ length: 10 - questions.length });

    return (
        <div className={styles.container}>
            <table className={styles.questionTable}>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map((question, index) => (
                        <tr key={question.questionId} onClick={() => handleRowClick(question)}>
                            <td>{index + 1 + page * 10}</td>
                            <td>{question.questionTitle}</td>
                            <td>{question.nickname}</td>
                            <td>{new Date(question.questionDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.\s*/g, '-').replace(/-$/, '')}</td>
                        </tr>
                    ))}
                    {emptyRows.map((_, index) => (
                        <tr key={`empty-${index}`}>
                            <td colSpan="4">&nbsp;</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.pagination}>
                <button onClick={() => handlePageChange(0)} disabled={page === 0}>
                    {"<<"}
                </button>
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                    {"<"}
                </button>
                {[...Array(totalPages).keys()].map(num => (
                    <button
                        key={num}
                        onClick={() => handlePageChange(num)}
                        className={num === page ? styles.activePage : ""}
                    >
                        {num + 1}
                    </button>
                ))}
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1}>
                    {">"}
                </button>
                <button onClick={() => handlePageChange(totalPages - 1)} disabled={page === totalPages - 1}>
                    {">>"}
                </button>
            </div>
            <div className={styles.registerButtonContainer}>
                <button className={styles.registerButton} onClick={handleInsertClick}>등록하기</button>
            </div>
            {selectedQuestion && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <QuestionDetail question={selectedQuestion} onClose={handleCloseModal} />
                    </div>
                </div>
            )}
            {isInsertModalOpen && (
                <div className={styles.modalOverlay} onClick={handleCloseInsertModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <InsertQuestion onClose={handleCloseInsertModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionList;
