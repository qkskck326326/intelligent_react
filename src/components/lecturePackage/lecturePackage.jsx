import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/lecturePackage.module.css";
import Pagination from "../common/pagination";
import { axiosClient } from "../../axiosApi/axiosClient";

const LecturePackage = () => {
    const [lecturePackages, setLecturePackages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const ITEMS_PER_PAGE = 8;

    const fetchLecturePackages = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/packages');
            const responseData = response.data;
            const dataArray = Array.isArray(responseData) ? responseData : [responseData];

            setLecturePackages(dataArray);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLecturePackages();
    }, []);

    const totalPages = Math.ceil(lecturePackages.length / ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const displayedLectures = lecturePackages.slice(

        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE

    );
    console.log(displayedLectures);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {displayedLectures.map((lecture) => (
                    <div key={lecture.lecturePackageId} className={styles.card}>
                        <div className={styles.thumbnail}>
                            <img src={lecture.thumbnail} alt={lecture.thumbnail} />
                        </div>
                        <div className={styles.title}>{lecture.title}</div>
                        <div className={styles.rating}>
                            {'별점 '}
                            {Number.isFinite(lecture.rating) && lecture.rating > 0 &&
                                Array(Math.floor(lecture.rating))
                                    .fill(null)
                                    .map((_, index) => (
                                        <span key={index} role="img" aria-label="star">⭐</span>
                                    ))}
                        </div>
                    </div>
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default LecturePackage;