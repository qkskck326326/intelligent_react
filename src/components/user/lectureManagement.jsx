import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "../../styles/user/mypage/myLecturePackage.module.css";
import Link from "next/link";

const MyLecturePackage = observer(() => {
    const router = useRouter();
    const [lecturePackages, setLecturePackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (!authStore.checkIsLoggedIn()) {
            router.push("/user/login");
        } else {
            fetchLecturePackages(currentPage);
        }
    }, [currentPage]);

    const fetchLecturePackages = async (page) => {
        try {
            const response = await axiosClient.get(`/lecture/lecturePackage/${authStore.getNickname()}`, {
                params: { page: page, size: 6 }
            });
            setLecturePackages(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>에러: {error.message}</p>;

    const renderStars = (rating) => {
        const safeRating = rating !== null ? rating : 0.0;
        const fullStars = Math.floor(safeRating);
        const halfStar = safeRating % 1 >= 0.5;
    
        return (
            <>
                {Array(fullStars)
                    .fill(null)
                    .map((_, index) => (
                        <span key={`full-${index}`} className={styles.star}>
                            ⭐
                        </span>
                    ))}
                {halfStar && <span className={styles.halfStar}>⭐</span>}
            </>
        );
    };

    const getLectureLevel = (level) => {
        switch (level) {
            case 0:
                return "입문";
            case 1:
                return "기본";
            case 2:
                return "심화";
            default:
                return "알 수 없음";
        }
    };

    const renderLevelIcon = (level) => {
        return (
            <div className={styles.levelIcon}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <span
                        key={index}
                        className={index < level + 1 ? styles.active : styles.inactive}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <h1>나의 강좌 목록</h1>
            <div className={styles.grid}>
                {lecturePackages.map((lecture) => (
                    <div key={lecture.lecturePackageId} className={styles.cardContainer}>
                        <div className={styles.thumbnail}>
                            <img src={lecture.thumbnail} alt={lecture.title} />
                        </div>
                        <div className={styles.details}>
                            <div className={styles.title}>
                                <Link href={`/lecturePackage/${lecture.lecturePackageId}`}>
                                    <span className={styles.customLink}>{lecture.title}</span>
                                </Link>
                            </div>
                            <div className={styles.rating}>
                                {"별점 "}
                                {lecture.rating ? (
                                    renderStars(lecture.rating)
                                ) : (
                                    <span className={styles.emptyStar}>&nbsp;</span>
                                )}
                            </div>
                            <div className={styles.info}>
                                <span>
                                    <img
                                        className={styles.viewCount}
                                        src="/images/view_count_icon.png"
                                        alt="조회수 아이콘"
                                    />
                                </span>{" "}
                                {lecture.viewCount} views
                                <span className={styles.packageLevel}>
                                    {renderLevelIcon(lecture.packageLevel)}
                                    {getLectureLevel(lecture.packageLevel)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.paginationContainer}>
                <ul className={styles.paginationWrapper}>
                    <li>
                        <button
                            className={`${styles.pageLink} ${styles.pageLinkNav}`}
                            onClick={() => handlePageChange(0)}
                        >
                            «
                        </button>
                    </li>
                    <li>
                        <button
                            className={`${styles.pageLink} ${styles.pageLinkNav}`}
                            onClick={() => handlePageChange(currentPage > 0 ? currentPage - 1 : 0)}
                        >
                            ‹
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i + 1}>
                            <button
                                className={`${styles.pageLink} ${i === currentPage ? styles.activePage : ''}`}
                                onClick={() => handlePageChange(i)}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            className={`${styles.pageLink} ${styles.pageLinkNav}`}
                            onClick={() => handlePageChange(currentPage < totalPages - 1 ? currentPage + 1 : totalPages - 1)}
                        >
                            ›
                        </button>
                    </li>
                    <li>
                        <button
                            className={`${styles.pageLink} ${styles.pageLinkNav}`}
                            onClick={() => handlePageChange(totalPages - 1)}
                        >
                            »
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
});

export default MyLecturePackage;
