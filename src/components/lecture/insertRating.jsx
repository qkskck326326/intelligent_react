import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import authStore from "../../stores/authStore";
import styles from "../../styles/lecture/insertRating.module.css";

const InsertRating = ({ lecturePackageId }) => {
    const [myRating, setMyRating] = useState(null);
    const [hover, setHover] = useState(null);
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        const currentNickname = authStore.getNickname();
        setNickname(currentNickname);
    }, []);

    const handleRatingSubmit = async () => {
        try {
            const response = await axiosClient.post(`/lecture/rating/${lecturePackageId}`, {
                rating: myRating,
                nickname
            });
            if (response.status === 201) {
                alert("별점이 등록되었습니다.");
            } else if (response.status === 409) {
                alert("이미 별점을 등록했습니다.");
            }
        } catch (error) {
            console.error("Error submitting rating:", error);
            alert("별점을 이미 등록 하셨습니다.");
        }
    };
    
    return (
        <div className={styles.App}>
            <div className={styles.inlineContainer}>
                <h3 className={styles.title}>내 별점</h3>
                <div className={styles.rating}>
                    {[...Array(5)].map((_, index) => {
                        const currentRating = index + 1;
                        return (
                            <span
                                key={index}
                                className={styles.star}
                                style={{
                                    color: currentRating <= (hover || myRating) ? "#ffd700" : "#e4e5e9"
                                }}
                                onMouseEnter={() => setHover(currentRating)}
                                onMouseLeave={() => setHover(null)}
                                onClick={() => setMyRating(currentRating)}
                            >
                                &#9733;
                            </span>
                        );
                    })}
                </div>
                <button onClick={handleRatingSubmit} className={styles.submitButton}>등록</button>
            </div>
        </div>
    );
};

export default InsertRating;
