import { useEffect, useState } from 'react';
import {axiosClient} from "../../axiosApi/axiosClient";
import styles from '../../styles/admin/reportList.module.css';

const ReportList = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axiosClient.get('/reports');
                setReports(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const getReportType = (type) => {
        switch(type) {
            case 0: return '공유게시판';
            case 1: return '댓글';
            case 2: return '채팅';
            default: return '알 수 없음';
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>신고</h1>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>신고인</th>
                    <th>피신고인</th>
                    <th>신고 내용</th>
                    <th>신고 날짜</th>
                    <th>종류</th>
                    <th>승인 여부</th>
                </tr>
                </thead>
                <tbody>
                {reports.map(report => (
                    <tr key={report.reportId}>
                        <td>{report.doNickname}</td>
                        <td>{report.receiveNickname}</td>
                        <td>{report.content}</td>
                        <td>{new Date(report.reportDate).toLocaleString()}</td>
                        <td>{getReportType(report.reportType)}</td>
                        <td>
                            <button className={styles.approveButton}>승인</button>
                            <button className={styles.deleteButton}>삭제</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReportList;