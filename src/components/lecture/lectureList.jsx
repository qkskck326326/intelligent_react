import React, { useState, useEffect, useCallback } from "react";
import Link from 'next/link';
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from '../../styles/lecture/lectureList.module.css';
import authStore from '../../stores/authStore';

const LectureList = ({ lecturePackageId, onSelectLecture, isOwner, fetchData, lectures }) => {
    const [lecturePackageTitle, setLecturePackageTitle] = useState('');
    const [deletingMode, setDeletingMode] = useState(false);
    const [selectedLectures, setSelectedLectures] = useState(new Set());
    const [isLayerOpen, setIsLayerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [lectureReadStatuses, setLectureReadStatuses] = useState({});

    const completedLecturesCount = Object.values(lectureReadStatuses).filter(status => status === 'Y').length;
    const totalLecturesCount = lectures.length;

    const fetchLecturePackageTitle = useCallback(() => {
        axiosClient.get(`/lecture/title/${lecturePackageId}`)
            .then(response => {
                setLecturePackageTitle(response.data.title);
            })
            .catch(err => {
                console.error("Error fetching lecture package title:", err);
            });
    }, [lecturePackageId]);

    useEffect(() => {
        fetchLecturePackageTitle();
    }, [lecturePackageId, fetchLecturePackageTitle]);

    useEffect(() => {
        const fetchReadStatuses = async () => {
            const nickname = authStore.getNickname();
            const statuses = {};
            for (const lecture of lectures) {
                const status = await getLectureReadStatus(lecture.lectureId, nickname);
                statuses[lecture.lectureId] = status;
            }
            setLectureReadStatuses(statuses);
        };
        fetchReadStatuses();
    }, [lectures]);

    const getLectureReadStatus = async (lectureId, nickname) => {
        try {
            const response = await axiosClient.get(`/lecture/read-status/${lectureId}?nickname=${nickname}`);
            return response.data.lectureRead || 'N';
        } catch (err) {
            console.error("Error fetching lecture read status:", err);
            return 'N';
        }
    };

    const handleDeleteLectures = async () => {
        try {
            setIsLoading(true);
            setIsDeleted(false); // 삭제 상태 초기화

            // 강의 정보 가져오기
            const lecturesToDelete = lectures.filter(lecture => selectedLectures.has(lecture.lectureId));

            console.log('Lectures to delete:', lecturesToDelete);

            // GitHub에서 파일 삭제를 위해 경로 수집
            const pathsToDelete = lecturesToDelete.flatMap(lecture => {
                const paths = [];
                if (lecture.lectureThumbnail) {
                    paths.push(`thumbnails/${lecture.lectureThumbnail}`);
                }
                if (lecture.streamUrl) {
                    const videoFileName = lecture.streamUrl.split('/').pop();
                    paths.push(`uploads/${videoFileName}`);
                }
                return paths;
            });

            // 서버에서 강의 삭제 및 GitHub 파일 삭제 요청
            const response = await axiosClient.delete("/lecture/delete", {
                data: { lectureIds: Array.from(selectedLectures), files: pathsToDelete }
            });

            if (response.status === 200) {
                console.log('Files and lectures deleted successfully');
            } else {
                console.error('Error deleting files and lectures:', response.statusText);
            }

            fetchData(); // 강의 삭제 후 목록 새로고침
            setSelectedLectures(new Set());
            setDeletingMode(false);
            setIsLayerOpen(false);
            setIsDeleted(true);
            setIsLoading(false);
        } catch (err) {
            console.error("Error deleting lectures:", err.response ? err.response.data : err.message);
            setIsLoading(false);
        }
    };

    const handleSelectLecture = (lectureId) => {
        setSelectedLectures(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(lectureId)) {
                newSelected.delete(lectureId);
            } else {
                newSelected.add(lectureId);
            }
            return newSelected;
        });
    };

    const openLayer = () => {
        setIsLayerOpen(true);
        setIsDeleted(false);
    };

    const closeLayer = () => {
        setIsLayerOpen(false);
    };

    return (
        <div className={styles.tableContainer}>
            <div className={styles.headerContainer}>
                <h1 className={styles.packagetitle}>{lecturePackageTitle}</h1>
            </div>
            {isOwner && (
                <div className={styles.buttonContainer}>
                    <button onClick={() => setDeletingMode(!deletingMode)}>
                        {deletingMode ? '취소' : '강의 삭제'}
                    </button>
                    {deletingMode && (
                        <button onClick={openLayer} disabled={selectedLectures.size === 0}>
                            선택한 강의 삭제
                        </button>
                    )}
                </div>
            )}
            <table className={styles.table}>
                <thead>
                    <tr className={styles.subtitle}>
                        <th className={styles.num} scope="col">번호</th>
                        <th className={styles.title} scope="col">제목</th>
                        <th className={styles.read} scope="col">시청 여부</th>
                        {deletingMode && <th className={styles.select} scope="col">선택</th>}
                    </tr>
                </thead>
                <tbody>
                    {lectures.map((lecture, index) => (
                        <tr
                            className={styles.list}
                            key={lecture.lectureId}
                            onClick={() => !deletingMode && onSelectLecture(lecture.lectureId)}
                        >
                            <th className={styles.num} scope="row">{index + 1}</th>
                            <td className={styles.title}>
                                <Link href={`/lecture/detail?lectureId=${lecture.lectureId}`} legacyBehavior>
                                    <a href={`/lecture/detail?lectureId=${lecture.lectureId}`}>{lecture.lectureName}</a>
                                </Link>
                            </td>
                            <td className={styles.read}>
                                {lectureReadStatuses[lecture.lectureId] === 'Y' ? '시청 완료' : '미시청'}
                            </td>
                            {deletingMode && (
                                <td className={styles.select}>
                                    <input
                                        type="checkbox"
                                        checked={selectedLectures.has(lecture.lectureId)}
                                        onChange={() => handleSelectLecture(lecture.lectureId)}
                                    />
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div className={styles.summary}>
                {`현재 시청율  ${completedLecturesCount} / ${totalLecturesCount}`}
            </div>

            {isLayerOpen && (
                <div className={styles.layerContainer}>
                    <div className={styles.layerContent}>
                        {isLoading ? (
                            <>
                                <p>삭제 중입니다. 잠시만 기다려 주세요...</p>
                                <div className={styles.loadingIcon}></div>
                            </>
                        ) : isDeleted ? (
                            <>
                                <p>삭제가 완료 되었습니다.</p>
                                <div className={styles.layerButtons}>
                                    <button className={styles.secondaryButton} onClick={closeLayer}>
                                        확인
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3>삭제 확인</h3>
                                <p>선택한 강의를 삭제하시겠습니까?</p>
                                <div className={styles.layerButtons}>
                                    <button className={styles.secondaryButton} onClick={closeLayer}>
                                        취소
                                    </button>
                                    <button className={styles.dangerButton} onClick={handleDeleteLectures}>
                                        삭제
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LectureList;
