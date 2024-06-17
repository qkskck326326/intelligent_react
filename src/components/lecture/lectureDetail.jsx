import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/lecture/lectureDetail.module.css';
import LectureComment from './LectureComment'; // 댓글 컴포넌트 불러오기

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
                    <div className={styles.header}>
                        <h1 className={styles.title}>{lecture.LECTURE_NAME}</h1>
                        <p className={styles.info}>조회수 : {lecture.LECTURE_VIEWCOUNT}</p>
                        <p className={styles.info}>날짜 : {lecture.LECTURE_DATE}</p>
                        <p className={styles.info}>강사 : {lecture.NICKNAME}</p>
                    </div>
                    <div className={styles.videoContainer}>
                        <video className={styles.video} controls>
                            <source src={lecture.streamUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <LectureComment lectureId={lectureId} /> {/* 댓글 컴포넌트 추가 */}
                </>
            )}
        </div>
    );
};

export default LectureDetail;
