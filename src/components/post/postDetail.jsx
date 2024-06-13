import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "./PostDetail.module.css";

const PostDetail = () => {
  const router = useRouter();
  const { postId } = router.query;

  console.log("postId:", postId);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.get(`/posts/detail/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // Handle loading, error, and success states
  if (loading) {
    return <h2 className={styles.loading}>Loading...</h2>;
  }

  if (error) {
    return (
      <h2 className={styles.error}>
        Error fetching post: {error.message || "Unknown error"}
      </h2>
    );
  }

  if (!post) {
    return <h2 className={styles.error}>Post not found</h2>;
  }

  const renderComments = () => {
    if (!post.comments || post.comments.length === 0) {
      return <p>No comments yet.</p>;
    }

    return (
      <div className={styles.comments}>
        <h2>Comments</h2>
        <ul>
          {post.comments.map((comment) => (
            <li key={comment.commentId}>
              <p>{comment.content}</p> <span>{comment.nickname}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderFiles = () => {
    if (!post.files || post.files.length === 0) {
      return null; // No need to render a container if there are no files
    }

    return (
      <div className={styles.files}>
        <h2>Files</h2>
        <ul>
          {post.files.map((file) => (
            <li key={file.id}>
              <img
                src={file.fileUrl}
                alt={file.fileName}
                className={styles.imageFile}
              />
              <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                {file.fileName || file.fileUrl.split("/").pop()}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className={styles.postDetailContainer}>
      <div className={styles.postHeader}>
        <div className={styles.postAvatar}></div>
        <div className={styles.postMeta}>
          <span className={styles.postNickname}>{post.nickname}</span>
          <span className={styles.postCategory}>{post.categoryName}</span>
        </div>
        <div className={styles.postTime}>
          {new Date(post.postTime).toLocaleDateString()}
        </div>
      </div>
      <h1 className={styles.postTitle}>{post.title}</h1>
      <p className={styles.postContent}>{post.content}</p>
      <div className={styles.postStats}>
        <span>좋아요: {post.likeCount}</span>
        <span>조회수: {post.viewCount}</span>
        <span>댓글: {post.commentCount}</span>
      </div>
      {renderComments()}
      {renderFiles()}
    </div>
  );
};

export default PostDetail;
