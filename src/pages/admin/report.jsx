import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import styles from "../../styles/admin/report.module.css";
import ReportList from "../../components/admin/reportList";
import ReportUser from "../../components/admin/reportUser";

const Report = () => {
    const [activeTab, setActiveTab] = useState('reportList');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className={styles.container}>
            <Sidebar />

            <div>
                <div className={styles.buttons}>
                    <span
                        className={`${styles.listBtn} ${activeTab === 'reportList' ? styles.active : ''}`}
                        onClick={() => handleTabClick('reportList')}
                    >
                        신고처리
                    </span>
                    <span
                        className={`${styles.listBtn} ${activeTab === 'reportUser' ? styles.active : ''}`}
                        onClick={() => handleTabClick('reportUser')}
                    >
                        유저 신고확인
                    </span>
                </div>
                <div className={styles.main}>
                    {activeTab === 'reportList' && <ReportList />}
                    {activeTab === 'reportUser' && <ReportUser />}
                </div>
            </div>
        </div>
    );
};

export default Report;