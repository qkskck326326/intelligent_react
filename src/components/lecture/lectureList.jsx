import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { axiosClient } from "../../axiosApi/axiosClient";
import { Modal, Button } from 'react-bootstrap';
import styles from '../../styles/lecture/lectureList.module.css';

const LectureList = ({ lecturePackageId, onSelectLecture, isOwner, setDeletingMode }) => {
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lecturePackageTitle, setLecturePackageTitle] = useState('');
    const [deletingMode, setInternalDeletingMode] = useState(false);
    const [selectedLectures, setSelectedLectures] = useState(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = () => {
        axiosClient.get("/lecture/list")
            .then(response => {
                const responseData = response.data;
                const dataArray = Array.isArray(responseData) ? responseData : [responseData];
                setLectures(dataArray);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    };

    const fetchLecturePackageTitle = () => {
        axiosClient.get("/title", {
            params: { lecturePackageId }
        })
            .then(response => {
                setLecturePackageTitle(response.data.title);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    };

    const handleDeleteLectures = async () => {
        try {
            await axiosClient.post("/lecture/delete", { lectureIds: Array.from(selectedLectures) });
            setLectures(lectures.filter(lecture => !selectedLectures.has(lecture.lectureId)));
            setSelectedLectures(new Set());
            setInternalDeletingMode(false);
            setDeletingMode(false);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error deleting lectures:", err);
        }
    };

    useEffect(() => {
        fetchData();
        if (lecturePackageId) {
            fetchLecturePackageTitle();
        }
    }, [lecturePackageId]);

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

    const toggleDeletingMode = () => {
        setInternalDeletingMode(!deletingMode);
        setDeletingMode(!deletingMode);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.tableContainer}>
            <h1 className={styles.packagetitle}>{lecturePackageTitle}</h1>
            {isOwner && (
                <div>
                    <button onClick={toggleDeletingMode}>
                        {deletingMode ? '취소' : '삭제하기'}
                    </button>
                    {deletingMode && (
                        <button onClick={openModal} disabled={selectedLectures.size === 0}>
                            선택한 강의 삭제
                        </button>
                    )}
                </div>
            )}
            <table className={styles.table}>
                <thead>
                    <tr className={styles.subtitle}>
                        {deletingMode && <th className={styles.num} scope="col">선택</th>}
                        <th className={styles.num} scope="col">번호</th>
                        <th className={styles.title} scope="col">제목</th>
                        <th className={styles.read} scope="col">나의 진행도</th>
                    </tr>
                </thead>
                <tbody>
                    {lectures.map((lecture, index) => (
                        <tr
                            className={styles.list}
                            key={lecture.lectureId}
                            onClick={() => !deletingMode && onSelectLecture(lecture.lectureId)}
                        >
                            {deletingMode && (
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedLectures.has(lecture.lectureId)}
                                        onChange={() => handleSelectLecture(lecture.lectureId)}
                                    />
                                </td>
                            )}
                            <th className={styles.num} scope="row">{index + 1}</th>
                            <td className={styles.title}>
                                <Link href={`/lecture/detail?lectureId=${lecture.lectureId}`} legacyBehavior>
                                    <a>{lecture.lectureName}</a>
                                </Link>
                            </td>
                            <td className={styles.read}>{lecture.lectureRead}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                show={isModalOpen}
                onHide={closeModal}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>삭제 확인</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Array.from(selectedLectures).join(', ')}번 강의를 삭제하시겠습니까?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        취소
                    </Button>
                    <Button variant="danger" onClick={handleDeleteLectures}>
                        삭제
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default LectureList;
