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
            setComments(prevComments => [...prevComments, response.data]);
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
            setComments(prevComments => prevComments.map(comment => {
                if (comment.lectureCommentId === commentId) {
                    return { ...comment, lectureCommentContent: editContent };
                }
                return comment;
            }));
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
                setComments(prevComments => prevComments.filter(comment => comment.lectureCommentId !== commentId));
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.commentsContainer}>
            <div className={styles.addCommentContainer}>
                {userProfileImageUrl ? (
                    <img src={userProfileImageUrl} alt="Profile" className={styles.profileImage} />
                ) : (
                    <div className={styles.placeholderProfileImage} />
                )}
                <div className={styles.newComment}>
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
            <ul className={styles.commentsList}>
                {comments.map(comment => (
                    <li key={comment.lectureCommentId} className={styles.commentItem}>
                        <div className={styles.commentHeader}>
                            {comment.profileImageUrl ? (
                                <img src={comment.profileImageUrl} alt="Profile" className={styles.profileImage} />
                            ) : (
                                <div className={styles.placeholderProfileImage} />
                            )}
                            <span className={styles.commentNickname}>{comment.nickname}</span>
                            {authStore.getNickname() === comment.nickname ? (
                                <div className={styles.commentActions}>
                                    <span className={styles.editButton} onClick={() => setEditCommentId(comment.lectureCommentId)}>수정</span>
                                    <span className={styles.deleteButton} onClick={() => handleDeleteComment(comment.lectureCommentId)}>X</span>
                                </div>
                            ) : (
                                <span className={styles.replyButton} onClick={() => setReplyCommentId(comment.lectureCommentId)}>답글</span>
                            )}
                        </div>
                        {editCommentId === comment.lectureCommentId ? (
                            <div className={styles.editContainer}>
                                <input
                                    type="text"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className={styles.editInput}
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
                                />
                                <button onClick={() => handleReplySubmit(comment.lectureCommentId)} className={styles.submitButton}>
                                    <img src="/images/send-message.png" alt="Send" />
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LectureComment;
