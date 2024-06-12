import React, { useState } from "react";
import PostSearch from "../../components/post/postSearchBar";
import Sidebar from "../../components/post/postSideBar"; // Corrected import
import PostList from "../../components/post/PostList"; // Corrected import
import CategoryToggle from "../../components/post/CategoryToggle";
import styles from "../../components/post/PostIndex.module.css"; // Import the CSS file

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    // 하위 카테고리를 선택했을 때 추가 동작이 필요하다면 여기에 추가하십시오.
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        {/* <PostSearch /> */}
        <CategoryToggle
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
        <PostList />
      </div>
    </div>
  );
};

export default Index;
