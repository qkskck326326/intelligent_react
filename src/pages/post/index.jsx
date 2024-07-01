import React, { useState } from "react";
import PostList from "../../components/post/postList"; // Corrected import
import styles from "../../components/post/PostIndex.module.css"; // Import the CSS file
import PopularPosts from "../../components/post/PopularPosts";
import PopularTags from "../../components/post/PopularTags";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    // 하위 카테고리를 선택했을 때 추가 동작이 필요하다면 여기에 추가하십시오.
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>공유게시판 커뮤니티 기능을 활용해보세요</h1>
          <br />
          <h2>
            지식을 공유하고 질문을 하며 다같이 성장하는 커뮤니티를 만들어보아요!
          </h2>
        </div>
        <div className={styles.content}>
          <div className={styles.sidebar}>
            <PopularPosts />
            <PopularTags />
          </div>
          <div className={styles.mainContent}>
            <PostList
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
