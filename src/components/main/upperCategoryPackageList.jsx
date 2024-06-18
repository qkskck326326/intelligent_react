import React, { useEffect, useState } from "react";
import styles from "../../styles/lecturePackage/upperCategoryPackage.module.css";
import Link from "next/link";
import { axiosClient } from "../../axiosApi/axiosClient";

const UpperCategoryPackageList = () => {
    const [lecturePackages, setLecturePackages] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [upperCategories, setUpperCategories] = useState([]);

    useEffect(() => {
        const fetchUpperCategoryPackages = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get('/packages/upperCategorypackageall');
                setLecturePackages(response.data);
                const upperCategoryResponse = await axiosClient.get('/categories/upper');
                setUpperCategories(upperCategoryResponse.data);
                console.log("lecturePackage : ", response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUpperCategoryPackages();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;

        return (
            <>
                {Array(fullStars).fill(null).map((_, index) => (
                    <span key={`full-${index}`} className={styles.star}>⭐</span>
                ))}
                {halfStar && <span className={styles.halfStar} />}
            </>
        );
    };

    const getUpperCategoryName = (id) => {
        const category = upperCategories.find(cat => cat.id === id);
        return category ? category.name : '';
    };

    return (
        <div className={styles.container}>
            {Object.keys(lecturePackages).map(upperCategoryId => (
                <div key={upperCategoryId}>
                    <div className={styles.header}>
                        <h3>{getUpperCategoryName(Number(upperCategoryId))}</h3>
                    </div>
                    <div className={`${styles.grid} ${styles.upperCategoryGrid}`}>
                        {lecturePackages[upperCategoryId].map((lecture) => (
                            <div key={lecture.lecturePackageId} className={styles.cardContainer}>
                                <div className={styles.card}>
                                    <div className={styles.thumbnail}>
                                        <img src={lecture.thumbnail} alt={lecture.title} />
                                    </div>
                                </div>
                                <div className={styles.details}>
                                    <div className={styles.title}>
                                        <Link href={`/lecturePackage/${lecture.lecturePackageId}`}>
                                            {lecture.title}
                                        </Link>
                                    </div>
                                    <div className={styles.rating}>
                                        {'별점 '}
                                        {renderStars(lecture.rating)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UpperCategoryPackageList;