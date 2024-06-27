import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "../../styles/user/mypage/myLecturePackage.module.css";

const MyLecturePackage = observer(() => {
    const router = useRouter();
    const [lecturePackages, setLecturePackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authStore.checkIsLoggedIn()) {
            router.push("/user/login");
        } else {
            fetchLecturePackages();
        }
    }, []);

    const fetchLecturePackages = async () => {
        try {
            // const response = await axiosClient.get(`/lecturePackages/user/${authStore.getNickname()}`);
            setLecturePackages(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>에러: {error.message}</p>;

    return (
        <div className={styles.container}>
            <h1>My Lecture Packages</h1>
            <div className={styles.grid}>
                {lecturePackages.map((lecture) => (
                    <div key={lecture.id} className={styles.cardContainer}>
                        <div className={styles.card}>
                            <div className={styles.thumbnail}>
                                <img src={lecture.thumbnail} alt={lecture.title} />
                            </div>
                            <div className={styles.details}>
                                <div className={styles.title}>
                                    {lecture.title}
                                </div>
                                <div className={styles.rating}>
                                    {"별점 "}
                                    {lecture.rating}
                                </div>
                                <div className={styles.info}>
                                    {lecture.viewCount} views
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default MyLecturePackage;
