import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from '../../styles/lecture/lectureDetail.module.css';
import authStore from '../../stores/authStore';
import { AiOutlineWarning } from "react-icons/ai"; // 신고 아이콘 추가

const LectureDetail = ({ lectureId }) => {
    const [lecture, setLecture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isReportPopupOpen, setIsReportPopupOpen] = useState(false);
    const [reportContent, setReportContent] = useState("");

    useEffect(() => {
        const fetchLecture = async () => {
            try {
                const response = await axiosClient.get(`/lecture/detail/${lectureId}`);
                setLecture(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        const updateReadStatus = async () => {
            const nickname = authStore.getNickname();
            try {
                await axiosClient.post(`/lecture/update-read-status/${lectureId}`, { nickname, lectureRead: 'Y' });
            } catch (err) {
                console.error("Error updating read status:", err);
            }
        };

        const increaseViewCount = async () => {
            try {
                await axiosClient.post(`/lecture/increase-viewcount/${lectureId}`);
            } catch (err) {
                console.error("Error increasing view count:", err);
            }
        };

        if (lectureId) {
            fetchLecture();
            updateReadStatus();
            increaseViewCount();
        }
    }, [lectureId]);

    const handleReportSubmit = async () => {
        try {
            const reportDTO = {
                receiveNickname: lecture.nickname,
                doNickname: authStore.getNickname(),
                content: reportContent,
                reportType: 3,
                contentId: lectureId,
            };

            await axiosClient.post("/reports", reportDTO);
            closeReportPopup();
            alert("신고가 접수되었습니다.");
        } catch (error) {
            console.error("신고 중 오류 발생:", error);
        }
    };

    const openReportPopup = () => {
        setIsReportPopupOpen(true);
    };

    const closeReportPopup = () => {
        setIsReportPopupOpen(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!lecture) return <p>No lecture found</p>;

    return (
        <div className={styles.lectureDetailContainer}>
            <div className={styles.header}>
                <h1 className={styles.lectureTitle}>{lecture.lectureName}</h1>
                <div className={styles.lectureInfoContainer}>
                    <p className={styles.lectureInfo}>By: {lecture.nickname} | 조회수: {lecture.lectureViewCount}</p>
                    <button className={styles.reportButton} onClick={openReportPopup}>
                        <AiOutlineWarning size={30} />
                    </button>
                </div>
            </div>
            <div className={styles.videoContainer}>
                <video className={styles.video} controls>
                    <source src={lecture.streamUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <p className={styles.lectureContent}>{lecture.lectureContent}</p>

            {isReportPopupOpen && (
                <div className={styles.reportPopup}>
                    <div className={styles.popupContent}>
                        <h2>강의 신고</h2>
                        <input
                            type="text"
                            value={reportContent}
                            onChange={(e) => setReportContent(e.target.value)}
                            placeholder="강의 신고 사유를 작성해주세요."
                        />
                        <button onClick={handleReportSubmit} className={styles.submitButton}>
                            제출
                        </button>
                        <button onClick={closeReportPopup} className={styles.cancelButton}>
                            취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LectureDetail;
