import React, { useEffect, useState } from "react";
import Link from "next/link";
import DOMPurify from "dompurify"; // Import DOMPurify
import { axiosClient } from "../../axiosApi/axiosClient";
import { Pagination } from "react-bootstrap";
import styles from "./PostList.module.css";
import { TbEyeSearch } from "react-icons/tb";
import { AiOutlineLike, AiOutlineComment } from "react-icons/ai";
import PostSearch from "../../components/post/postSearchBar";
import LoginPopup from "../../components/post/LoginPopup"; // 새로운 팝업 컴포넌트 임포트
import authStore from "../../stores/authStore"; // AuthStore 임포트
import { observer } from "mobx-react-lite";
import UploadButton from "../../components/post/PostUploadBtn"; // UploadButton 컴포넌트 임포트
import { getRelativeTime } from "../../components/post/timeUtils"; // 유틸리티 함수 임포트
import CategoryToggle from "../../components/post/CategoryToggle";

const PostList = observer(({ selectedCategory, onSelectCategory }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showPopup, setShowPopup] = useState(false); // 팝업 상태

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get("/posts/list", {
          params: { page: page, size: size },
        });
        setPosts(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        console.log(res.data.content);
      } catch (error) {
        console.error("게시물 로드 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, size]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handlePostClick = (e, postId) => {
    if (!authStore.checkIsLoggedIn()) {
      e.preventDefault();
      setShowPopup(true);
    }
  };

  const handleUploadClick = () => {
    setShowPopup(true);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    // 하위 카테고리를 선택했을 때 추가 동작이 필요하다면 여기에 추가하십시오.
  };

  return (
    <div className={styles.postListContainer}>
      <h1 className={styles.title}>Posts</h1>
      <CategoryToggle
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
      <PostSearch />
      {loading ? (
        <h2 className={styles.loading}>Loading...</h2>
      ) : (
        <ul className={styles.postList}>
          {posts.map((post) => (
            <li key={post.id} className={styles.postItem}>
              <Link href={`/post/${post.id}`} passHref>
                <div
                  className={styles.postLink}
                  onClick={(e) => handlePostClick(e, post.id)}
                >
                  <div className={styles.postHeader}>
                    <div className={styles.postAvatar}>
                      <img
                        src={post.profileImageUrl}
                        className={styles.profileImage}
                      />
                    </div>
                    <div className={styles.postMeta}>
                      <span className={styles.postNickname}>
                        {post.nickname}
                      </span>
                      <span className={styles.postCategory}>
                        {post.categoryName}
                      </span>
                    </div>
                    <div className={styles.postTime}>
                      {getRelativeTime(post.postTime)}
                    </div>
                  </div>
                  <h5 className={styles.postTitle}>{post.title}</h5>
                  <p
                    className={styles.postSnippet}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(post.contentSnippet),
                    }}
                  >
                    {/* {post.contentSnippet}.... */}
                  </p>
                  {/* <p
        className={styles.postContent}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.contentSnippet) }} // Use DOMPurify to sanitize the content
      ></p> */}
                  <div className={styles.postFooter}>
                    <div className={styles.postStats}>
                      <span>
                        <AiOutlineLike size={25} /> {post.likeCount}
                      </span>
                      <span>
                        <AiOutlineComment size={25} /> {post.commentCount}
                      </span>
                      <span>
                        <TbEyeSearch size={25} /> {post.viewCount}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Pagination>
        <Pagination.First
          onClick={() => handlePageChange(0)}
          disabled={page === 0}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        />
        {[...Array(totalPages).keys()].map((i) => (
          <Pagination.Item
            key={i}
            active={i === page}
            onClick={() => handlePageChange(i)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages - 1}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={page === totalPages - 1}
        />
      </Pagination>
      <div className={styles.uploadButton}>
        <UploadButton onLoginRequired={handleUploadClick} />
      </div>
      <LoginPopup show={showPopup} handleClose={() => setShowPopup(false)} />
    </div>
  );
});

export default PostList;
