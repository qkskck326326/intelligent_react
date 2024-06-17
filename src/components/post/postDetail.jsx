import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react";
import DOMPurify from "dompurify"; // Import DOMPurify
import authStore from "../../stores/authStore";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "./PostDetail.module.css";
import { TbEyeSearch } from "react-icons/tb";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { AiOutlineComment } from "react-icons/ai";
import { getRelativeTime } from "../../components/post/timeUtils";

const PostDetail = observer(() => {
  const router = useRouter();
  const { postId } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      setLoading(true);
      setError(null);

      try {
        const userEmail = authStore.getUserEmail();
        const provider = authStore.getProvider();
        const nickname = authStore.getNickname();
        console.log("Fetching post details for postId:", postId);
        const response = await axiosClient.get(`/posts/detail/${postId}`, {
          params: { userEmail, provider, nickname },
          withCredentials: true,
        });
        console.log("Fetched post data:", response.data);
        setPost(response.data);
        setLiked(response.data.userLiked);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLikeClick = async () => {
    if (!post || !authStore.isLoggedIn) return;
    const userEmail = authStore.getUserEmail();
    const provider = authStore.getProvider();
    try {
      if (liked) {
        await axiosClient.post(`/posts/${postId}/unlike`, {
          userEmail: userEmail,
          provider: provider,
        });
        setPost((prevPost) => ({
          ...prevPost,
          likeCount: prevPost.likeCount - 1,
        }));
      } else {
        await axiosClient.post(`/posts/${postId}/like`, {
          userEmail: userEmail,
          provider: provider,
        });
        setPost((prevPost) => ({
          ...prevPost,
          likeCount: prevPost.likeCount + 1,
        }));
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  const handleCommentIconClick = () => {
    setShowCommentForm(!showCommentForm);
  };

  const handleCommentSubmit = async () => {
    if (!commentContent || !authStore.isLoggedIn) return;
    const userEmail = authStore.getUserEmail();
    const provider = authStore.getProvider();
    try {
      await axiosClient.post(`/posts/${postId}/comments`, {
        content: commentContent,
        userEmail: userEmail,
        provider: provider,
      });
      setPost((prevPost) => ({
        ...prevPost,
        comments: [
          ...prevPost.comments,
          { content: commentContent, userEmail, provider },
        ],
      }));
      setCommentContent("");
      setShowCommentForm(false);
    } catch (error) {
      console.log(userEmail, provider);
      console.error("Error submitting comment:", error);
    }
  };

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
      return <p>아직 달린 댓글이 없습니다.</p>;
    }

    return (
      <div className={styles.comments}>
        <span>
          <AiOutlineComment size={25} /> {post.commentCount}
        </span>
        <ul>
          {post.comments.map((comment) => (
            <li key={comment.commentId}>
              <span>
                <img src={comment.profileImageUrl} alt={comment.nickname} />
                {comment.nickname}
              </span>
              <p>
                {comment.content}
                {getRelativeTime(comment.commentTime)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderFiles = () => {
    if (!post.files || post.files.length === 0) {
      return null;
    }

    return (
      <div className={styles.files}>
        <ul>
          {post.files.map((file) => {
            console.log("Processing file:", file);
            if (!file.fileUrl) {
              console.warn("File URL is undefined for file:", file);
              return null;
            }

            const isImage = file.fileUrl.match(/\.(jpeg|jpg|gif|png)$/i);
            const fileUrl = `http://localhost:8080${file.fileUrl}`;
            console.log("File URL:", fileUrl, "Is image:", isImage);

            return (
              <li key={file.id}>
                {isImage ? (
                  <img
                    src={fileUrl}
                    alt={file.fileUrl.split("/").pop()}
                    className={styles.imageFile}
                  />
                ) : (
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    {file.fileUrl.split("/").pop()}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className={styles.postDetailContainer}>
      <div className={styles.postHeader}>
        <div className={styles.postAvatar}>
          <img src={post.profileImageUrl} alt={post.nickname} />
        </div>
        <div className={styles.postMeta}>
          <span className={styles.postNickname}>{post.nickname}</span>
          <span className={styles.postCategory}>{post.categoryName}</span>
        </div>
        <div className={styles.postTime}>{getRelativeTime(post.postTime)}</div>
      </div>
      <div className={styles.postStats}>
        <span onClick={handleLikeClick} style={{ cursor: "pointer" }}>
          {liked ? <AiFillLike size={25} /> : <AiOutlineLike size={25} />}{" "}
          {post.likeCount}
        </span>
        <span>조회수: {post.viewCount}</span>
      </div>
      <h1 className={styles.postTitle}>{post.title}</h1>
      <p
        className={styles.postContent}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} // Use DOMPurify to sanitize the content
      ></p>

      {renderFiles()}
      {renderComments()}
      <div className={styles.commentForm}>
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="댓글을 작성하세요"
        />
        <button
          onClick={handleCommentSubmit}
          className={styles.submitCommentButton}
        >
          작성하기
        </button>
      </div>
    </div>
  );
});

export default PostDetail;
