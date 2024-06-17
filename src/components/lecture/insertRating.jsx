import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "../../styles/lecture/insertRating.module.css";

const InsertRating = ({ lecturePackageId }) => {
    const [averageRating, setAverageRating] = useState(0);
    const [myRating, setMyRating] = useState(null);
    const [hover, setHover] = useState(null);

    useEffect(() => {
        const fetchAverageRating = async () => {
            try {
                const response = await axiosClient.get(`/lecture/rating?lecturePackageId=${lecturePackageId}`);
                setAverageRating(response.data.rating);
            } catch (error) {
                console.error("Error fetching average rating:", error);
            }
        };

        fetchAverageRating();
    }, [lecturePackageId]);

    const handleRatingSubmit = async () => {
        try {
            await axiosClient.post('/lecture/rating', {
                lecturePackageId,
                rating: myRating
            });
            alert("별점이 등록되었습니다.");
        } catch (error) {
            console.error("Error submitting rating:", error);
        }
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;

        return (
            <div className={styles.rating}>
                {Array(fullStars).fill().map((_, i) => (
                    <span key={i} className={styles.star}>⭐</span>
                ))}
                {halfStar && <span className={styles.halfStar}>⭐</span>}
                {Array(5 - fullStars - (halfStar ? 1 : 0)).fill().map((_, i) => (
                    <span key={i + fullStars + (halfStar ? 1 : 0)} className={styles.star}>☆</span>
                ))}
            </div>
        );
    };

    return (
        <div className={styles.App}>
            <div className={styles.inlineContainer}>
                <h3 className={styles.title}>강의 별점</h3>
                {renderStars(averageRating)}
            </div>
            <div className={styles.inlineContainer}>
                <h3 className={styles.title}>내 별점</h3>
                <div className={styles.rating}>
                    {[...Array(5)].map((_, index) => {
                        const currentRating = index + 1;
                        return (
                            <span
                                key={index}
                                className={styles.star}
                                style={{
                                    color: currentRating <= (hover || myRating) ? "#ffd700" : "#e4e5e9"
                                }}
                                onMouseEnter={() => setHover(currentRating)}
                                onMouseLeave={() => setHover(null)}
                                onClick={() => setMyRating(currentRating)}
                            >
                                &#9733;
                            </span>
                        );
                    })}
                </div>
                <button onClick={handleRatingSubmit} className={styles.submitButton}>등록</button>
            </div>
        </div>
    );
};

export default InsertRating;
