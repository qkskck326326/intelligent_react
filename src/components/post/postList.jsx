import React, { useEffect, useState } from "react";
import Link from "next/link";
import { axiosClient } from "../../axiosApi/axiosClient";
import { Pagination } from "react-bootstrap";
import styles from "./PostList.module.css";
import { FaThumbsUp, FaComment, FaEye } from "react-icons/fa";
import PostUploadBtn from "./PostUploadBtn";
import PostSearch from "../../components/post/postSearchBar";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get("/posts/list", {
          params: { page: page, size: size },
        });
        setPosts(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, size]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <div className={styles.postListContainer}>
      <h1 className={styles.title}>Posts</h1>
      <PostSearch />
      {loading ? (
        <h2 className={styles.loading}>Loading...</h2>
      ) : (
        <ul className={styles.postList}>
          {posts.map((post) => (
            <li key={post.id} className={styles.postItem}>
              {console.log("postId:", post.id)}
              <Link href={`/post/${post.id}`} passHref>
                <div className={styles.postHeader}>
                  <div className={styles.postAvatar}></div>
                  <div className={styles.postMeta}>
                    <span className={styles.postNickname}>{post.nickname}</span>
                    <span className={styles.postCategory}>
                      {post.categoryName}
                    </span>
                  </div>
                  <div className={styles.postTime}>
                    {new Date(post.postTime).toLocaleDateString()}
                  </div>
                </div>
                <h5 className={styles.postTitle}>{post.title}</h5>
                <p className={styles.postSnippet}>{post.contentSnippet}....</p>
                <div className={styles.postFooter}>
                  <div className={styles.postStats}>
                    <span>
                      <FaThumbsUp /> {post.likeCount}
                    </span>
                    <span>
                      <FaComment /> {post.commentCount}
                    </span>
                    <span>
                      <FaEye /> {post.viewCount}
                    </span>
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
        <PostUploadBtn />
      </div>
    </div>
  );
};

export default PostList;
