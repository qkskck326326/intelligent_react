import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from '../../styles/lecture/lectureDetail.module.css';

const LectureDetail = ({ lectureId }) => {
    const [lecture, setLecture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLecture = async () => {
            try {
                const response = await axiosClient.get(`/lecture/${lectureId}`);
                setLecture(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        if (lectureId) {
            fetchLecture();
        }
    }, [lectureId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!lecture) return <p>No lecture found</p>;

    return (
        <div className={styles.lectureDetailContainer}>
            <h1 className={styles.lectureTitle}>{lecture.title}</h1>
            <p className={styles.lectureContent}>{lecture.content}</p>
            <div className={styles.videoContainer}>
                <video className={styles.video} controls>
                    <source src={lecture.streamUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
};

export default LectureDetail;
