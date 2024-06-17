import React from "react";
import styles from "../../styles/common/sortAndSearchBar.module.css";

const SortAndSearchBar = ({ searchTerm, setSearchTerm, sortCriteria, setSortCriteria, searchCriteria, setSearchCriteria, onSearch }) => {
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortCriteria(e.target.value);
        onSearch();
    };

    const handleSearchCriteriaChange = (e) => {
        setSearchCriteria(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className={styles.sortAndSearchBar}>
            <select className={styles.dropdown} value={sortCriteria} onChange={handleSortChange}>
                <option className={styles.dropdownDetail} value="latest">최신순</option>
                <option className={styles.dropdownDetail} value="views">조회순</option>
                <option className={styles.dropdownDetail} value="rating">별점순</option>
            </select>
            <select className={styles.dropdown} value={searchCriteria} onChange={handleSearchCriteriaChange}>
                <option className={styles.dropdownDetail} value="title">제목</option>
                <option className={styles.dropdownDetail} value="instructor">강사</option>
            </select>
            <div className={styles.searchBar}>
                <div className={styles.icon} onClick={onSearch}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-search"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="수강하고 싶은 패키지를 검색해 주세요."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
};

export default SortAndSearchBar;