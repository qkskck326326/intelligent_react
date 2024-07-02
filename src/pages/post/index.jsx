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
          <h1>공유게시판 커뮤니티 기능을 활용해보세요.</h1>
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

          {/* <div className={styles.rightSidebar}>
            <h4>도움말</h4>
            
            <div className={styles.guideDetails}>
              <h4>게시글을 어떻게 작성하나요?</h4>
              <p>게시물 목록 오른쪽 작성아이콘을 클릭하여 글을 작성해보세요.</p>
              <h4>댓글은 어디서 등록할 수 있나요?</h4>
              <p>
                관심있는 게시글에 댓글을 남겨보세요. 의견을 나누고 토론을 통해
                더 많은 정보를 얻을 수 있답니다.
              </p>
              <h4>북마크는 어디서 하나요?</h4>
              <p>
                중요한 게시글을 북마크하여 나중에 다시 확인할 수 있습니다.
                게시글 오른쪽 상단의 북마크 아이콘을 클릭하세요.
              </p>
              <h4></h4>
              <p>
                인기 게시글과 태그를 확인하여 최신 트렌드를 파악하세요. 인기
                글과 태그는 사이드바에서 확인할 수 있습니다.
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Index;
