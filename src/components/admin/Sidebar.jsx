import React from 'react';
import styles from '../../styles/admin/sidebar.module.css';

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <ul className={styles.nav}>
                <li className={styles.navHeader}>ADMIN</li>
                <li>사이트 바로가기</li>
                <li>사이트관리</li>
                <li>대시보드</li>
                <li>사용자 관리</li>
                <li>컨텐츠 관리</li>
                <li>게시판 관리</li>
                <li>QnA관리</li>
            </ul>
        </div>
    );
};

export default Sidebar;
