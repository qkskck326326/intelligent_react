import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import styles from '../../styles/admin/Dashboard.module.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { axiosClient } from "../../axiosApi/axiosClient";

const Dashboard = () => {
    const [registrationStats, setRegistrationStats] = useState([]);
    const [visitStats, setVisitStats] = useState([]); // 방문자 수 상태 추가
    const [page, setPage] = useState(0);
    const [size] = useState(10); // 페이지당 항목 수를 10으로 설정
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchRegistrationStats();
        fetchVisitStats(); // 방문자 수 데이터 가져오기
    }, [page, size]);

    const fetchRegistrationStats = async () => {
        try {
            const response = await axiosClient.get('/admins/registration-stats', {
                params: {
                    startDate: '2023-01-01',
                    endDate: new Date().toISOString().split('T')[0],
                    page,
                    size // size를 10으로 설정
                }
            });
            const stats = response.data.content.map(({ date, count }) => ({ date, count }))
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            setRegistrationStats(stats);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching registration stats:', error);
        }
    };

    const fetchVisitStats = async () => { // 방문자 수 데이터 가져오기 함수
        try {
            const response = await axiosClient.get('/admins/visit-counts', {
                params: {
                    startDate: '2023-01-01',
                    endDate: new Date().toISOString().split('T')[0]
                }
            });
            const stats = response.data.map(({ date, count }) => ({ date, count }))
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            setVisitStats(stats);
        } catch (error) {
            console.error('Error fetching visit stats:', error);
        }
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
        }
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.main}>
                <div className={styles.header}>
                    <button className={styles.logout}>Logout</button>
                </div>
                <div className={styles.content}>
                    <h1 className={styles.title}>대시보드</h1>
                    <div className={styles.cards}>
                        <div className={styles.card}>
                            <h2>사이트 현황</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={registrationStats}
                                    margin={{
                                        top: 5, right: 30, left: 20, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={styles.card}>
                            <h2>일자별 현황</h2>
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th>날짜</th>
                                    <th>가입자 수</th>
                                </tr>
                                </thead>
                                <tbody>
                                {registrationStats.length > 0 ? (
                                    registrationStats.slice(page * size, (page + 1) * size).map(({ date, count }) => (
                                        <tr key={date}>
                                            <td>{date}</td>
                                            <td>{count}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2">데이터가 없습니다</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            <div className={styles.pagination}>
                                <button onClick={handlePreviousPage} disabled={page === 0}>
                                    이전
                                </button>
                                <span>{page + 1} / {totalPages}</span>
                                <button onClick={handleNextPage} disabled={page === totalPages - 1}>
                                    다음
                                </button>
                            </div>
                        </div>
                        <div className={styles.card}>
                            <h2>방문자 수 현황</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={visitStats} // 방문자 수 데이터 사용
                                    margin={{
                                        top: 5, right: 30, left: 20, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="count" stroke="#82ca9d" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={styles.card}>
                            <h2>일자별 방문자 수 현황</h2>
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th>날짜</th>
                                    <th>방문자 수</th>
                                </tr>
                                </thead>
                                <tbody>
                                {visitStats.length > 0 ? (
                                    visitStats.slice(page * size, (page + 1) * size).map(({ date, count }) => (
                                        <tr key={date}>
                                            <td>{date}</td>
                                            <td>{count}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2">데이터가 없습니다</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            <div className={styles.pagination}>
                                <button onClick={handlePreviousPage} disabled={page === 0}>
                                    이전
                                </button>
                                <span>{page + 1} / {totalPages}</span>
                                <button onClick={handleNextPage} disabled={page === totalPages - 1}>
                                    다음
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
