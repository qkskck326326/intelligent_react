import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/lecture/lectureDetail.module.css';

const LectureDetail = ({ lectureId }) => {
    const [lecture, setLecture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/get_lecture_detail.php?lectureId=${lectureId}`);
                setLecture(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [lectureId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.lectureDetailContainer}>
            {lecture && (
                <>
                    <h1 className={styles.title}>{lecture.LECTURE_NAME}</h1>
                    <p className={styles.nickname}>강사 : {lecture.NICKNAME}</p>
                    <p className={styles.viewCount}>조회수 : {lecture.LECTURE_VIEWCOUNT}</p>
                    <div className={styles.videoContainer}>
                        <video className={styles.video} controls>
                            <source src={lecture.STREAM_URL} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </>
            )}
        </div>
    );
};

export default LectureDetail;
