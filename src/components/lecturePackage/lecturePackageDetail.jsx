import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { axiosClient } from '../../axiosApi/axiosClient';
import styles from '../../styles/lecturePackage/lecturePackageDetail.module.css';

const LecturePackageDetail = () => {
    const router = useRouter();
    const {lecturePackageId} = router.query;

    const [lecturePackage, setLecturePackage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLecturePackage = async () => {
            setLoading(true);
            console.log("lecturePackageId : ", lecturePackageId);

            try {
                const response = await axiosClient.get('/packages/detail', {params: {lecturePackageId}});
                setLecturePackage(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }

        };

        if (lecturePackageId) {
            // 조회수 증가
            axiosClient.put(`/packages/view/${lecturePackageId}`);
            fetchLecturePackage();
        }

        if (lecturePackageId) {
            fetchLecturePackage();
        }
    }, [lecturePackageId]);

    useEffect(() => {
        if (lecturePackage) {
            // oembed 태그를 iframe으로 변환하는 함수
            const convertOembedToIframe = () => {
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
            };

            convertOembedToIframe();
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
            const response = await axiosClient.get(`/packages/detail`, {params: {lecturePackageId}});
            router.push({
                pathname: `/lecturePackage/edit/${lecturePackage.lecturePackageId}`,
                query: {data: JSON.stringify(response.data)}
            });
        } catch (error) {
            console.error('패키지 데이터를 가져오는 중 오류 발생:', error);
            alert('데이터를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };



    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
    <div>
    <div className={styles.actions}>
        <button className={styles.actionButton}
                onClick={handleEdit}>수정하기
        </button>
        <button className={styles.actionButton} onClick={handleDelete}>삭제하기</button>
        <button className={styles.actionButton} onClick={() => router.push('/lecturePackage')}>패키지 리스트로
            이동
        </button>
    </div>
    <div className={styles.container}>
        {lecturePackage && (
            <>
                <h1 className={styles.title}>{lecturePackage.title}</h1>
                <div className={styles.topInfo}>
                    <div className={styles.infoItem}>
                        <p>등록 날짜: {lecturePackage.registerDate}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <p>조회수: {lecturePackage.viewCount}</p>
                    </div>
                </div>
                <div className={styles.yellowBox}>
                    <div className={styles.redBox}>
                        <div
                            id="content"
                            className={styles.content}
                            style={{backgroundColor: lecturePackage.backgroundColor}} // 배경색 적용
                            dangerouslySetInnerHTML={{__html: lecturePackage.content}}
                        />
                    </div>
                    <div className={styles.field}>
                        <p className={styles.level}><i
                            className="fas fa-check"></i> {lecturePackage.packageLevel} 과정</p>
                    </div>
                </div>
                <div className={styles.field}>
                    <p className={styles.priceKind}>{lecturePackage.priceKind === 0 ? '월정액' : '평생소장'} &gt;&gt;&gt; {formatPrice(lecturePackage.price)} ₩</p>
                </div>
                <div className={styles.field}>
                    <label>해당 카테고리</label>
                    <div className={styles.categories}>
                        {lecturePackage.subCategoryName.split(',').map((category, index) => (
                            <span key={index} className={styles.category}>{category}</span>
                        ))}
                    </div>
                </div>
                <div className={styles.field}>
                    <label>기술 스택</label>
                    <div className={styles.techStack}>
                        {lecturePackage.techStackPath.split(',').map((tech, index) => (
                            <img key={index} src={tech} alt={`tech-${index}`}/>
                        ))}
                    </div>
                </div>

            </>
        )}
        <div className={styles.fixedBox}>

            지금바로 신청하세요!! <button className={styles.applyButton}>수강신청</button>
        </div>
        <div className={styles.foot}>

        </div>
    </div>
    </div>
);

};

export default LecturePackageDetail;