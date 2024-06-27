import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from '../../styles/lecture/lectureComment.module.css';
import authStore from '../../stores/authStore';
import UserProfileModal from './userProfileModal'; // 사용자 프로필 모달 컴포넌트 추가
import { AiOutlineWarning } from "react-icons/ai"; // 신고 아이콘 추가

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
    const [selectedUser, setSelectedUser] = useState(null); // 선택된 사용자 정보 저장
    const [selectedUserEducation, setSelectedUserEducation] = useState([]);
    const [selectedUserCareer, setSelectedUserCareer] = useState([]);
    const [selectedUserCertificates, setSelectedUserCertificates] = useState([]);
    const [isReportPopupOpen, setIsReportPopupOpen] = useState(false); // 신고 팝업 상태 추가
    const [reportContent, setReportContent] = useState(""); // 신고 내용 상태 추가
    const [reportCommentId, setReportCommentId] = useState(null); // 신고할 댓글 ID 상태 추가

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
            lectureCommentContent: editContent // 문자열 그대로 저장
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

    const handleEditClick = (commentId, content) => {
        setEditCommentId(commentId);
        setEditContent(content.lectureCommentContent || content); // 수정된 부분
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

    const handleProfileClick = (nickname) => {
        
        axiosClient.get(`/lecture/profile/${nickname}`)
            .then(response => {
                const { profileImageUrl, nickname, registerTime, userType, educationList, careerList, certificateList } = response.data;
                setSelectedUser({ profileImageUrl, nickname, registerTime, userType });
                setSelectedUserEducation(educationList);
                setSelectedUserCareer(careerList);
                setSelectedUserCertificates(certificateList);
            })
            .catch(err => {
                console.error("Error fetching user profile:", err);
            });
    };

    const openReportPopup = (commentId) => {
        setReportCommentId(commentId);
        setIsReportPopupOpen(true);
    };

    const closeReportPopup = () => {
        setIsReportPopupOpen(false);
    };

    const handleReportSubmit = async () => {
        try {
            const reportDTO = {
                receiveNickname: comments.find(comment => comment.lectureCommentId === reportCommentId).nickname,
                doNickname: authStore.getNickname(),
                content: reportContent,
                reportType: 3,
                contentId: reportCommentId,
            };

            await axiosClient.post("/reports", reportDTO);
            closeReportPopup();
            alert("신고가 접수되었습니다.");
        } catch (error) {
            console.error("신고 중 오류 발생:", error);
        }
    };

    const closeUserProfileModal = () => {
        setSelectedUser(null);
        setSelectedUserEducation([]);
        setSelectedUserCareer([]);
        setSelectedUserCertificates([]);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const renderComment = (comment, isReply = false) => {
        const hasReplies = comments.some(reply => reply.parentCommentId === comment.lectureCommentId);
        const isCurrentUser = authStore.getNickname() === comment.nickname;

        return (
            <li key={comment.lectureCommentId} className={isReply ? styles.replyItem : styles.commentItem}>
                {comment.profileImageUrl ? (
                    <img src={comment.profileImageUrl} alt="Profile" className={styles.profileImage} onClick={() => handleProfileClick(comment.nickname)} />
                ) : (
                    <div className={styles.placeholderProfileImage} onClick={() => handleProfileClick(comment.nickname)} />
                )}
                <div className={styles.commentContentWrapper}>
                    <div className={styles.commentHeader}>
                        <span className={styles.commentNickname}>{comment.nickname}</span>
                        <div className={styles.commentActions}>
                            {isCurrentUser ? (
                                <>
                                    <span className={styles.editButton} onClick={() => toggleEditInput(comment.lectureCommentId, comment.lectureCommentContent)}>수정</span>
                                    <span className={styles.deleteButton} onClick={() => handleDeleteComment(comment.lectureCommentId)}>X</span>
                                </>
                            ) : (
                                <>
                                    <button className={styles.reportButton} onClick={() => openReportPopup(comment.lectureCommentId)}>
                                        <AiOutlineWarning size={25} />
                                    </button>
                                    <span className={styles.replyButton} onClick={() => toggleReplyInput(comment.lectureCommentId)}>답글</span>
                                </>
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
                        {hasReplies && (
                            <button onClick={() => toggleRepliesVisibility(comment.lectureCommentId)} className={styles.toggleRepliesButton}>
                                {visibleReplies[comment.lectureCommentId] ? "△ 답글 감추기" : "▽ 답글 보기"}
                            </button>
                        )}
                         {visibleReplies[comment.lectureCommentId] && (
                    <ul className={styles.repliesList}>
                        {comments.filter(reply => reply.parentCommentId === comment.lectureCommentId).map(reply => renderComment(reply, true))}
                    </ul>
                )}
                    </div>
                </div>
                
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
                            onKeyPress={(e) => handleKeyPress(e, handleAddComment)}
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

            {selectedUser && (
                <UserProfileModal 
                    user={selectedUser} 
                    education={selectedUserEducation}
                    career={selectedUserCareer}
                    certificates={selectedUserCertificates}
                    onClose={closeUserProfileModal} 
                />
            )}

            {isReportPopupOpen && (
                <div className={styles.reportPopup}>
                    <div className={styles.popupContent}>
                        <h2>유저 신고</h2>
                        <input
                            type="text"
                            value={reportContent}
                            onChange={(e) => setReportContent(e.target.value)}
                            placeholder="유저 신고 사유를 작성해주세요."
                        />
                        <br></br>
                        <button
                            onClick={handleReportSubmit}
                            className={styles.submitButton}
                        >
                            제출
                        </button>
                        <br></br>
                        <button onClick={closeReportPopup} className={styles.cancelButton}>
                            취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LectureComment;
