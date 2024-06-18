import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/admin/Sidebar';
import styles from '../../styles/admin/Dashboard.module.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [registrationStats, setRegistrationStats] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10); // 페이지당 항목 수
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchRegistrationStats = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admins/registration-stats-monthly', {
                    params: {
                        startDate: '2023-01-01',
                        endDate: new Date().toISOString().split('T')[0], // 오늘 날짜
                        page,
                        size: 500 // 모든 데이터를 가져와서 그래프로 사용하기 위해 큰 숫자로 설정
                    }
                });
                console.log(response.data); // API 응답 데이터 로그 출력
                const stats = Object.entries(response.data)
                    .map(([date, count]) => ({ date, count }))
                    .sort((a, b) => new Date(b.date) - new Date(a.date)); // 최신 날짜순으로 정렬

                setRegistrationStats(stats);
                setTotalPages(Math.ceil(stats.length / size));
            } catch (error) {
                console.error('Error fetching registration stats:', error);
            }
        };

        fetchRegistrationStats();
    }, [page, size]);

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
                            <h2>방문자 현황</h2>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
