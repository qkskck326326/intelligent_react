import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../styles/lecturePackage/CategoryToggle.module.css";

const CategoryToggle = ({ selectedCategory, onSelectCategory }) => {
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
                console.error("상위카테고리를 불러오지못했습니다!", error);
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
                    console.error("There was an error fetching the sub categories!", error);
                });
        }
    }, [selectedUpperCategory]);

    const handleUpperCategoryClick = (category) => {
        if (selectedUpperCategory && selectedUpperCategory.id === category.id) {
            setSelectedUpperCategory(null); // 하위 카테고리 숨기기
        } else {
            setSelectedUpperCategory(category);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex">
                <div className="dropdown me-2">
                    <button
                        className={`btn btn-primary dropdown-toggle ${styles.dropdownToggle}`}
                        type="button"
                        onClick={() => {
                            setIsUpperCategoryVisible(!isUpperCategoryVisible);
                            if (isUpperCategoryVisible) {
                                setSelectedUpperCategory(null); // 상위 카테고리를 숨길 때 하위 카테고리도 숨기기
                            }
                        }}
                    >
                        카테고리 검색
                    </button>
                    {isUpperCategoryVisible && (
                        <div className={`dropdown-menu show ${styles.dropdownMenu} ${styles.customGradient}`}>
                            {upperCategories.map((category) => (
                                <button
                                    key={category.id}
                                    className={`dropdown-item ${
                                        selectedUpperCategory &&
                                        selectedUpperCategory.id === category.id
                                            ? styles.dropdownItemActive
                                            : ""
                                    } ${styles.dropdownItem}`}
                                    onClick={() => handleUpperCategoryClick(category)}
                                >
                                    {category.name}
                                </button>
                            ))}
                            <button
                                className={styles.allCategories}
                                onClick={() => {
                                    onSelectCategory(null); // 모든 카테고리 선택 시
                                    setIsUpperCategoryVisible(false); // 드롭다운 닫기
                                }}
                            >
                                모든 카테고리
                            </button>
                        </div>
                    )}
                </div>
                {selectedUpperCategory && isUpperCategoryVisible && (
                    <div className="dropdown">
                        <div className={`dropdown-menu show ${styles.dropdownMenu} ${styles.customGradient}`}>
                            {subCategories.map((subCategory) => (
                                <button
                                    key={subCategory.id}
                                    className={`dropdown-item ${styles.dropdownItem}`}
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
    );
};

export default CategoryToggle;