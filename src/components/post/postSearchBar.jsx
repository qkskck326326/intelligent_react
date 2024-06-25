import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "./PostSearch.module.css";
import { IoIosSearch } from "react-icons/io";

const PostSearch = ({ onSearch, onSelectCategory, onSortOrderChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [upperCategories, setUpperCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedUpperCategory, setSelectedUpperCategory] = useState(null);
  const [isUpperCategoryVisible, setIsUpperCategoryVisible] = useState(false);

  useEffect(() => {
    axiosClient
      .get("/categories/upper")
      .then((response) => {
        setUpperCategories(response.data);
        console.log("upperCategory : ", response.data);
      })
      .catch((error) => {
        console.error("상위카테고리를 불러오지 못했습니다!", error);
      });
  }, []);

  useEffect(() => {
    if (selectedUpperCategory) {
      axiosClient
        .get(`/categories/sub/${selectedUpperCategory.id}`)
        .then((response) => {
          setSubCategories(response.data);
          console.log("subCategory : ", response.data);
        })
        .catch((error) => {
          console.error("하위카테고리를 불러오지 못했습니다!", error);
        });
    }
  }, [selectedUpperCategory]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleUpperCategoryClick = (category) => {
    if (selectedUpperCategory && selectedUpperCategory.id === category.id) {
      setSelectedUpperCategory(null);
    } else {
      setSelectedUpperCategory(category);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
      <div className={styles.categoryToggle}>
        <div className={styles.flexContainer}>
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownToggle}
              type="button"
              onClick={() => {
                setIsUpperCategoryVisible(!isUpperCategoryVisible);
                if (isUpperCategoryVisible) {
                  setSelectedUpperCategory(null);
                }
              }}
            >
              카테고리 검색
            </button>
            {isUpperCategoryVisible && (
              <div
                className={`${styles.dropdownMenu} ${styles.customGradient}`}
              >
                <button
                  className={`${styles.dropdownItem}`}
                  onClick={() => onSelectCategory(null)}
                >
                  전체검색
                </button>
                {upperCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`${styles.dropdownItem} ${
                      selectedUpperCategory &&
                      selectedUpperCategory.id === category.id
                        ? styles.dropdownItemActive
                        : ""
                    }`}
                    onClick={() => handleUpperCategoryClick(category)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedUpperCategory && isUpperCategoryVisible && (
            <div className={styles.dropdown}>
              <div
                className={`${styles.dropdownMenu} ${styles.customGradient}`}
              >
                {subCategories.map((subCategory) => (
                  <button
                    key={subCategory.id}
                    className={styles.dropdownItem}
                    onClick={() => {
                      console.log(`Selected subcategory: ${subCategory.name}`);
                      onSelectCategory(subCategory);
                    }}
                  >
                    {subCategory.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <select className={styles.sortOrderSelect} onChange={onSortOrderChange}>
        <option value="latest">최신순</option>
        <option value="views">조회수 순</option>
        <option value="likes">좋아요 순</option>
        <option value="comments">댓글 순</option>
      </select>
      <div className={styles.searchInputContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="제목+내용으로 검색해보세요"
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          <IoIosSearch />
        </button>
      </div>
    </form>
  );
};

export default PostSearch;
