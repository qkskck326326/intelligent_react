import React from "react";
import styles from "../../styles/lecturePackage/lecturePackage.module.css";

const LectureCard = ({ lecture }) => {
    return (
        <div className={styles.cardContainer}>
            <div className={styles.card}>
                <div className={styles.thumbnail}>
                    <img src={lecture.thumbnail} alt={lecture.title} />
                </div>
            </div>
            <div className={styles.details}>
                <div className={styles.title}>{lecture.title}</div>
                <div className={styles.rating}>
                    {'별점 '}
                    {Number.isFinite(lecture.rating) && lecture.rating > 0 &&
                        Array(Math.floor(lecture.rating))
                            .fill(null)
                            .map((_, index) => (
                                <span key={`${lecture.lecturePackageId}-${index}`} role="img" aria-label="star">⭐</span>
                            ))}
                </div>
            </div>
        </div>
    );
};

export default LectureCard;