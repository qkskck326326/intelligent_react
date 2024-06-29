import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
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
    const [isInCart, setIsInCart] = useState(false); // 장바구니에 있는지 여부를 나타내는 상태 추가

    useEffect(() => {
        const fetchLecturePackage = async () => {
            setLoading(true);
            console.log("lecturePackageId : ", lecturePackageId);
            console.log("nickname : ", authStore.getNickname());

            try {
                const response = await axiosClient.get('/packages/detail', { params: { lecturePackageId } });
                setLecturePackage(response.data);
                console.log("lecturePackage : ", response.data);
                console.log("datanickname : ", response.data.nickname);
                // 특정 패키지의 강의 수
                const responseCount = await axiosClient.get('/packages/lecturecount', { params: { lecturePackageId } });
                setLectureCount(responseCount.data);

                // 장바구니에 있는지 확인
                const userEmail = authStore.getUserEmail();
                const provider = authStore.getProvider();
                const responseCart = await axiosClient.get('/cart/check', { params: { userEmail, provider, lecturePackageId } });
                setIsInCart(responseCart.data.inCart);

                console.log("responseCount : ", responseCount.data);

                const teacherNickname = response.data.nickname;
                console.log("teacher : ", teacherNickname);
                const profileResponse = await axiosClient.get(`/packages/profile?nickname=${teacherNickname}`);
                const profile = profileResponse.data.profileImageUrl;
                setProfile({ nickname: teacherNickname, pictureUrl: profile });

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

    // 조회수 처리 작성자인 경우 하루에 한번만 올릴 수 있음.
    useEffect(() => {
        const increaseViewCount = async (authorNickname) => {
            const nickname = authStore.getNickname();
            if (authorNickname && nickname) {
                const encodedNickname = encodeURIComponent(nickname); // URL 인코딩
                const viewCookieName = `packageViewed_${lecturePackageId}_${encodedNickname}`;
                const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
                    const [name, value] = cookie.split('=');
                    acc[name] = value;
                    return acc;
                }, {});

                const isViewed = cookies[viewCookieName];
                console.log(`isViewed: ${isViewed}, authorNickname: ${authorNickname}, nickname: ${nickname}`);

                if (authorNickname === nickname) {
                    // 작성자인 경우 하루에 한 번만 조회수 증가
                    if (!isViewed) {
                        document.cookie = `${viewCookieName}=true; path=/; max-age=${60 * 60 * 24}`;
                        await axiosClient.put(`/packages/view/${lecturePackageId}`, null, { params: { nickname: encodedNickname } }); // URL 인코딩된 닉네임 전송
                        console.log("View count increased for author.");
                    } else {
                        console.log("Author has already viewed this today.");
                    }
                } else {
                    // 작성자가 아닌 경우 매번 조회수 증가
                    await axiosClient.put(`/packages/view/${lecturePackageId}`, null, { params: { nickname: encodedNickname } }); // URL 인코딩된 닉네임 전송
                    console.log("View count increased for non-author.");
                }
            }
        };
        if (lecturePackage) {
            const authorNickname = lecturePackage.nickname;
            increaseViewCount(authorNickname);
        }
    }, [lecturePackage]);

    useEffect(() => {
        if (lecturePackage) {
            const convertMediaToIframe = () => {
                const contentDiv = document.getElementById('content');
                if (!contentDiv) return;

                const oembedElements = contentDiv.getElementsByTagName('oembed');
                for (const oembed of oembedElements) {
                    const url = oembed.getAttribute('url');
                    const iframe = document.createElement('iframe');
                    iframe.setAttribute('src', url.replace('watch?v=', 'embed/'));
                    iframe.setAttribute('width', '560');
                    iframe.setAttribute('height', '315');
                    iframe.setAttribute('frameborder', '0');
                    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                    iframe.setAttribute('allowfullscreen', 'true');
                    oembed.parentNode.replaceChild(iframe, oembed);
                }

                const videoElements = contentDiv.getElementsByTagName('video');
                for (const video of videoElements) {
                    const url = video.getAttribute('src');
                    const iframe = document.createElement('iframe');
                    iframe.setAttribute('src', url);
                    iframe.setAttribute('width', '560');
                    iframe.setAttribute('height', '315');
                    iframe.setAttribute('frameborder', '0');
                    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                    iframe.setAttribute('allowfullscreen', 'true');
                    video.parentNode.replaceChild(iframe, video);
                }
            };

            convertMediaToIframe();
        }
    }, [lecturePackage]);

    const handleDelete = async () => {
        const confirmDelete = confirm('정말로 이 패키지를 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                await axiosClient.delete(`/packages/${lecturePackageId}`);
                alert('패키지가 성공적으로 삭제되었습니다.');
                router.push('/lecturePackage'); // 목록 페이지로 이동
            } catch (error) {
                console.error('삭제 중 오류 발생:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const handleEdit = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/packages/detail`, { params: { lecturePackageId } });
            router.push({
                pathname: `/lecturePackage/edit/${lecturePackage.lecturePackageId}`,
                query: { data: JSON.stringify(response.data) }
            });
        } catch (error) {
            console.error('패키지 데이터를 가져오는 중 오류 발생:', error);
            alert('데이터를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 가격에 천단위로 , 써줌.
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
                    router.push("/cart"); // 장바구니 페이지로 이동
                }
            } else if (response.status === 409) {
                // 409 Conflict 상태 코드 확인
                const userConfirmed = window.confirm(
                    "이미 장바구니에 추가하셨습니다. 장바구니 페이지로 이동하시겠습니까?"
                );
                if (userConfirmed) {
                    router.push("/cart"); // 장바구니 페이지로 이동
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
                    router.push("/cart"); // 장바구니 페이지로 이동
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
                        <div className={styles.topInfo}>
                            <div className={styles.infoItem}>
                                <p>등록 날짜: {lecturePackage.registerDate}</p>
                            </div>
                        </div>
                        <div>
                            <div className={styles.redBox}>
                                <div
                                    id="content"
                                    className={styles.content}
                                    style={{ backgroundColor: lecturePackage.backgroundColor }} // 배경색 적용
                                    dangerouslySetInnerHTML={{ __html: lecturePackage.content }}
                                />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label>기술 분야</label>
                            <div className={styles.categories}>
                                {lecturePackage.subCategoryName.split(',').map((category, index) => (
                                    <span key={index} className={styles.category}>{category}</span>
                                ))}
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label>사용될 프로그래밍 tool</label>
                            <div className={styles.techStack}>
                                {lecturePackage.techStackPath.split(',').map((tech, index) => (
                                    <img key={index} src={tech} alt={`tech-${index}`} />
                                ))}
                            </div>
                        </div>
                        <div className={styles.applyBox}>
                            <div className={styles.fixedBox}>
                                <div className={styles.applyTextContaner}>
                                    <span className={styles.applyText}>지금바로 신청하세요!!</span>
                                </div>
                                <div className={styles.discount}>30%할인가</div>
                                <div className={styles.price}>{formatPrice(lecturePackage.priceForever)}원</div>
                                <button className={styles.applyButton} onClick={isInCart ? () => router.push("/cart") : handleApply}>
                                    {isInCart ? '장바구니로 이동' : '수강 신청하기'}
                                </button>
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