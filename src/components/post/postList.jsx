import React, { useEffect, useState } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "./PostList.module.css";
import { TbEyeSearch } from "react-icons/tb";
import { AiOutlineLike, AiOutlineComment } from "react-icons/ai";
import PostSearch from "../../components/post/postSearchBar";
import LoginPopup from "../../components/post/LoginPopup";
import authStore from "../../stores/authStore";
import { observer } from "mobx-react-lite";
import UploadButton from "../../components/post/PostUploadBtn";
import { getRelativeTime } from "../../components/post/timeUtils";
import "./LoginPopup.module.css";

const PostList = observer(({ selectedCategory, onSelectCategory }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [sortOrder, setSortOrder] = useState("latest");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = searchQuery
          ? await axiosClient.get("/posts/searchTitleOrContent", {
              params: {
                keyword: searchQuery,
                page: page,
                size: size,
                sort: sortOrder,
              },
            })
          : selectedCategory
          ? await axiosClient.get("/posts/searchlistByCategory", {
              params: {
                categoryId: selectedCategory.id,
                page: page,
                size: size,
                sort: sortOrder,
              },
            })
          : await axiosClient.get("/posts/list", {
              params: { page: page, size: size, sort: sortOrder },
            });
        setPosts(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      } catch (error) {
        console.error("게시물 로드 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, size, searchQuery, selectedCategory, sortOrder]);

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

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(0);
  };

  const handleCategorySelect = (category) => {
    onSelectCategory(category);
    setPage(0);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setPage(0);
  };

  return (
    <div className={styles.postListContainer}>
      <PostSearch
        onSearch={handleSearch}
        onSelectCategory={handleCategorySelect}
        onSortOrderChange={handleSortOrderChange}
      />
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
                  ></p>
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
      <ul className={styles.pagination}>
        <li>
          <button onClick={() => handlePageChange(0)} disabled={page === 0}>
            {"<<"}
          </button>
        </li>
        <li>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
          >
            {"<"}
          </button>
        </li>
        {[...Array(totalPages).keys()].map((i) => (
          <li key={i} className={i === page ? styles.active : ""}>
            <button onClick={() => handlePageChange(i)}>{i + 1}</button>
          </li>
        ))}
        <li>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages - 1}
          >
            {">"}
          </button>
        </li>
        <li>
          <button
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={page === totalPages - 1}
          >
            {">>"}
          </button>
        </li>
      </ul>
      <div className={styles.uploadButton}>
        <UploadButton onLoginRequired={handleUploadClick} />
      </div>
      <LoginPopup show={showPopup} handleClose={() => setShowPopup(false)} />
    </div>
  );
});

export default PostList;
