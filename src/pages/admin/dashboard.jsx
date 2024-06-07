import React from 'react';
import Sidebar from '../../components/admin/Sidebar';
import styles from '../../styles/admin/Dashboard.module.css';

const Dashboard = () => {
    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.main}>
                <div className={styles.header}>
                    <button className={styles.logout}>로그아웃</button>
                </div>
                <div className={styles.content}>
                    <h1 className={styles.title}>대시보드</h1>
                    <div className={styles.cards}>
                        <div className={styles.card}>
                            <h2>방문자 현황</h2>
                            <img src="/images/graph.png" alt="방문자 현황 그래프" />
                        </div>
                        <div className={styles.card}>
                            <h2>일자별 현황</h2>
                            <img src="/images/table.png" alt="일자별 현황 테이블" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
