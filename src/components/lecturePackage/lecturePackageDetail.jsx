import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import DOMPurify from "dompurify";
import { axiosClient } from '../../axiosApi/axiosClient';
import styles from '../../styles/lecturePackage/lecturePackageDetail.module.css';
import authStore from '../../stores/authStore';
import { observer } from "mobx-react";
import ProfileModal from "./profileModal";

const LecturePackageDetail = observer(() => {
    const router = useRouter();
    const { lecturePackageId } = router.query;

    const [lecturePackage, setLecturePackage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState({ nickname: '', pictureUrl: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lectureCount, setLectureCount] = useState(null);
    const [isInCart, setIsInCart] = useState(false);
    const nickname = authStore.getNickname()

    useEffect(() => {
        const fetchLecturePackage = async () => {

            if (!nickname) {
                alert("로그인을 해야 이용이 가능합니다.");
                router.push('/user/login'); // 로그인 페이지로 이동
            }


            setLoading(true);
            console.log("lecturePackageId : ", lecturePackageId);
            console.log("nickname : ", authStore.getNickname());

            try {
                const response = await axiosClient.get('/packages/detail', {params: {lecturePackageId}});
                setLecturePackage(response.data);
                console.log("lecturePackage : ", response.data);
                console.log("datanickname : ", response.data.nickname);
                const responseCount = await axiosClient.get('/packages/lecturecount', {params: {lecturePackageId}});
                setLectureCount(responseCount.data);

                const userEmail = authStore.getUserEmail();
                const provider = authStore.getProvider();
                const responseCart = await axiosClient.get('/cart/check', {
                    params: {
                        userEmail,
                        provider,
                        lecturePackageId
                    }
                });
                setIsInCart(responseCart.data.inCart);

                console.log("responseCount : ", responseCount.data);

                const teacherNickname = response.data.nickname;
                console.log("teacher : ", teacherNickname);
                const profileResponse = await axiosClient.get(`/packages/profile?nickname=${teacherNickname}`);
                const profile = profileResponse.data.profileImageUrl;
                setProfile({nickname: teacherNickname, pictureUrl: profile});

                console.log("profile : ", profile);



            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (lecturePackageId) {
            fetchLecturePackage();
        }
    }, [lecturePackageId]);

    useEffect(() => {
        const increaseViewCount = async (authorNickname) => {
            const nickname = authStore.getNickname();
            if (authorNickname && nickname) {
                const encodedNickname = encodeURIComponent(nickname);
                const viewCookieName = `packageViewed_${lecturePackageId}_${encodedNickname}`;
                const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
                    const [name, value] = cookie.split('=');
                    acc[name] = value;
                    return acc;
                }, {});

                const isViewed = cookies[viewCookieName];
                console.log(`isViewed: ${isViewed}, authorNickname: ${authorNickname}, nickname: ${nickname}`);

                if (authorNickname === nickname) {
                    if (!isViewed) {
                        document.cookie = `${viewCookieName}=true; path=/; max-age=${60 * 60 * 24}`;
                        await axiosClient.put(`/packages/view/${lecturePackageId}`, null, { params: { nickname: encodedNickname } });
                        console.log("View count increased for author.");
                    } else {
                        console.log("Author has already viewed this today.");
                    }
                } else {
                    await axiosClient.put(`/packages/view/${lecturePackageId}`, null, { params: { nickname: encodedNickname } });
                    console.log("View count increased for non-author.");
                }
            }
        };
        if (lecturePackage) {
            const authorNickname = lecturePackage.nickname;
            increaseViewCount(authorNickname);
        }
    }, [lecturePackage]);

    const renderContent = () => {
        const sanitizedContent = DOMPurify.sanitize(lecturePackage.content, {
            ADD_TAGS: ["iframe", "oembed"],
            ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "url"],
        });

        const parsedContent = new DOMParser().parseFromString(sanitizedContent, "text/html");

        parsedContent.querySelectorAll("oembed[url]").forEach((element) => {
            const url = element.getAttribute("url");
            const iframe = document.createElement("iframe");

            //YouTube URL에서 'watch?v='를 'embed/'로 대체
            let embedUrl = url.replace("watch?v=", "embed/");

            //YouTube URL에 'list' 매개변수가 포함된 경우 '&'를 '?'로 변경
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
            iframe.setAttribute("width", "300");
            iframe.setAttribute("height", "150");

            element.parentNode.replaceChild(iframe, element);
        });

        return { __html: parsedContent.body.innerHTML };
    };





    const handleDelete = async () => {
        const confirmDelete = confirm('정말로 이 패키지를 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                await axiosClient.delete(`/packages/${lecturePackageId}`);
                alert('패키지가 성공적으로 삭제되었습니다.');
                router.push('/lecturePackage');
            } catch (error) {
                console.error('삭제 중 오류 발생:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const handleEdit = () => {
        setLoading(true);
        try {
            // const response = await axiosClient.get(`/packages/detail`, { params: { lecturePackageId } });
            router.push({
                pathname: `/lecturePackage/edit/${lecturePackage.lecturePackageId}`,
                // query: { data: JSON.stringify(response.data) }
            });
        } catch (error) {
            console.error('패키지 데이터를 가져오는 중 오류 발생:', error);
            alert('데이터를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (priceForever) => {
        return new Intl.NumberFormat('ko-KR').format(priceForever);
    };

    const getLectureLevel = (level) => {
        switch (level) {
            case 0:
                return '입문';
            case 1:
                return '기본';
            case 2:
                return '심화';
            default:
                return '알 수 없음';
        }
    };

    const handleApply = async () => {
        const userEmail = authStore.getUserEmail();
        const provider = authStore.getProvider();
        console.log("lecturePackageId: ", lecturePackageId);

        try {
            const response = await axiosClient.post(
                `/cart/add/${userEmail}/${provider}/${lecturePackageId}`
            );
            if (response.status === 200) {
                const userConfirmed = window.confirm(
                    "장바구니에 추가되었습니다. 장바구니로 이동하시겠습니까?"
                );
                if (userConfirmed) {
                    router.push("/cart");
                }
            } else if (response.status === 409) {
                const userConfirmed = window.confirm(
                    "이미 장바구니에 추가하셨습니다. 장바구니 페이지로 이동하시겠습니까?"
                );
                if (userConfirmed) {
                    router.push("/cart");
                }
            } else {
                alert("장바구니에 추가하는 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("Error adding package to cart:", error);
            if (error.response && error.response.status === 409) {
                const userConfirmed = window.confirm(
                    "이미 장바구니에 추가하셨습니다. 장바구니 페이지로 이동하시겠습니까?"
                );
                if (userConfirmed) {
                    router.push("/cart");
                }
            } else {
                alert("장바구니에 추가하는 중 오류가 발생했습니다.");
            }
        }
    };

    const handleLectureList = () => {
        router.push({
            pathname: '/lecture/list',
            query: { lecturePackageId }
        });
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('페이지 링크가 복사되었습니다.');
        }).catch((err) => {
            console.error('복사 중 오류 발생:', err);
        });
    };

    const openProfileModal = () => {
        setIsModalOpen(true);
    };

    const closeProfileModal = () => {
        setIsModalOpen(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const isAuthor = lecturePackage && authStore.getNickname() === lecturePackage.nickname;


    return (
        <div className={styles.bodys}>
            <div className={styles.actions}>
                <div className={styles.profile} onClick={() => openProfileModal()}>
                    <img src={profile.pictureUrl} alt="프로필 사진" className={styles.profilePicture} />
                    <p className={styles.nickname}>{profile.nickname}</p>
                </div>
                <div className={styles.threebtn}>
                    <button className={styles.actionButton} onClick={() => router.push('/lecturePackage')}>
                        패키지 리스트로 이동
                    </button>
                    {isAuthor && (
                        <>
                            <button className={styles.actionButton} onClick={handleLectureList}>
                                강의 목록
                            </button>
                            <button className={styles.actionButton} onClick={handleEdit}>
                                수정하기
                            </button>
                            <button className={styles.actionButton} onClick={handleDelete}>
                                삭제하기
                            </button>
                        </>
                    )}
                    {authStore.checkIsAdmin() && !isAuthor && (
                        <>
                            <button className={styles.actionButton} onClick={handleLectureList}>
                                강의 목록
                            </button>
                            <button className={styles.actionButton} onClick={handleDelete}>
                                삭제하기
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className={styles.container}>
                {lecturePackage && (
                    <>
                        <h1 className={styles.title}>{lecturePackage.title}</h1>
                        <div className={styles.middleContainer}>
                            <div>
                                <div className={styles.topInfo}>
                                    <div className={styles.infoItem}>
                                        <p className={styles.register}>등록 날짜: {lecturePackage.registerDate}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className={styles.redBox}>
                                        <div
                                            id="content"
                                            className={styles.content}
                                            style={{backgroundColor: lecturePackage.backgroundColor}}
                                            dangerouslySetInnerHTML={renderContent()}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.recommendContent}>
                                <h3 className={styles.recommend}>이런 분들께 추천드려요!</h3>

                                <div className={styles.recommendSplit}>
                                    {/* 학습대상자 섹션 */}
                                    {lecturePackage.learningContent && (
                                        <div className={styles.learningPerson}>
                                            <div className={styles.sectionHeader}>
                                                <img src="/images/learning_person.png" alt="학습대상자 아이콘" className={styles.icon} />
                                                <span className={styles.learningText}>학습 대상은 누구일까요?</span>
                                            </div>
                                            <div className={styles.sectionContent}>
                                                {lecturePackage.learningContent.map((item, index) => (
                                                    <div key={index}>
                                                        <span className={styles.checkIcon}>✔</span>
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {/* 선수 지식 섹션 */}
                                    {lecturePackage.readyContent && (
                                        <div className={styles.readyKnowledge}>
                                            <div className={styles.sectionHeader}>
                                                <img src="/images/readyIcon.png" alt="선수 지식 아이콘" className={styles.icon} />
                                                <span className={styles.readyText}>선수 지식, 필요할까요?</span>
                                            </div>
                                            <div className={styles.sectionContent}>
                                                {lecturePackage.readyContent.map((item, index) => (
                                                    <div key={index}>
                                                        <span className={styles.checkIcon}>✔</span>
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    )}
                                </div>
                            </div>


                            <div className={styles.field1}>
                                <div class="field1-header">
                                    <div className={styles.presentText}>앞으로 배울 </div>
                                    <label className={styles.subCategoryText}> 기술 분야</label>

                                    <div className={styles.categories}>
                                        {lecturePackage.subCategoryName.split(',').map((category, index) => (
                                            <span key={index} className={styles.category}>{category}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.field2}>
                                <label>사용될 프로그래밍 tool</label>
                                <div className={styles.techStack}>
                                    {lecturePackage.techStackPath.split(',').map((tech, index) => (
                                        <img key={index} src={tech} alt={`tech-${index}`} />
                                    ))}
                                </div>
                            </div>

                        </div>
                        <div className={styles.applyBox}>
                            <div className={styles.fixedBox}>
                                <div className={styles.applyTextContaner}>
                                    <span className={styles.applyText}>지금바로 신청하세요!!</span>
                                </div>
                                <div className={styles.discount}>30%할인가</div>
                                <div className={styles.price}>{formatPrice(lecturePackage.priceForever)}원</div>
                                {(authStore.getNickname() === lecturePackage.nickname && authStore.checkIsTeacher() === true)? (
                                    <span className={styles.applyButton}>수강신청 버튼</span>
                                ) : (
                                    <button className={styles.applyButton}
                                            onClick={isInCart ? () => router.push("/cart") : handleApply}>
                                        {isInCart ? '장바구니로 이동' : '수강 신청하기'}
                                    </button>
                                )}

                                <div className={styles.horizontalLine}></div>
                                <button className={styles.shareButton} onClick={handleShare}>
                                <img
                                        className={styles.shareIcon}
                                        src="/images/link.png"
                                        alt="공유 아이콘" />
                                    <span className={styles.shareText}>공유</span>
                                </button>
                                <span>
                                    ♡ ♥
                                </span>
                                <div className={styles.field}>
                                    <span className={styles.levelText}>강의 수 : </span>
                                    <span className={styles.level}>{lectureCount}</span>
                                </div>
                                <div className={styles.field}>
                                    <span className={styles.levelText}> 난이도 : </span>
                                    <span className={styles.level}>
                                        {getLectureLevel(lecturePackage.packageLevel)}
                                    </span>
                                </div>
                                <div>
                                    <span className={styles.levelText}>평균수강기한 : </span>
                                    <span className={styles.level}>{lecturePackage.averageClassLength}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.viewCountContainer}>
                                        <img
                                            className={styles.viewCountIcon}
                                            src="/images/view_count_icon.png"
                                            alt="조회수 아이콘"
                                        />
                                        <span className={styles.viewCountText}>{lecturePackage.viewCount}</span>
                                    </span>
                                </div>
                                <div className={styles.horizontalLine}></div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {isModalOpen && <ProfileModal profile={profile} onClose={closeProfileModal} />}
        </div>
    );
});

export default LecturePackageDetail;