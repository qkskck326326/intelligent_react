import React, { useState, useEffect } from "react";
import styles from "../../styles/lecturePackage/lecturePackage.module.css";
import Pagination from "../common/pagination";
import { axiosClient } from "../../axiosApi/axiosClient";
import SortAndSearchBar from "../common/sortAndSearchBar"; // 검색창 및 드롭다운 컴포넌트 추가

const LecturePackageList = () => {
    const [lecturePackages, setLecturePackages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortCriteria, setSortCriteria] = useState("latest");
    const [searchCriteria, setSearchCriteria] = useState("title");

    const ITEMS_PER_PAGE = 16; // 한 페이지에 16개의 항목 표시

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

    const filteredLectures = lecturePackages.filter((lecture) => {
        if (searchCriteria === "title") {
            return lecture.title.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchCriteria === "instructor") {
            return lecture.nickname.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
    });

    const sortedLectures = [...filteredLectures].sort((a, b) => {
        if (sortCriteria === "latest") {
            return new Date(b.registerDate) - new Date(a.registerDate);
        } else if (sortCriteria === "views") {
            return b.viewCount - a.viewCount;
        } else if (sortCriteria === "rating") {
            return b.rating - a.rating;
        }
        return 0;
    });

    const displayedLectures = sortedLectures.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

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

    return (
        <div className={styles.container}>
            <SortAndSearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortCriteria={sortCriteria}
                setSortCriteria={setSortCriteria}
                searchCriteria={searchCriteria}
                setSearchCriteria={setSearchCriteria}
            />
            <div className={styles.grid}>
                {displayedLectures.map((lecture) => (
                    <div key={lecture.lecturePackageId} className={styles.cardContainer}>
                        <div className={styles.card}>
                            <div className={styles.thumbnail}>
                                <img src={lecture.thumbnail} alt={lecture.thumbnail} />
                            </div>
                        </div>
                        <div className={styles.details}>
                            <div className={styles.title}>{lecture.title}</div>
                            <div className={styles.rating}>
                                {'별점 '}
                                {renderStars(lecture.rating)}
                            </div>
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

export default LecturePackageList;