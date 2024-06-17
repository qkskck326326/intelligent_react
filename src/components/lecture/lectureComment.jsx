import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/lecture/lectureComment.module.css';

const LectureComment = ({ lectureId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/get_lecture_comments.php?lectureId=${lectureId}`);
                setComments(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchComments();
    }, [lectureId]);

    if (loading) return <p>Loading comments...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.commentSection}>
            {comments.map(comment => (
                <div key={comment.LECTURE_COMMENT_ID} className={styles.comment}>
                    <div className={styles.commentHeader}>
                        <img src="/user-avatar.png" alt="User Avatar" className={styles.avatar} />
                        <span className={styles.nickname}>{comment.NICKNAME}</span>
                        <span className={styles.date}>{comment.LECTURE_COMMENT_DATE}</span>
                    </div>
                    <p className={styles.content}>{comment.LECTURE_COMMENT_CONTENT}</p>
                    <div className={styles.actions}>
                        <button className={styles.replyButton}>답글</button>
                        <button className={styles.editButton}>수정</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LectureComment;
