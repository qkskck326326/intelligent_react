import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient"; // axiosClient를 가져옴
import styles from '../../styles/lecture/lectureList.module.css';

const LectureList = () => {
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        fetchData();
    }, []);

    const getProgressLabel = (lectureRead) => {
        return lectureRead === 'Y' ? 'Y' : 'N';
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.tableContainer}>
            <h1 className={styles.packagetitle}>강의 목록</h1>
            <table className="table">
                <thead>
                    <tr className={styles.subtitle}>
                        <th className={styles.num} scope="col">번호</th>
                        <th className={styles.title} scope="col">제목</th>
                        <th className={styles.read} scope="col">나의 진행도</th>
                    </tr>
                </thead>
                <tbody className={styles.list}>
                    {lectures.map((lecture, index) => (
                        <tr key={lecture.lectureId}>
                            <th scope="row">{index + 1}</th>
                            <td className="lessonTitle">{lecture.lectureName}</td>
                            <td>{getProgressLabel(lecture.lectureRead)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LectureList;
