import React, { useState, useEffect } from "react";
import {useRouter} from 'next/router';
// import { Pagination } from "react-bootstrap";
import styles from "../../styles/lecturePackage/lecturePackage.module.css";
import { axiosClient } from "../../axiosApi/axiosClient";
import SortAndSearchBar from "../common/sortAndSearchBar";
import Link from "next/link";
// import "bootstrap/dist/css/bootstrap.min.css";
import CategoryToggle from "./CategoryToggle";
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import UploadButton from "../lecturePackage/uploadButton";
import Pagination from "../common/pagination"

const LecturePackageList = observer(({ onRegisterClick }) => {
  const router = useRouter();
  const [lecturePackages, setLecturePackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0); // 전체 아이템 수 상태 추가
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("latest");
  const [searchCriteria, setSearchCriteria] = useState("title");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategoryName, setSelectedSubCategoryName] = useState(""); // 선택된 서브카테고리명 상태 추가



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
        page: page-1,
        size: size,
        sortCriteria: sort || "latest", // 기본값 설정
        searchTerm: search || "",
        searchCriteria: searchCriteria || "title", // 기본값 설정
      };
      if (category) {
        params.subCategoryId = category.id;
      }
      console.log("params : ", params);
      const response = await axiosClient.get("/packages", { params });
      const responseData = response.data;
      setLecturePackages(responseData.content);
      setTotalPages(responseData.totalPages);
      setTotalItems(responseData.totalElements); // 전체 아이템 수 설정


    } catch (err) {
      setError(err);
      console.error("강의 패키지를 가져오지 못했습니다:", err);
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
    console.log("currentPage :", currentPage)
    console.log("ITEMS_PER_PAGE :",ITEMS_PER_PAGE)
    console.log("sortCriteria :",sortCriteria)
    console.log("searchTerm :",searchTerm)
    console.log("selectedCategory :",selectedCategory)
    console.log("searchCriteria :",searchCriteria)
  }, [currentPage, sortCriteria, selectedCategory, searchCriteria]);

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
    setSelectedSubCategoryName(category ? category.name : ""); // 서브카테고리명 상태 업데이트

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

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>에러: {error.message}</p>;

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

  // //결제한 패키지이면 강의 목록으로 이동.
  // const handleLectureList = (lecturePackageId) => {
  //   router.push({
  //     pathname: '/lecture/list',
  //     query: {lecturePackageId}
  //   });
  // };




  return (
      <div className={styles.container}>
        <img
            className={styles.banner}
            src="/images/lecture_package_banner.png"
            alt="Logo"
        />

        <div className={styles.searchContainer}>
          <div className={styles.categoryContainer}>
            <CategoryToggle
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
            />
            <span className={styles.selectedSubCategoryName}>
            {selectedSubCategoryName} [{totalItems}개]
          </span>{" "}
            {/* 선택된 서브카테고리명과 패키지 수 표시 */}
          </div>
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

                    <div className={styles.title}> {/*결제한 패키지면 강의목록으로 이동*/}

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
                          {lecture.viewCount}
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

        <div className={styles.paginationContainer}>
          {/*<Pagination className={styles.paginationWrapper}>*/}
          {/*  <Pagination.First onClick={() => handlePageChange(1)}/>*/}
          {/*  <Pagination.Prev*/}
          {/*      onClick={() =>*/}
          {/*          handlePageChange(currentPage > 1 ? currentPage - 1 : 1)*/}
          {/*      }*/}
          {/*  />*/}
          {/*  {Array.from({length: totalPages}, (_, i) => (*/}
          {/*      <Pagination.Item*/}
          {/*          key={i + 1}*/}
          {/*          active={i + 1 === currentPage}*/}
          {/*          onClick={() => handlePageChange(i + 1)}*/}
          {/*      >*/}
          {/*        {i + 1}*/}
          {/*      </Pagination.Item>*/}
          {/*  ))}*/}
          {/*  <Pagination.Next*/}
          {/*      onClick={() =>*/}
          {/*          handlePageChange(*/}
          {/*              currentPage < totalPages ? currentPage + 1 : totalPages*/}
          {/*          )*/}
          {/*      }*/}
          {/*  />*/}
          {/*  <Pagination.Last onClick={() => handlePageChange(totalPages)} />*/}
          {/*</Pagination>*/}

          <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
          />
        </div>
        {(authStore.checkIsTeacher() || authStore.checkIsAdmin()) && (
            <UploadButton
                onLoginRequired={onRegisterClick}
                onRegisterClick={onRegisterClick}
            />
        )}
      </div>
  );
});

export default LecturePackageList;