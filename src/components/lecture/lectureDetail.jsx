import React, { useState, useEffect, useRef } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from '../../styles/lecture/lectureDetail.module.css';
import authStore from '../../stores/authStore';
import { AiOutlineWarning } from "react-icons/ai";

const LectureDetail = ({ lectureId }) => {
    const [lecture, setLecture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isReportPopupOpen, setIsReportPopupOpen] = useState(false);
    const [reportContent, setReportContent] = useState("");
    const [lectureRead, setLectureRead] = useState(0);
    const videoRef = useRef(null);
    const intervalRef = useRef(null);
    const lectureReadRef = useRef(0); // 최신 lectureRead 값을 유지

    useEffect(() => {
        const fetchLecture = async () => {
            try {
                const response = await axiosClient.get(`/lecture/detail/${lectureId}`);
                setLecture(response.data);
                console.log("Lecture data loaded:", response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
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
            increaseViewCount();
        }

        const handleBeforeUnload = (e) => {
            console.log("Before unload event triggered");
            sendWatchedTime();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            sendWatchedTime();
        };
    }, [lectureId]);

    useEffect(() => {
        const videoElement = videoRef.current;
        console.log("Video element:", videoElement);

        const startTracking = () => {
            if (!intervalRef.current) {
                intervalRef.current = setInterval(() => {
                    if (videoElement && !videoElement.paused) {
                        setLectureRead(prev => {
                            const newReadTime = prev + 1;
                            lectureReadRef.current = newReadTime; // 최신 값 유지
                            console.log("Lecture read time increased:", newReadTime);
                            console.log("Current lectureRead value:", newReadTime);
                            return newReadTime;
                        });
                    }
                }, 1000); // 1초마다 증가
                console.log("Video play started, tracking started");
            }
        };

        const stopTracking = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                console.log("Video paused or ended, tracking stopped");
            }
        };

        if (videoElement) {
            console.log("Adding event listeners to video element after render");
            videoElement.addEventListener('play', () => {
                console.log("Video play event triggered");
                startTracking();
            });
            videoElement.addEventListener('pause', () => {
                console.log("Video pause event triggered");
                stopTracking();
            });
            videoElement.addEventListener('ended', () => {
                console.log("Video ended event triggered");
                stopTracking();
            });
        } else {
            console.log("Video element is null after render");
        }

        return () => {
            if (videoElement) {
                videoElement.removeEventListener('play', startTracking);
                videoElement.removeEventListener('pause', stopTracking);
                videoElement.removeEventListener('ended', stopTracking);
            }
            stopTracking();
        };
    }, [lecture]);

    const sendWatchedTime = () => {
        const currentLectureRead = lectureReadRef.current; // 최신 값 참조
        console.log("Sending watched time:", currentLectureRead);
        axiosClient.post(`/lecture/update-read-status/${lectureId}`, {
            nickname: authStore.getNickname(),
            lectureRead: currentLectureRead
        })
        .then(() => {
            console.log("Watched time sent successfully");
        })
        .catch(error => {
            console.error("Error sending watched time:", error);
        });
    };

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
                <video ref={videoRef} className={styles.video} controls>
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
