import React, { useEffect, useState } from "react";
import {useRouter} from 'next/router';
import styles from "../../styles/lecturePackage/lecturePackage.module.css";
import Link from "next/link";
import { axiosClient } from "../../axiosApi/axiosClient";
import authStore from "../../stores/authStore";
import { observer } from "mobx-react";

const ITEMS_PER_PAGE = 4;

const UserInterestPackageList = observer(({ onRegisterClick }) => {
    const router = useRouter();
    const [lecturePackages, setLecturePackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [payments, setPayments] = useState([]);
    const userEmail = authStore.getUserEmail();
    const provider = authStore.getProvider();



    useEffect(() => {
        const fetchUserInterestPackages = async () => {
            setLoading(true);
            try {
                const email = authStore.getUserEmail();
                const provider = authStore.getProvider();

                console.log("email, provider : ", email, provider);
                const response = await axiosClient.get('/packages/interestpackagetop10', {
                    params:{
                        email:email,
                        provider:provider
                    }
                });
                setLecturePackages(response.data);
                console.log("lecturePackage : ", response.data);

                const responsePayment = await axiosClient.get("/payment/confirmation");
                const responsePaymentData = responsePayment.data
                setPayments(responsePaymentData);
                console.log("responsePaymentData : ", responsePaymentData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (typeof window !== 'undefined') {
            const email = localStorage.getItem("userEmail");
            const provider = localStorage.getItem("provider");
            authStore.setUserEmail(email);
            authStore.setProvider(provider);

            fetchUserInterestPackages();
        }

    }, []);

    const handleNextPage = () => {
        if ((currentPage + 1) * ITEMS_PER_PAGE < lecturePackages.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;

        return (
            <>
                {Array(fullStars).fill(null).map((_, index) => (
                    <span key={`full-${index}`} className={styles.star}>⭐</span>
                ))}
                {halfStar && <span className={styles.halfStar} />}
            </>
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

    //결제한 패키지이면 강의 목록으로 이동.
    const handleLectureList = (lecturePackageId) => {
        router.push({
            pathname: '/lecture/list',
            query: {lecturePackageId}
        });
    };

    //재목 클릭 시 결제한 패키지인지 확인
    const isUserPackage = (lecturePackageId) => {
        return payments.some(
            (payment) =>
                payment.userEmail === userEmail &&
                payment.provider === provider &&
                payment.lecturePackageId === lecturePackageId &&
                payment.paymentConfirmation === "Y"
        );
    };





    const startIndex = currentPage * ITEMS_PER_PAGE;
    const currentItems = lecturePackages.slice(startIndex, startIndex + ITEMS_PER_PAGE);








    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>'{authStore.getNickname()}' 님의 관심사별 TOP10</h3>
            </div>
            <div className={styles.paginationWrapper}>
                <button onClick={handlePreviousPage} disabled={currentPage === 0}
                        className={styles.prevButton}></button>
                <div className={styles.grid}>
                    {currentItems.map((lecture) => (
                        <div key={lecture.lecturePackageId} className={styles.cardContainer}>
                            <div className={styles.card}>
                                <div className={styles.thumbnail}>
                                    <img src={lecture.thumbnail} alt={lecture.thumbnail}/>
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
                <button onClick={handleNextPage} disabled={(currentPage + 1) * ITEMS_PER_PAGE >= lecturePackages.length}
                        className={styles.nextButton}></button>
            </div>
            <div className={styles.line}></div>
        </div>
    );
});

const ConditionalUserInterestPackageList = observer(({onRegisterClick}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // const token = localStorage.getItem("token");
            // setIsLoggedIn(!!token);
            setIsLoggedIn(authStore.checkIsLoggedIn());
        }
    }, []);

    if (!isLoggedIn) {
        return null; // 사용자가 로그인하지 않은 경우 컴포넌트를 렌더링하지 않음
    }

    return <UserInterestPackageList onRegisterClick={onRegisterClick} />;
});

export default ConditionalUserInterestPackageList;