import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react";
import DOMPurify from "dompurify";
import authStore from "../../stores/authStore";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "./PostDetail.module.css";
import {
  AiOutlineMore,
  AiOutlineWarning,
  AiOutlineComment,
} from "react-icons/ai";
import { LuSend } from "react-icons/lu";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { getRelativeTime } from "../../components/post/timeUtils";
import EditPost from "./EditPost";
import { IoHeartSharp } from "react-icons/io5";

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
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const isLoggedIn = authStore.checkIsLoggedIn();

    if (!isLoggedIn) {
      const userConfirmed = window.confirm(
        "로그인이 필요한 콘텐츠입니다. 로그인하시겠습니까?"
      );

      if (userConfirmed) {
        router.push("/user/login");
      } else {
        router.push("/post");
      }
    }
    const fetchPost = async () => {
      if (!postId) return;
      setLoading(true);
      setError(null);

      try {
        const userEmail = authStore.getUserEmail();
        const provider = authStore.getProvider();
        const nickname = authStore.getNickname();
        const response = await axiosClient.get(`/posts/detail/${postId}`, {
          params: { userEmail, provider, nickname },
          withCredentials: true,
        });

        setPost(response.data);
        setLiked(response.data.userLiked);
        setBookmarked(response.data.userBookmarked);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLikeClick = async () => {
    if (!post || !authStore.checkIsLoggedIn() || isOwner()) return;
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
    const nickname = authStore.getNickname();
    const profileImageUrl = authStore.getProfileImageUrl();
    try {
      await axiosClient.post(`/posts/${postId}/comments`, {
        content: commentContent,
        userEmail: userEmail,
        provider: provider,
      });

      // 댓글 작성 후 게시물 상세 정보를 다시 가져옴
      const response = await axiosClient.get(`/posts/detail/${postId}`, {
        params: { userEmail, provider, nickname },
        withCredentials: true,
      });

      setPost(response.data);
      setCommentContent("");
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
        reportType: 0,
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

  const handleBookmarkClick = async (postId) => {
    if (!authStore.checkIsLoggedIn()) {
      setShowPopup(true);
      return;
    }
    try {
      if (bookmarked) {
        await axiosClient.delete("/posts/bookmark", {
          data: {
            postId,
            userEmail: authStore.getUserEmail(),
            provider: authStore.getProvider(),
          },
        });
        setBookmarked(false);
        setPost((prevPost) => ({
          ...prevPost,
          bookmarkCount: prevPost.bookmarkCount - 1,
        }));
      } else {
        await axiosClient.post("/posts/bookmark", {
          postId,
          userEmail: authStore.getUserEmail(),
          provider: authStore.getProvider(),
        });
        setBookmarked(true);
        setPost((prevPost) => ({
          ...prevPost,
          bookmarkCount: prevPost.bookmarkCount + 1,
        }));
      }
    } catch (error) {
      console.error("북마크 처리 중 오류 발생:", error);
    }
  };

  const renderComments = () => {
    return (
      <div className={styles.commentsContainer}>
        <div className={styles.comments}>
          <h2>
            <AiOutlineComment size={25} /> 댓글 {post.comments.length}
          </h2>
          {post.comments.length === 0 ? (
            <p>아직 달린 댓글이 없습니다.</p>
          ) : (
            <ul>
              {post.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onUpdate={handleEditCommentSubmit}
                  onDelete={handleDeleteComment}
                  onReport={handleReportSubmit}
                  isAdmin={authStore.checkIsAdmin()}
                  postUserEmail={post.userEmail}
                  postUserProvider={post.provider}
                />
              ))}
            </ul>
          )}
        </div>
        <div className={styles.commentForm}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 작성하세요"
            />
            <button
              onClick={handleCommentSubmit}
              className={styles.submitCommentButton}
            >
              <LuSend />
            </button>
          </div>
        </div>
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
            if (!file.fileUrl) {
              return null;
            }

            const isImage = file.fileUrl.match(/\.(jpeg|jpg|gif|png)$/i);
            const fileUrl = `http://localhost:8080${file.fileUrl}`;

            return (
              <li key={file.id}>
                첨부파일 :{" "}
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

    parsedContent.querySelectorAll("img").forEach((element) => {
      element.style.maxWidth = "100%";
      element.style.height = "auto";
    });

    parsedContent.querySelectorAll("oembed[url]").forEach((element) => {
      const url = element.getAttribute("url");
      const iframe = document.createElement("iframe");

      let embedUrl = url.replace("watch?v=", "embed/");

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
      iframe.setAttribute("width", "600");
      iframe.setAttribute("height", "400");

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
    <div className={styles.allContainer}>
      <div className={styles.postDetailContainer}>
        <div className={styles.postHeader}>
          <div className={styles.postAvatar}>
            <img src={post.profileImageUrl} alt={post.nickname} />
          </div>
          <div className={styles.postMeta}>
            <span className={styles.postNickname}>{post.nickname}</span>
            <span className={styles.postCategory}>{post.categoryName}</span>
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
            {bookmarked ? (
              <BsFillBookmarkFill size={25} color="gold" />
            ) : (
              <BsBookmark size={25} />
            )}
          </div>
          {(isOwner() || authStore.checkIsAdmin()) && (
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
          {!isOwner() && !authStore.checkIsAdmin() && (
            <button className={styles.reportButton} onClick={openReportPopup}>
              <AiOutlineWarning size={25} />
            </button>
          )}
        </div>
        <div className={styles.postStats}>
          <span onClick={handleLikeClick} style={{ cursor: "pointer" }}>
            <IoHeartSharp size={25} color={liked ? "#bc3535" : "gray"} />{" "}
            {post.likeCount}
          </span>
          <span>조회수: {post.viewCount}</span>
        </div>
        <div className={styles.tagContainer}>
          {post.tags.map((tag, index) => (
            <div key={index} className={styles.tagItem}>
              #{tag}
            </div>
          ))}
        </div>
        <h1 className={styles.postTitle}>{post.title}</h1>
        {renderContent()}
        {renderFiles()}
      </div>

      <div className={styles.commentsContainer}>{renderComments()}</div>

      {/* <div className={styles.fixedCommentForm}>
        <div className={styles.commentForm}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 작성하세요"
            />
            <button
              onClick={handleCommentSubmit}
              className={styles.submitCommentButton}
            >
              <LuSend />
            </button>
          </div>
        </div>
      </div> */}

      {isReportPopupOpen && (
        <div className={styles.reportPopup}>
          <div className={styles.popupContent}>
            <h2>게시물 신고</h2>
            <input
              type="text"
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

const CommentItem = ({
  comment,
  onUpdate,
  onDelete,
  onReport,
  isAdmin,
  postUserEmail,
  postUserProvider,
}) => {
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
    setIsDropdownOpen(false);
  };
  const handleCancel = () => {
    setUpdatedContent(comment.content);
    setIsEditing(false);
    setIsDropdownOpen(false);
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
        reportType: 1,
        contentId: comment.id,
      };

      await axiosClient.post("/reports", reportDTO);
      closeReportPopup();
      alert("신고가 접수되었습니다.");
    } catch (error) {
      console.error("신고 중 오류 발생:", error);
    }
  };

  const isPostAuthor =
    comment.userEmail === postUserEmail &&
    comment.provider === postUserProvider;

  return (
    <li className={styles.commentItem}>
      <img src={comment.profileImageUrl} alt={comment.nickname} />
      <div className={styles.commentContent}>
        <div className={styles.commentHeader}>
          <span>
            {comment.nickname}{" "}
            {isPostAuthor && <span className={styles.authorLabel}>작성자</span>}
          </span>
          <time>{getRelativeTime(comment.commentTime)}</time>
          {(isCommentOwner() || isAdmin) && (
            <div className={styles.commentDropdown}>
              <AiOutlineMore
                size={20}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {isDropdownOpen && (
                <div className={styles.commentDropdownMenu}>
                  <div
                    className={styles.commentDropdownMenuItem}
                    onClick={() => {
                      setIsEditing(true);
                      setIsDropdownOpen(false);
                    }}
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
          {!isCommentOwner() && !isAdmin && (
            <button className={styles.reportButton} onClick={openReportPopup}>
              <AiOutlineWarning size={20} />
            </button>
          )}
        </div>
        {isEditing ? (
          <div className={styles.editComment}>
            <input
              type="text"
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
            />
            <div className={styles.buttonContainer}>
              <button onClick={handleUpdate}>저장</button>
              <button onClick={handleCancel}>취소</button>
            </div>
          </div>
        ) : (
          <p className={styles.commentText}>{comment.content}</p>
        )}
      </div>

      {isReportPopupOpen && (
        <div className={styles.reportPopup}>
          <div className={styles.popupContent}>
            <h2>댓글 신고</h2>
            <input
              type="text"
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
