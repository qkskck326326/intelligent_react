import React, { useState } from "react";
import PostList from "../../components/post/postList"; // Corrected import
import styles from "../../components/post/PostIndex.module.css"; // Import the CSS file
import PopularPosts from "../../components/post/PopularPosts";
import "../../components/post/LoginPopup.module.css";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    // 하위 카테고리를 선택했을 때 추가 동작이 필요하다면 여기에 추가하십시오.
  };

  return (
    <div>
      {/* <header className={styles.header}>
        <div className={styles.headerImageContainer}>
          <img
            src="/images/postMain4.png"
            alt="Header Banner"
            className={styles.headerImage}
          />
        </div>
      </header> */}
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>공유게시판</h1>
        </div>
        <div className={styles.popularPosts}>
          <PopularPosts />
        </div>
        {/* <div className={styles.mainContent}> */}
        <PostList
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
        {/* </div> */}
      </div>
    </div>
  );
};

export default Index;
