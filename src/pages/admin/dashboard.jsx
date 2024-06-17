import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/admin/Sidebar';
import styles from '../../styles/admin/Dashboard.module.css';

const Dashboard = () => {
    const [registrationStats, setRegistrationStats] = useState([]);

    useEffect(() => {
        const fetchRegistrationStats = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admins/registration-stats', {
                    params: {
                        startDate: '2023-01-01',
                        endDate: new Date().toISOString().split('T')[0] // 오늘 날짜
                    }
                });
                console.log(response.data); // API 응답 데이터 로그 출력
                setRegistrationStats(Object.entries(response.data));
            } catch (error) {
                console.error('Error fetching registration stats:', error);
            }
        };

        fetchRegistrationStats();
    }, []);

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.main}>
                <div className={styles.content}>
                    <h1 className={styles.title}>대시보드</h1>
                    <div className={styles.cards}>
                        <div className={styles.card}>
                            <h2>방문자 현황</h2>
                            <img src="/images/graph.png" alt="방문자 현황 그래프" />
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
                                    registrationStats.map(([date, count]) => (
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
