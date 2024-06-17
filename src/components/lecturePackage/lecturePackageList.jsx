import React, { useState, useEffect } from "react";
import styles from "../../styles/lecturePackage/lecturePackage.module.css";
import Pagination from "../common/pagination";
import { axiosClient } from "../../axiosApi/axiosClient";
import SortAndSearchBar from "../common/sortAndSearchBar";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import CategoryToggle from "../post/CategoryToggle";
// const [selectedCategory, setSelectedCategory] = useState(null);



const LecturePackageList = ({ onRegisterClick }) => {
    const [lecturePackages, setLecturePackages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortCriteria, setSortCriteria] = useState("latest");
    const [searchCriteria, setSearchCriteria] = useState("title");
    const [filteredAndSortedLectures, setFilteredAndSortedLectures] = useState([]);

    const ITEMS_PER_PAGE = 16;

    const fetchLecturePackages = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/packages');
            const responseData = response.data;
            const dataArray = Array.isArray(responseData) ? responseData : [responseData];

            setLecturePackages(dataArray);
            setFilteredAndSortedLectures(dataArray);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLecturePackages();
    }, []);

    const totalPages = Math.ceil(filteredAndSortedLectures.length / ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        const filteredLectures = lecturePackages.filter((lecture) => {
            if (searchCriteria === "title") {
                return lecture.title.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (searchCriteria === "instructor") {
                return lecture.nickname?.toLowerCase().includes(searchTerm.toLowerCase()); // 여기서 null 체크
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

        setFilteredAndSortedLectures(sortedLectures);
        setCurrentPage(1);
    };

    useEffect(() => {
        handleSearch(); // sortCriteria 변경될 때마다 검색 함수 호출
    }, [sortCriteria]);

    const displayedLectures = filteredAndSortedLectures.slice(
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


    // const handleSelectCategory = (category) => {
    //     setSelectedCategory(category);
    //     // 하위 카테고리를 선택했을 때 추가 동작이 필요하다면 여기에 추가하십시오.
    // };




    return (
        <div className={styles.container}>
            <SortAndSearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortCriteria={sortCriteria}
                setSortCriteria={setSortCriteria}
                searchCriteria={searchCriteria}
                setSearchCriteria={setSearchCriteria}
                onSearch={handleSearch}
            />
            <CategoryToggle/>
            <button className={styles.registerButton} onClick={onRegisterClick}>
                등록하기
            </button>
            <div className={styles.grid}>
                {displayedLectures.map((lecture) => (
                    <div
                        key={lecture.lecturePackageId}
                        className={styles.cardContainer}
                    >
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
            <div className={styles.paginationContainer}>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default LecturePackageList;