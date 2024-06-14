import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { axiosClient } from '../../axiosApi/axiosClient';
import styles from '../../styles/lecturePackage/lecturePackageDetail.module.css';

const LecturePackageDetail = ({ lecturePackageId }) => {
    const router = useRouter();

    const [lecturePackage, setLecturePackage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLecturePackage = async () => {
            setLoading(true);
            console.log("lecturePackageId : ", lecturePackageId);
            try {
                const response = await axiosClient.get('/packages/detail', { params: { lecturePackageId } });
                setLecturePackage(response.data);
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.container}>
            {lecturePackage && (
                <>
                    <h1 className={styles.title}>{lecturePackage.title}</h1>
                    <div className={styles.form}>
                        <div className={styles.left}>
                            <div className={styles.field}>
                                <label>내용:</label>
                                <p>입력되지 않은 부분이 있습니다. 입력해주세요.</p>
                            </div>
                            <div className={styles.field}>
                                <label>카테고리:</label>
                                <div className={styles.categories}>
                                    {lecturePackage.subCategoryName.split(',').map((category, index) => (
                                        <span key={index} className={styles.category}>{category}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={styles.center}>
                            <div className={styles.field}>
                                <label>내용:</label>
                                <p>{lecturePackage.content}</p>
                            </div>
                            <div className={styles.field}>
                                <label>패키지 금액:</label>
                                <p>{lecturePackage.price} 원</p>
                            </div>
                            <div className={styles.field}>
                                <label>강의 등록 날짜:</label>
                                <p>{lecturePackage.register}</p>
                            </div>
                            <div className={styles.field}>
                                <label>기술 스택:</label>
                                <div className={styles.techStack}>
                                    {lecturePackage.techStackPath.split(',').map((tech, index) => (
                                        <img key={index} src={tech} alt={`tech-${index}`} />
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
};

export default LecturePackageDetail;