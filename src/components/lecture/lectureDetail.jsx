import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from '../../styles/lecture/lectureDetail.module.css';
import authStore from '../../stores/authStore';

const LectureDetail = ({ lectureId }) => {
    const [lecture, setLecture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!lecture) return <p>No lecture found</p>;

    return (
        <div className={styles.lectureDetailContainer}>
            <div className={styles.header}>
                <h1 className={styles.lectureTitle}>{lecture.lectureName}</h1>
                <p className={styles.lectureInfo}>By: {lecture.nickname} | 조회수: {lecture.lectureViewCount}</p>
            </div>
            <div className={styles.videoContainer}>
                <video className={styles.video} controls>
                    <source src={lecture.streamUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <p className={styles.lectureContent}>{lecture.lectureContent}</p>
        </div>
    );
};

export default LectureDetail;
