import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "./CategoryToggle.module.css"; // CSS Modules 사용

const CategoryToggle = ({ selectedCategory, onSelectCategory }) => {
  //이 컴포넌트는 두 개의 props selectedCategory와 onSelectCategory를 받습니다.
  const [upperCategories, setUpperCategories] = useState([]);
  //upperCategories: 상위 카테고리 목록을 저장하는 상태, 초기값은 빈 배열입니다.
  const [subCategories, setSubCategories] = useState([]);
  //subCategories: 하위 카테고리 목록을 저장하는 상태, 초기값은 빈 배열
  const [selectedUpperCategory, setSelectedUpperCategory] = useState(null);
  //selectedUpperCategory: 선택된 상위 카테고리를 저장하는 상태, 초기값은 null
  const [isUpperCategoryVisible, setIsUpperCategoryVisible] = useState(false);
  //isUpperCategoryVisible: 상위 카테고리 목록의 가시성을 제어하는 상태, 초기값은 false

  useEffect(() => {
    axiosClient
      .get("/categories/upper")
      //axiosClient를 사용하여 /categories/upper 엔드포인트에서 상위 카테고리 목록을 가져옴
      .then((response) => {
        setUpperCategories(response.data);
      })
      //성공적으로 데이터를 가져오면 setUpperCategories를 사용하여 upperCategories 상태를 업데이트

      //오류가 발생하면 콘솔에 오류 메시지를 출력
      .catch((error) => {
        console.error(
          "There was an error fetching the upper categories!",
          error
        );
      });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      axiosClient
        .get(`/categories/sub/${selectedCategory.id}`)
        //selectedCategory가 변경될 때마다 실행됨.
        //selectedCategory가 존재하면 axiosClient를 사용하여 /categories/sub/${selectedCategory.id}
        // 엔드포인트에서 하위 카테고리 목록을 가져옵
        .then((response) => {
          setSubCategories(response.data);
          //성공적으로 데이터를 가져오면 setSubCategories를 사용하여 subCategories 상태를 업데이트
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the sub categories!",
            error
          );
        });
    }
  }, [selectedCategory]);

  return (
    <div className={styles.categoryToggle}>
      {/* 버튼을 클릭하면 isUpperCategoryVisible 상태가 토글됨 */}
      <button
        className={styles.categoryButton}
        onClick={() => setIsUpperCategoryVisible(!isUpperCategoryVisible)}
        // isUpperCategoryVisible이 true일 때만 상위 카테고리 목록이 표시됩
      >
        카테고리 검색
      </button>
      {isUpperCategoryVisible && (
        <div className={styles.upperCategories}>
          {upperCategories.map((category) => (
            //upperCategories 상태에 저장된 상위 카테고리 목록을 map 함수를 사용하여 렌더링
            <button
              key={category.id}
              className={
                selectedUpperCategory &&
                selectedUpperCategory.id === category.id
                  ? styles.selected
                  : ""
              }
              onClick={() => setSelectedUpperCategory(category)}
              //각 상위 카테고리 버튼은 클릭 시 setSelectedUpperCategory를 사용하여 해당 카테고리를 선택
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
      {selectedUpperCategory && (
        <div className={styles.subCategories}>
          {subCategories.map((subCategory) => (
            <button
              key={subCategory.id}
              onClick={() => {
                // 하위 카테고리를 선택했을 때의 동작을 정의할 수 있습니다.
                console.log(`Selected subcategory: ${subCategory.name}`);
              }}
            >
              {subCategory.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryToggle;
