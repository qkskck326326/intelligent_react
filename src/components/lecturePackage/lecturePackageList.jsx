import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import styles from "../../styles/lecturePackage/lecturePackage.module.css";
import Pagination from "../common/pagination";
import { axiosClient } from "../../axiosApi/axiosClient";
import SortAndSearchBar from "../common/sortAndSearchBar"; // 검색창 및 드롭다운 컴포넌트 추가
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';

const LecturePackageList = () => {
    const [lecturePackages, setLecturePackages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortCriteria, setSortCriteria] = useState("latest");
    const [searchCriteria, setSearchCriteria] = useState("title");
    const [filteredAndSortedLectures, setFilteredAndSortedLectures] = useState([]);
    const router = useRouter();

    const ITEMS_PER_PAGE = 16; // 한 페이지에 16개의 항목 표시

    const fetchLecturePackages = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/packages');
            const responseData = response.data;
            const dataArray = Array.isArray(responseData) ? responseData : [responseData];

            setLecturePackages(dataArray);
            setFilteredAndSortedLectures(dataArray); // 초기값 설정
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
            if (searchCriteria === "title") {  //검색이 제목이라면!
                return lecture.title.toLowerCase().includes(searchTerm.toLowerCase()); //검색창에 입력한 값과 리스트의 제목과 일치하면 반환
            } else if (searchCriteria === "instructor") { // 검색이 작성자라면
                return lecture.nickname.toLowerCase().includes(searchTerm.toLowerCase());//검색창에 입력한 값과 리스트의 강사와 일치하면 반환
            }
            return true;
        });

        //정렬클릭 한다면 sortCriteria에 해당하는 값으로 정렬해줌.
        const sortedLectures = [...filteredLectures].sort((a, b) => {
            if (sortCriteria === "latest") {
                return new Date(b.registerDate) - new Date(a.registerDate);
            } else if (sortCriteria === "views") {
                return b.viewCount - a.viewCount;
            } else if (sortCriteria === "rating") {
                return b.rating - a.rating;  //두 강의의 평점을 비교하여 배열을 내림차순으로 정렬하기 위한 연산임.
            }
            return 0;
        });

        setFilteredAndSortedLectures(sortedLectures);
        setCurrentPage(1); // 새로운 검색 결과가 나올 때 첫 페이지로 이동
    };

    const displayedLectures = filteredAndSortedLectures.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const renderStars = (rating) => {
        //평점에서 꽉 찬 별의 개수를 구함.
        const fullStars = Math.floor(rating); //rating값을 내림하여 정수 부분만 함.
        // 평점에서 반 별이 필요한지 여부를 구함.
        const halfStar = rating % 1 >= 0.5;  //rating % 1은 rating값의 소수부분을 구함. 소수부분이 0.5이상이면 별을 표시함.(true)

        //별을 렌더링함.
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
                onSearch={handleSearch}
            />
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
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default LecturePackageList;