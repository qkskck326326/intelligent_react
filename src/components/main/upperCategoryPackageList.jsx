import React, { useEffect, useState } from "react";
import {useRouter} from 'next/router';
import styles from "../../styles/lecturePackage/upperCategoryPackage.module.css";
import Link from "next/link";
import { axiosClient } from "../../axiosApi/axiosClient";
import authStore from "../../stores/authStore";

const UpperCategoryPackageList = () => {
    const router = useRouter();
    const [lecturePackages, setLecturePackages] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [upperCategories, setUpperCategories] = useState([]);
    const [payments, setPayments] = useState([]);
    const userEmail = authStore.getUserEmail();
    const provider = authStore.getProvider();

    useEffect(() => {
        const fetchUpperCategoryPackages = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get('/packages/upperCategorypackageall');
                setLecturePackages(response.data);
                const upperCategoryResponse = await axiosClient.get('/categories/upper');
                setUpperCategories(upperCategoryResponse.data);
                console.log("lecturePackage : ", response.data);

                if (userEmail && provider) {
                    const responsePayment = await axiosClient.get("/payment/confirmation");
                    const responsePaymentData = responsePayment.data
                    setPayments(responsePaymentData);
                    console.log("responsePaymentData : ", responsePaymentData);
                }

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUpperCategoryPackages();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;

        return (
            <>
                {Array(fullStars)
                    .fill(null)
                    .map((_, index) => (
                        <span key={`full-${index}`} className={styles.star}>
                            ⭐
                        </span>
                    ))}
                {halfStar && <span className={styles.halfStar} />}
            </>
        );
    };

    const renderLevelIcon = (level) => {
        return (
            <div className={styles.levelIcon}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <span
                        key={index}
                        className={index < level + 1 ? styles.active : styles.inactive}
                    />
                ))}
            </div>
        );
    };

    const getLectureLevel = (level) => {
        switch (level) {
            case 0:
                return "입문";
            case 1:
                return "기본";
            case 2:
                return "심화";
            default:
                return "알 수 없음";
        }
    };

    const getUpperCategoryName = (id) => {
        const category = upperCategories.find(cat => cat.id === id);
        return category ? category.name : '';
    };


    //결제한 패키지이면 강의 목록으로 이동.
    const handleLectureList = (lecturePackageId) => {
        router.push({
            pathname: '/lecture/list',
            query: {lecturePackageId}
        });
    };

    //재목 클릭 시 결제한 패키지인지 확인
    const isUserPackage = (lecturePackageId) => {
        if (!userEmail || !provider) {
            return false; // userEmail이나 provider가 없으면 false 반환
        }

        return payments.some(
            (payment) =>
                payment.userEmail === userEmail &&
                payment.provider === provider &&
                payment.lecturePackageId === lecturePackageId &&
                payment.paymentConfirmation === "Y"
        );
    };




    return (
        <div className={styles.container}>
            {Object.keys(lecturePackages).map(upperCategoryId => (
                <div key={upperCategoryId}>
                    <div className={styles.header}>
                        <h3>{getUpperCategoryName(Number(upperCategoryId))}</h3>
                    </div>
                    <div className={`${styles.grid} ${styles.upperCategoryGrid}`}>
                        {lecturePackages[upperCategoryId].map((lecture) => (
                            <div key={lecture.lecturePackageId} className={styles.cardContainer}>
                                <div className={styles.card}>
                                    <div className={styles.thumbnail}>
                                        <img src={lecture.thumbnail} alt={lecture.title}/>
                                    </div>
                                </div>
                                <div className={styles.details}>
                                    <div className={styles.title}> {/*결제한 패키지면 강의목록으로 이동*/}
                                        {isUserPackage(lecture.lecturePackageId) ? (
                                            <span
                                                className={styles.customLink}
                                                onClick={() => handleLectureList(lecture.lecturePackageId)}
                                            >
                                                {lecture.title}
                                            </span>
                                        ) : (
                                            <Link href={`/lecturePackage/${lecture.lecturePackageId}`}>
                                                <span className={styles.customLink}>{lecture.title}</span>
                                            </Link>
                                        )}
                                    </div>
                                    <div className={styles.rating}>
                                        {"별점 "}
                                        {lecture.rating ? (
                                            renderStars(lecture.rating)
                                        ) : (
                                            <span className={styles.emptyStar}>&nbsp;</span>
                                        )}
                                    </div>
                                    <div className={styles.info}>
                                        <span>
                                            <img
                                                className={styles.viewCount}
                                                src="/images/view_count_icon.png"
                                                alt="조회수 아이콘"
                                            />
                                        </span>{" "}
                                        {lecture.viewCount}
                                        <span className={styles.packageLevel}>
                                            {renderLevelIcon(lecture.packageLevel)}
                                            {getLectureLevel(lecture.packageLevel)}
                                         </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.horizontalLine}></div>
                </div>
            ))}
        </div>
    );
};

export default UpperCategoryPackageList;