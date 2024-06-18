import React, { useEffect, useState } from "react";
import styles from "../../styles/lecturePackage/lecturePackage.module.css";
import Link from "next/link";
import { axiosClient } from "../../axiosApi/axiosClient";
import authStore from "../../stores/authStore";
import { observer } from "mobx-react";

const ITEMS_PER_PAGE = 4;

const UserInterestPackageList = observer(({ onRegisterClick }) => {
    const [lecturePackages, setLecturePackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const fetchUserInterestPackages = async () => {
            setLoading(true);
            try {
                const email = authStore.getUserEmail();
                const provider = authStore.getProvider();

                console.log("email, provider : ", email, provider);
                const response = await axiosClient.get('/packages/interestpackagetop10', {
                    params:{
                        email:email,
                        provider:provider
                    }
                });
                setLecturePackages(response.data);
                console.log("lecturePackage : ", response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (typeof window !== 'undefined') {
            const email = localStorage.getItem("userEmail");
            const provider = localStorage.getItem("provider");
            authStore.setUserEmail(email);
            authStore.setProvider(provider);

            fetchUserInterestPackages();
        }

    }, []);

    const handleNextPage = () => {
        if ((currentPage + 1) * ITEMS_PER_PAGE < lecturePackages.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

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

    const startIndex = currentPage * ITEMS_PER_PAGE;
    const currentItems = lecturePackages.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>'{authStore.getNickname()}' 님의 관심사별 TOP10</h3>
            </div>
            <div className={styles.paginationWrapper}>
                <button onClick={handlePreviousPage} disabled={currentPage === 0} className={styles.prevButton}></button>
                <div className={styles.grid}>
                    {currentItems.map((lecture) => (
                        <div key={lecture.lecturePackageId} className={styles.cardContainer}>
                            <div className={styles.card}>
                                <div className={styles.thumbnail}>
                                    <img src={lecture.thumbnail} alt={lecture.thumbnail} />
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
                <button onClick={handleNextPage} disabled={(currentPage + 1) * ITEMS_PER_PAGE >= lecturePackages.length} className={styles.nextButton}></button>
            </div>
        </div>
    );
});

export default UserInterestPackageList;