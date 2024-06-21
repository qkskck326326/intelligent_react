import React, { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";
import styles from "../../styles/lecturePackage/lecturePackage.module.css";
import { axiosClient } from "../../axiosApi/axiosClient";
import SortAndSearchBar from "../common/sortAndSearchBar";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import CategoryToggle from "./CategoryToggle";
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";

const LecturePackageList = observer(({ onRegisterClick }) => {
  const [lecturePackages, setLecturePackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("latest");
  const [searchCriteria, setSearchCriteria] = useState("title");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const ITEMS_PER_PAGE = 16;

  const fetchLecturePackages = async (
    page,
    size,
    sort,
    search,
    category,
    searchCriteria
  ) => {
    setLoading(true);
    try {
      const params = {
        page: page - 1,
        size: size,
        sortCriteria: sort,
        searchTerm: search,
        searchCriteria: searchCriteria,
      };
      if (category) {
        params.subCategoryId = category.id;
      }
      const response = await axiosClient.get("/packages", { params });
      const responseData = response.data;
      setLecturePackages(responseData.content);
      setTotalPages(responseData.totalPages);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch lecture packages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturePackages(
      currentPage,
      ITEMS_PER_PAGE,
      sortCriteria,
      searchTerm,
      selectedCategory,
      searchCriteria
    );
  }, [currentPage, sortCriteria, selectedCategory]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchLecturePackages(
      1,
      ITEMS_PER_PAGE,
      sortCriteria,
      searchTerm,
      selectedCategory,
      searchCriteria
    ); // 검색 시 첫 페이지로 이동
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    fetchLecturePackages(
      1,
      ITEMS_PER_PAGE,
      sortCriteria,
      searchTerm,
      category,
      searchCriteria
    ); // 카테고리로 검색
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    return (
      <>
        {Array(fullStars)
          .fill(null)
          .map((_, index) => (
            <span key={`full-${index}`} className={styles.star}>
              ⭐
            </span>
          ))}
        {halfStar && <span className={styles.halfStar} />}
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
      <img
        className={styles.banner}
        src="/images/lecture_package_banner.png"
        alt="Logo"
      />
      {(authStore.checkIsTeacher() || authStore.checkIsAdmin()) && (
        <button className={styles.registerButton} onClick={onRegisterClick}>
          패키지 등록하기
        </button>
      )}
      <div className={styles.searchContainer}>
        <CategoryToggle
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
        <SortAndSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortCriteria={sortCriteria}
          setSortCriteria={setSortCriteria}
          searchCriteria={searchCriteria}
          setSearchCriteria={setSearchCriteria}
          onSearch={handleSearch}
        />
      </div>

      <div className={styles.horizontalLine}></div>

      <div className={styles.grid}>
        {lecturePackages.map((lecture) => (
          <div key={lecture.lecturePackageId}>
            <div className={styles.cardContainer}>
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
                  {"별점 "}
                  {renderStars(lecture.rating)}
                </div>
                <div className={styles.info}>
                  <span >
                    <img
                      className={styles.viewCount}
                      src="/images/view_count_icon.png"
                      alt="Logo"
                  />
                  </span> {lecture.viewCount}
                  <span className={styles.packageLevel}>
                    {renderLevelIcon(lecture.packageLevel)}
                    {getLectureLevel(lecture.packageLevel)}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.horizontalLines}></div>
          </div>
        ))}
      </div>
      <Pagination className={styles.paginationContainer}>
        <Pagination.First onClick={() => handlePageChange(1)} />
        <Pagination.Prev
          onClick={() =>
            handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
          }
        />
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() =>
            handlePageChange(
              currentPage < totalPages ? currentPage + 1 : totalPages
            )
          }
        />
        <Pagination.Last onClick={() => handlePageChange(totalPages)} />
      </Pagination>
    </div>
  );
});

export default LecturePackageList;
