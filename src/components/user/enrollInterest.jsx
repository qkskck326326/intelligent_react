// EnrollInterest.js
import React, { useState, useEffect } from 'react';
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from '../../styles/user/enroll/enrollInterest.module.css';

const EnrollInterest = ({ nextPage, prevPage, basicInfo, setBasicInfo }) => {
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosClient.get('/categories/sub'); // Spring Boot 엔드포인트 호출
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (category) => {
        let updatedSelected;
        if (selected.some(cat => cat.id === category.id)) {
            updatedSelected = selected.filter(cat => cat.id !== category.id);
        } else {
            updatedSelected = [...selected, category];
        }
        setSelected(updatedSelected);
        setBasicInfo(prevState => ({ ...prevState, interests: updatedSelected }));
    };

    return (
        <div className={styles.enrollInterestBigContainer}>
            <div className={styles.enrollInterestContainer}>
                <h2>{basicInfo.nickname} 님의 관심 분야를 골라주세요!</h2>
                <div className={styles.categoryContainer}>
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                            className={`${styles.categoryButton} ${selected.some(cat => cat.id === category.id) ? styles.selected : ''}`}
                        >
                            {category.name}
                        </div>
                    ))}
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.prevButton} onClick={prevPage}>이전</button>
                    <button className={styles.navigationButton} onClick={nextPage}>얼굴 등록</button>
                    <button className={styles.navigationButton} onClick={() => {/* 계정 생성 로직 추가 */}}>계정 생성</button>
                </div>
            </div>
        </div>
    );
};

export default EnrollInterest;
