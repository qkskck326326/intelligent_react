import React, { useEffect, useState } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "./PostList.module.css";
import { TbEyeSearch } from "react-icons/tb";
import {
  AiOutlineLike,
  AiOutlineComment,
  AiOutlineStar,
  AiFillStar,
} from "react-icons/ai";
import { FaRegListAlt } from "react-icons/fa";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import PostSearch from "./PostSearchBar";
import authStore from "../../stores/authStore";
import { observer } from "mobx-react-lite";
import UploadButton from "../../components/post/PostUploadBtn";
import { getRelativeTime } from "../../components/post/timeUtils";
import { IoHeartSharp } from "react-icons/io5";

const PostList = observer(({ selectedCategory, onSelectCategory }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("titleContent");
  const [showPopup, setShowPopup] = useState(false);
  const [sortOrder, setSortOrder] = useState("latest");
  const [filter, setFilter] = useState(""); // 추가: 필터 상태
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set()); // 북마크된 게시물 상태 추가
  const [myPostsCount, setMyPostsCount] = useState(0); // 내 게시글 수 상태 추가
  const [bookmarkCount, setBookmarkCount] = useState(0); // 북마크 수 상태 추가

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = searchQuery
          ? searchType === "titleContent"
            ? await axiosClient.get("/posts/searchTitleOrContent", {
                params: {
                  keyword: searchQuery,
                  page: page,
                  size: size,
                  sort: sortOrder,
                },
              })
            : await axiosClient.get("/posts/searchByTag", {
                params: {
                  tag: searchQuery,
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
          : filter === "myPosts"
          ? await axiosClient.get("/posts/myPosts", {
              params: {
                userEmail: authStore.getUserEmail(),
                provider: authStore.getProvider(),
                page: page,
                size: size,
                sort: sortOrder,
              },
            })
          : filter === "bookmarks"
          ? await axiosClient.get("/posts/bookmarks", {
              params: {
                userEmail: authStore.getUserEmail(),
                provider: authStore.getProvider(),
                page: page,
                size: size,
                sort: sortOrder,
              },
            })
          : await axiosClient.get("/posts/list", {
              params: { page: page, size: size, sort: sortOrder },
            });
        console.log(res.data.content);
        setPosts(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        // 내 게시글 수 업데이트
        if (!filter || filter === "myPosts") {
          const myPostsRes = await axiosClient.get("/posts/myPosts", {
            params: {
              userEmail: authStore.getUserEmail(),
              provider: authStore.getProvider(),
              page: 0,
              size: 1000,
              sort: "latest",
            },
          });
          setMyPostsCount(myPostsRes.data.totalElements || 0);
        }
        // 북마크 상태 업데이트
        const bookmarkRes = await axiosClient.get("/posts/bookmarks", {
          params: {
            userEmail: authStore.getUserEmail(),
            provider: authStore.getProvider(),
            page: 0,
            size: 1000,
            sort: "latest",
          },
        });
        const bookmarkedIds = new Set(
          bookmarkRes.data.content.map((post) => post.id)
        );
        setBookmarkedPosts(bookmarkedIds);
        setBookmarkCount(bookmarkRes.data.totalElements || 0); // 북마크 수 업데이트
      } catch (error) {
        console.error("게시물 로드 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [
    page,
    size,
    searchQuery,
    selectedCategory,
    sortOrder,
    filter,
    searchType,
  ]); // 추가: searchType 의존성 추가

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

  const handleSearch = (query, type) => {
    setSearchQuery(query);
    setSearchType(type);
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

  const isOwner = () => {
    return (
      authStore.getUserEmail() === posts?.userEmail &&
      authStore.getProvider() === posts?.provider
    );
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(0);
  };

  const handleBookmarkClick = async (postId) => {
    if (!authStore.checkIsLoggedIn()) {
      setShowPopup(true);
      return;
    }
    try {
      if (bookmarkedPosts.has(postId)) {
        await axiosClient.delete("/posts/bookmark", {
          data: {
            postId,
            userEmail: authStore.getUserEmail(),
            provider: authStore.getProvider(),
          },
        });
        setBookmarkedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
        setBookmarkCount((prev) => prev - 1); // 북마크 수 감소
      } else {
        await axiosClient.post("/posts/bookmark", {
          postId,
          userEmail: authStore.getUserEmail(),
          provider: authStore.getProvider(),
        });
        setBookmarkedPosts((prev) => new Set(prev).add(postId));
        setBookmarkCount((prev) => prev + 1); // 북마크 수 증가
      }
    } catch (error) {
      console.error("북마크 처리 중 오류 발생:", error);
    }
  };

  return (
    <div className={styles.postListContainer}>
      <div className={styles.filterButtons}>
        <div
          className={`${styles.filterButton} ${
            filter === "" ? styles.active : ""
          }`}
          onClick={() => handleFilterChange("")}
        >
          <FaRegListAlt size={25} />
          <span>전체 게시글</span>
        </div>
        <div
          className={`${styles.filterButton} ${
            filter === "myPosts" ? styles.active : ""
          }`}
          onClick={() => handleFilterChange("myPosts")}
        >
          <FaRegListAlt size={25} />
          <span>내 게시글 {myPostsCount}</span>
        </div>
        <div
          className={`${styles.filterButton} ${
            filter === "bookmarks" ? styles.active : ""
          }`}
          onClick={() => handleFilterChange("bookmarks")}
        >
          <BsBookmark size={25} />
          <span>북마크 {bookmarkCount}</span>
        </div>
      </div>
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
                    <span className={styles.postNickname}>{post.nickname}</span>
                    <span className={styles.postCategory}>
                      {post.categoryName}
                    </span>
                  </div>
                  <div className={styles.postTime}>
                    {getRelativeTime(post.postTime)}
                  </div>
                  <div
                    className={styles.bookmarkIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmarkClick(post.id);
                    }}
                  >
                    {bookmarkedPosts.has(post.id) ? (
                      <BsFillBookmarkFill size={25} color="gold" />
                    ) : (
                      <BsBookmark size={25} color="#686868" />
                    )}
                  </div>
                </div>
                <Link
                  href={`/post/${post.id}`}
                  passHref
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className={styles.tagContainer}>
                    {post.tags.map((tag, index) => (
                      <div key={index} className={styles.tagItem}>
                        #{tag}
                      </div>
                    ))}
                  </div>

                  <h5 className={styles.postTitle}>{post.title}</h5>
                  <p
                    className={styles.postSnippet}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(post.contentSnippet),
                    }}
                  ></p>
                </Link>
                <div className={styles.postFooter}>
                  <div className={styles.postStats}>
                    <span>
                      <IoHeartSharp size={25} style={{ fill: "#bc3535" }} />
                      {post.likeCount}
                    </span>
                    <span>
                      <AiOutlineComment size={25} color="#686868" />{" "}
                      {post.commentCount}
                    </span>
                    <span>
                      <TbEyeSearch size={25} color="#686868" /> {post.viewCount}
                    </span>
                  </div>
                </div>
              </div>
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
    </div>
  );
});

export default PostList;
