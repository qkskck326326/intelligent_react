import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { axiosClient } from "../../axiosApi/axiosClient"; // axiosClient를 가져옴
import styles from '../../styles/lecture/lectureList.module.css';

const LectureList = ({ lecturePackageId, onSelectLecture }) => {
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lecturePackageTitle, setLecturePackageTitle] = useState('');

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

    useEffect(() => {
        fetchData();
        if (lecturePackageId) {
            fetchLecturePackageTitle();
        }
    }, [lecturePackageId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.tableContainer}>
            <h1 className={styles.packagetitle}>{lecturePackageTitle}</h1>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.subtitle}>
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
                            onClick={() => onSelectLecture(lecture.lectureId)}
                        >
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
        </div>
    );
};

export default LectureList;
