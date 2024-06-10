import React, { useState, useEffect } from "react";
import styles from "../../styles/lecturePackage.module.css";
import { axiosClient } from "../../axiosApi/axiosClient";

const LecturePackage = ({ nickname }) => {
    const [lecturePackages, setLecturePackages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const ITEMS_PER_PAGE = 10;

    const fetchLecturePackages = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/lecture-packages', { params: { nickname } });
            const responseData = response.data;
            const dataArray = Array.isArray(responseData) ? responseData : [responseData];
            setLecturePackages(dataArray);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (nickname) {
            fetchLecturePackages();
        }
    }, [nickname]);

    const totalPages = Math.ceil(lecturePackages.length / ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const displayedLectures = lecturePackages.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {displayedLectures.map((lecture) => (
                    <div key={lecture.LECTURE_PACKAGE_ID} className={styles.card}>
                        <div className={styles.thumbnail}>
                            <img src={lecture.THUMBNAIL} alt={lecture.TITLE} />
                        </div>
                        <h3>{lecture.TITLE}</h3>
                        <div className={styles.rating}>
                            {'별점 '}
                            {Array(lecture.RATING)
                                .fill('⭐')
                                .join('')}
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.pagination}>
                <button
                    className={styles.pageButton}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    이전
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={styles.pageButton}
                        onClick={() => handlePageChange(index + 1)}
                        disabled={currentPage === index + 1}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className={styles.pageButton}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default LecturePackage;