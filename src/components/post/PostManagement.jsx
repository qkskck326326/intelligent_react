import React, { useEffect, useState } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import authStore from "../../stores/authStore";
import styles from "./PostManagement.module.css";
import { observer } from "mobx-react-lite";
import { FaRegListAlt, FaRegCommentDots } from "react-icons/fa";
import { BsBookmark } from "react-icons/bs";
import DOMPurify from "dompurify";
import { getRelativeTime } from "../../components/post/timeUtils";
import Link from "next/link";

const PAGE_SIZE = 10;

const PostManagement = observer(() => {
  const [filter, setFilter] = useState("myPosts");
  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [myBookmarks, setMyBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [postCount, setPostCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  const fetchData = async (newPage = 0, currentFilter = filter) => {
    setLoading(true);
    try {
      let res;
      if (currentFilter === "myPosts") {
        res = await axiosClient.get("/posts/myPosts", {
          params: {
            userEmail: authStore.getUserEmail(),
            provider: authStore.getProvider(),
            page: newPage,
            size: PAGE_SIZE,
            sort: "latest",
          },
        });
        if (newPage === 0) {
          setMyPosts(res.data.content || []);
          setPostCount(res.data.totalElements || 0);
        } else {
          setMyPosts((prev) => [...prev, ...res.data.content]);
        }
      } else if (currentFilter === "myComments") {
        res = await axiosClient.get("/posts/comments/myComments", {
          params: {
            userEmail: authStore.getUserEmail(),
            provider: authStore.getProvider(),
            page: newPage,
            size: PAGE_SIZE,
            sort: "latest",
          },
        });
        if (newPage === 0) {
          setMyComments(res.data || []);
          setCommentCount(res.data.length || 0);
        } else {
          setMyComments((prev) => [...prev, ...res.data]);
        }
      } else if (currentFilter === "myBookmarks") {
        res = await axiosClient.get("/posts/bookmarks", {
          params: {
            userEmail: authStore.getUserEmail(),
            provider: authStore.getProvider(),
            page: newPage,
            size: PAGE_SIZE,
            sort: "latest",
          },
        });
        if (newPage === 0) {
          setMyBookmarks(res.data.content || []);
          setBookmarkCount(res.data.totalElements || 0);
        } else {
          setMyBookmarks((prev) => [...prev, ...res.data.content]);
        }
      }
      setHasMore(res.data.content.length === PAGE_SIZE);
    } catch (error) {
      console.error("데이터 로드 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchData(0, "myPosts");
      await fetchData(0, "myComments");
      await fetchData(0, "myBookmarks");
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    setPage(0);
    fetchData(0);
  }, [filter]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage);
  };

  const renderContent = () => {
    if (loading && page === 0) {
      return <h2>Loading...</h2>;
    }

    if (filter === "myPosts") {
      return (
        <ul className={styles.postList}>
          {myPosts.map((post) => (
            <li key={post.id} className={styles.postItem}>
              <div className={styles.postLink}>
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
              </div>
            </li>
          ))}
        </ul>
      );
    } else if (filter === "myComments") {
      return (
        <ul className={styles.commentList}>
          {myComments.map((comment) => (
            <li key={comment.id} className={styles.commentItem}>
              <div className={styles.postHeader}>
                <div className={styles.postAvatar}>
                  <img
                    src={comment.profileImageUrl}
                    className={styles.profileImage}
                  />
                </div>
                <div className={styles.postMeta}>
                  <span className={styles.postNickname}>
                    {comment.nickname}
                  </span>
                </div>
                <div className={styles.postTime}>
                  {getRelativeTime(comment.commentTime)}
                </div>
              </div>
              <Link
                href={`/post/${comment.postId}`}
                passHref
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <p>{comment.content}</p>
              </Link>
            </li>
          ))}
        </ul>
      );
    } else if (filter === "myBookmarks") {
      return (
        <ul className={styles.postList}>
          {myBookmarks.map((post) => (
            <li key={post.id} className={styles.postItem}>
              <div className={styles.postLink}>
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
              </div>
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div className={styles.postManagementContainer}>
      <div className={styles.filterButtons}>
        <button
          className={`${styles.filterButton} ${
            filter === "myPosts" ? styles.active : ""
          }`}
          onClick={() => setFilter("myPosts")}
        >
          <FaRegListAlt size={20} />
          <span>내 게시글 {postCount}</span>
        </button>
        <button
          className={`${styles.filterButton} ${
            filter === "myComments" ? styles.active : ""
          }`}
          onClick={() => setFilter("myComments")}
        >
          <FaRegCommentDots size={20} />
          <span>내 댓글 {commentCount}</span>
        </button>
        <button
          className={`${styles.filterButton} ${
            filter === "myBookmarks" ? styles.active : ""
          }`}
          onClick={() => setFilter("myBookmarks")}
        >
          <BsBookmark size={20} />
          <span>내 북마크 {bookmarkCount}</span>
        </button>
      </div>
      <div className={styles.content}>{renderContent()}</div>
      {hasMore && !loading && (
        <div className={styles.loadMoreButtonContainer}>
          <button onClick={loadMore} className={styles.loadMoreButton}>
            더보기
          </button>
        </div>
      )}
    </div>
  );
});

export default PostManagement;
