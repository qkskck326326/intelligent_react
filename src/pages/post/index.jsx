import React, { useState } from "react";
import PostSearch from "../../components/post/postSearchBar";
import postSideBar from "../../components/post/postSearchBar";
import Sidebar from "../../components/post/postSideBar";
import postList from "../../components/post/postList";
import CategoryToggle from "../../components/post/CategoryToggle";
const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    // 하위 카테고리를 선택했을 때 추가 동작이 필요하다면 여기에 추가하십시오.
  };
  return (
    <div>
      <h1>Post Page</h1>
      <CategoryToggle
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
      <PostSearch />
      <postList />
    </div>
  );
};

export default Index;
