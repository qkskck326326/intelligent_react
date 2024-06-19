import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react";
import DOMPurify from "dompurify";
import authStore from "../../stores/authStore";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "./PostDetail.module.css";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineMore,
  AiOutlineWarning,
} from "react-icons/ai";
import { AiOutlineComment } from "react-icons/ai";
import { getRelativeTime } from "../../components/post/timeUtils";
import EditPost from "./EditPost";

const PostDetail = observer(({ postId }) => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isReportPopupOpen, setIsReportPopupOpen] = useState(false);
  const [reportContent, setReportContent] = useState("");

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
    if (!post || !authStore.isLoggedIn || isOwner()) return;
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
      window.location.reload();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      await axiosClient.delete(`/posts/delete/${postId}`);
      router.push("/post");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleReportSubmit = async () => {
    try {
      const reportDTO = {
        receiveNickname: post.nickname,
        doNickname: authStore.getNickname(),
        content: reportContent,
        reportType: 0, // 게시물 신고
        contentId: post.id,
      };

      await axiosClient.post("/reports", reportDTO);
      closeReportPopup();
      alert("신고가 접수되었습니다.");
    } catch (error) {
      console.error("신고 중 오류 발생:", error);
    }
  };

  const isOwner = () => {
    return (
      authStore.getUserEmail() === post?.userEmail &&
      authStore.getProvider() === post?.provider
    );
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const openReportPopup = () => {
    setIsReportPopupOpen(true);
  };

  const closeReportPopup = () => {
    setIsReportPopupOpen(false);
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

  const handleEditCommentSubmit = async (commentId, updatedContent) => {
    if (!updatedContent || !authStore.isLoggedIn) return;
    const userEmail = authStore.getUserEmail();
    const provider = authStore.getProvider();
    try {
      await axiosClient.put(`/posts/${postId}/UpdateComment/${commentId}`, {
        content: updatedContent,
        userEmail: userEmail,
        provider: provider,
      });
      setPost((prevPost) => ({
        ...prevPost,
        comments: prevPost.comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: updatedContent }
            : comment
        ),
      }));
      window.location.reload();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosClient.delete(`/posts/${postId}/deleteComment/${commentId}`);
      setPost((prevPost) => ({
        ...prevPost,
        comments: prevPost.comments.filter(
          (comment) => comment.id !== commentId
        ),
      }));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const renderComments = () => {
    if (!post.comments || post.comments.length === 0) {
      return <p>아직 달린 댓글이 없습니다.</p>;
    }

    return (
      <div className={styles.comments}>
        <h2>
          <AiOutlineComment size={25} /> 댓글 {post.comments.length}
        </h2>
        <ul>
          {post.comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onUpdate={handleEditCommentSubmit}
              onDelete={handleDeleteComment}
              onReport={handleReportSubmit}
            />
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

  const renderContent = () => {
    const sanitizedContent = DOMPurify.sanitize(post.content, {
      ADD_TAGS: ["iframe", "oembed"],
      ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "url"],
    });

    const parsedContent = new DOMParser().parseFromString(
      sanitizedContent,
      "text/html"
    );

    parsedContent.querySelectorAll("oembed[url]").forEach((element) => {
      const url = element.getAttribute("url");
      const iframe = document.createElement("iframe");

      // YouTube URL에서 'watch?v='를 'embed/'로 대체
      let embedUrl = url.replace("watch?v=", "embed/");

      // YouTube URL에 'list' 매개변수가 포함된 경우 '&'를 '?'로 변경
      if (embedUrl.includes("list=")) {
        embedUrl = embedUrl.replace("&list=", "?list=");
      }

      iframe.setAttribute("src", embedUrl);
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allowfullscreen", "true");
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      );
      iframe.setAttribute("width", "800");
      iframe.setAttribute("height", "500");

      element.parentNode.replaceChild(iframe, element);
    });

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: parsedContent.documentElement.innerHTML,
        }}
      />
    );
  };

  if (isEditing) {
    return <EditPost postId={postId} setIsEditing={setIsEditing} />;
  }

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
        {isOwner() && (
          <div className={styles.dropdownIcon} onClick={toggleDropdown}>
            <AiOutlineMore size={25} />
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div
                  className={styles.dropdownMenuItem}
                  onClick={() => setIsEditing(true)}
                >
                  수정
                </div>
                <div
                  className={styles.dropdownMenuItem}
                  onClick={handleDeleteClick}
                >
                  삭제
                </div>
              </div>
            )}
          </div>
        )}
        {!isOwner() && (
          <button className={styles.reportButton} onClick={openReportPopup}>
            <AiOutlineWarning size={25} /> 신고
          </button>
        )}
      </div>
      <div className={styles.postStats}>
        <span onClick={handleLikeClick} style={{ cursor: "pointer" }}>
          {liked ? <AiFillLike size={25} /> : <AiOutlineLike size={25} />}{" "}
          {post.likeCount}
        </span>
        <span>조회수: {post.viewCount}</span>
      </div>
      <h1 className={styles.postTitle}>{post.title}</h1>
      {renderContent()}
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

      {isReportPopupOpen && (
        <div className={styles.reportPopup}>
          <div className={styles.popupContent}>
            <h2>게시물 신고</h2>
            <textarea
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
              placeholder="게시물 신고 사유를 작성해주세요."
            />
            <button
              onClick={handleReportSubmit}
              className={styles.submitButton}
            >
              제출
            </button>
            <button onClick={closeReportPopup} className={styles.cancelButton}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

const CommentItem = ({ comment, onUpdate, onDelete, onReport }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(comment.content);
  const [isReportPopupOpen, setIsReportPopupOpen] = useState(false);
  const [reportContent, setReportContent] = useState("");

  const isCommentOwner = () => {
    return (
      authStore.getUserEmail() === comment.userEmail &&
      authStore.getProvider() === comment.provider
    );
  };

  const handleUpdate = async () => {
    await onUpdate(comment.id, updatedContent);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await onDelete(comment.id);
  };

  const openReportPopup = () => {
    setIsReportPopupOpen(true);
  };

  const closeReportPopup = () => {
    setIsReportPopupOpen(false);
  };

  const handleReportSubmit = async () => {
    try {
      const reportDTO = {
        receiveNickname: comment.nickname,
        doNickname: authStore.getNickname(),
        content: reportContent,
        reportType: 1, // 댓글 신고
        contentId: comment.id,
      };

      await axiosClient.post("/reports", reportDTO);
      console.log(
        reportDTO.contentId +
          reportDTO.doNickname +
          reportDTO.receiveNickname +
          reportDTO.content
      );
      closeReportPopup();
      alert("신고가 접수되었습니다.");
    } catch (error) {
      console.error("신고 중 오류 발생:", error);
    }
  };

  return (
    <li className={styles.commentItem}>
      <img src={comment.profileImageUrl} alt={comment.nickname} />
      <div className={styles.commentContent}>
        <div className={styles.commentHeader}>
          <span>{comment.nickname}</span>
          <time>{getRelativeTime(comment.commentTime)}</time>
          {isCommentOwner() && (
            <div className={styles.commentDropdown}>
              <AiOutlineMore
                size={20}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {isDropdownOpen && (
                <div className={styles.commentDropdownMenu}>
                  <div
                    className={styles.commentDropdownMenuItem}
                    onClick={() => setIsEditing(true)}
                  >
                    수정
                  </div>
                  <div
                    className={styles.commentDropdownMenuItem}
                    onClick={handleDelete}
                  >
                    삭제
                  </div>
                </div>
              )}
            </div>
          )}
          {!isCommentOwner() && (
            <button className={styles.reportButton} onClick={openReportPopup}>
              <AiOutlineWarning size={20} /> 신고
            </button>
          )}
        </div>
        {isEditing ? (
          <div className={styles.editComment}>
            <textarea
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
            />
            <button onClick={handleUpdate}>저장</button>
          </div>
        ) : (
          <p className={styles.commentText}>{comment.content}</p>
        )}
      </div>

      {isReportPopupOpen && (
        <div className={styles.reportPopup}>
          <div className={styles.popupContent}>
            <h2>댓글 신고</h2>
            <textarea
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
              placeholder="댓글 신고 사유를 작성해주세요."
            />
            <button
              onClick={handleReportSubmit}
              className={styles.submitButton}
            >
              제출
            </button>
            <button onClick={closeReportPopup} className={styles.cancelButton}>
              취소
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default PostDetail;
