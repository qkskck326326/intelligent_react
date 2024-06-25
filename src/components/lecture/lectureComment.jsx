import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from '../../styles/lecture/lectureComment.module.css';
import authStore from '../../stores/authStore';

const LectureComment = ({ lectureId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [editCommentId, setEditCommentId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [replyCommentId, setReplyCommentId] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [userProfileImageUrl, setUserProfileImageUrl] = useState('');
    const [nickname, setNickname] = useState('');
    const [visibleReplies, setVisibleReplies] = useState({});

    useEffect(() => {
        if (lectureId) {
            fetchComments();
        }
    }, [lectureId]);

    useEffect(() => {
        const fetchUserProfileImage = async () => {
            const profileImageUrl = await authStore.getProfileImageUrl();
            setUserProfileImageUrl(profileImageUrl);
        };

        const currentNickname = authStore.getNickname();
        setNickname(currentNickname);

        fetchUserProfileImage();
    }, []);

    const fetchComments = () => {
        axiosClient.get(`/lecture/comments/${lectureId}`)
            .then(response => {
                setComments(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        axiosClient.post(`/lecture/comments`, {
            lectureId: lectureId,
            nickname: authStore.getNickname(),
            lectureCommentContent: newComment,
            parentCommentId: null
        })
        .then(response => {
            fetchComments();
            setNewComment("");
        })
        .catch(err => {
            console.error(err);
        });
    };

    const handleEditSubmit = (commentId) => {
        if (!editContent.trim()) return;

        axiosClient.put(`/lecture/comments/${commentId}`, {
            lectureCommentContent: editContent
        })
        .then(response => {
            fetchComments();
            setEditCommentId(null);
            setEditContent('');
        })
        .catch(err => {
            console.error(err);
        });
    };

    const handleDeleteComment = (commentId) => {
        axiosClient.delete(`/lecture/comments/${commentId}`)
            .then(response => {
                fetchComments();
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleReplySubmit = (commentId) => {
        if (!replyContent.trim()) return;

        axiosClient.post(`/lecture/comments`, {
            lectureId: lectureId,
            nickname: authStore.getNickname(),
            lectureCommentContent: replyContent,
            parentCommentId: commentId
        })
        .then(response => {
            fetchComments();
            setReplyCommentId(null);
            setReplyContent('');
        })
        .catch(err => {
            console.error(err);
        });
    };

    const toggleReplyInput = (commentId) => {
        setReplyCommentId(prevId => (prevId === commentId ? null : commentId));
    };

    const toggleEditInput = (commentId, content) => {
        if (editCommentId === commentId) {
            setEditCommentId(null);
            setEditContent('');
        } else {
            setEditCommentId(commentId);
            setEditContent(content);
        }
    };

    const toggleRepliesVisibility = (commentId) => {
        setVisibleReplies(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId]
        }));
    };

    const handleKeyPress = (e, callback) => {
        if (e.key === "Enter") {
            callback();
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const renderComment = (comment, isReply = false) => {
        const hasReplies = comments.some(reply => reply.parentCommentId === comment.lectureCommentId);

        return (
            <li key={comment.lectureCommentId} className={isReply ? styles.replyItem : styles.commentItem}>
                {comment.profileImageUrl ? (
                    <img src={comment.profileImageUrl} alt="Profile" className={styles.profileImage} />
                ) : (
                    <div className={styles.placeholderProfileImage} />
                )}
                <div className={styles.commentContentWrapper}>
                    <div className={styles.commentHeader}>
                        <span className={styles.commentNickname}>{comment.nickname}</span>
                        <div className={styles.commentActions}>
                            {authStore.getNickname() === comment.nickname ? (
                                <>
                                    <span className={styles.editButton} onClick={() => toggleEditInput(comment.lectureCommentId, comment.lectureCommentContent)}>수정</span>
                                    <span className={styles.deleteButton} onClick={() => handleDeleteComment(comment.lectureCommentId)}>X</span>
                                </>
                            ) : (
                                <span className={styles.replyButton} onClick={() => toggleReplyInput(comment.lectureCommentId)}>답글</span>
                            )}
                        </div>
                    </div>
                    <div className={styles.commentContentContainer}>
                        <hr className={styles.divider} />
                        {editCommentId === comment.lectureCommentId ? (
                            <div className={styles.editContainer}>
                                <input
                                    type="text"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className={styles.editInput}
                                    onKeyPress={(e) => handleKeyPress(e, () => handleEditSubmit(comment.lectureCommentId))}
                                />
                                <button onClick={() => handleEditSubmit(comment.lectureCommentId)} className={styles.submitButton}>
                                    <img src="/images/send-message.png" alt="Send" />
                                </button>
                            </div>
                        ) : (
                            <p className={styles.commentContent}>{comment.lectureCommentContent}</p>
                        )}
                        {replyCommentId === comment.lectureCommentId && (
                            <div className={styles.replyContainer}>
                                <input
                                    type="text"
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    className={styles.replyInput}
                                    onKeyPress={(e) => handleKeyPress(e, () => handleReplySubmit(comment.lectureCommentId))}
                                />
                                <button onClick={() => handleReplySubmit(comment.lectureCommentId)} className={styles.submitButton}>
                                    <img src="/images/send-message.png" alt="Send" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {hasReplies && (
                    <button onClick={() => toggleRepliesVisibility(comment.lectureCommentId)} className={styles.toggleRepliesButton}>
                        {visibleReplies[comment.lectureCommentId] ? "△ 답글 감추기" : "▽ 답글 보기"}
                    </button>
                )}
                {visibleReplies[comment.lectureCommentId] && comments.filter(reply => reply.parentCommentId === comment.lectureCommentId).map(reply => renderComment(reply, true))}
            </li>
        );
    };

    return (
        <div className={styles.commentsContainer}>
            <div className={styles.addCommentContainer}>
                {userProfileImageUrl ? (
                    <img src={userProfileImageUrl} alt="Profile" className={styles.profileImage} />
                ) : (
                    <div className={styles.placeholderProfileImage} />
                )}
                <div className={styles.newComment}>
                    <span className={styles.commentNickname}>{nickname}</span>
                    <hr className={styles.divider} />
                    <div className={styles.commentInputContainer}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요"
                            className={styles.commentInput}
                        />
                        <button onClick={handleAddComment} className={styles.submitButton}>
                            <img src="/images/send-message.png" alt="Send" />
                        </button>
                    </div>
                </div>
            </div>
            <ul className={styles.commentsList}>
                {comments.filter(comment => !comment.parentCommentId).map(comment => (
                    <>
                        {renderComment(comment)}
                    </>
                ))}
            </ul>
        </div>
    );
};

export default LectureComment;
