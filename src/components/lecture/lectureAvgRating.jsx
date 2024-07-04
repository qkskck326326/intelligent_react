import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "../../styles/lecture/lectureAvgRating.module.css";

const LectureAvgRating = ({ lecturePackageId }) => {
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const getAverageRating = async () => {
            try {
                const response = await axiosClient.get(`/lecture/rating/${lecturePackageId}`);
                setAverageRating(response.data.rating);
            } catch (error) {
                console.error("Error fetching average rating:", error);
            }
        };

        getAverageRating();
    }, [lecturePackageId]);

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;

        return (
            <div className={styles.rating}>
                {Array(fullStars).fill().map((_, i) => (
                    <span key={i} className={`${styles.star} ${styles.readonly}`}>⭐</span>
                ))}
                {halfStar && <span className={`${styles.halfStar} ${styles.readonly}`}></span>}
                {Array(5 - fullStars - (halfStar ? 1 : 0)).fill().map((_, i) => (
                    <span key={i + fullStars + (halfStar ? 1 : 0)} className={`${styles.star} ${styles.readonly}`}>☆</span>
                ))}
            </div>
        );
    };

    return (
        <div className={styles.App}>
            <div className={styles.inlineContainer}>
                <h3 className={styles.title}>강의 별점</h3>
                {renderStars(averageRating)}
                <span className={styles.score}>{averageRating.toFixed(1)} 점</span>
            </div>
        </div>
    );
};

export default LectureAvgRating;
