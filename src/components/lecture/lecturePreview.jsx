import React, { useState, useEffect, useCallback } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from '../../styles/lecture/lecturePreview.module.css';

const LecturePreview = ({ lectureId }) => {
    const [lecture, setLecture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const response = await axiosClient.get(`/lecture/preview/${lectureId}`);
            setLecture(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    }, [lectureId]);

    useEffect(() => {
        if (lectureId) {
            fetchData();
        }
    }, [lectureId, fetchData]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.lecturePreviewContainer}>
            {lecture && (
                <div key={lecture.lectureId} className={styles.lectureCard}>
                    <img src={lecture.lectureThumbnail} alt={lecture.lectureName} className={styles.thumbnail} />
                    <h5 className={styles.title}>{lecture.lectureName}</h5>
                    <p className={styles.nickname}>By: {lecture.nickname}</p>
                    <p className={styles.content}>{lecture.lectureContent}</p>
                </div>
            )}
        </div>
    );
}

export default LecturePreview;
