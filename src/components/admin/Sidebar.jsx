import React from 'react';
import Link from 'next/link';
import styles from '../../styles/admin/Sidebar.module.css';

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <ul className={styles.nav}>
                <li className={styles.navHeader}>ADMIN</li>
                <li><Link href="/">사이트 바로가기</Link></li>
                <li><Link href="/admin/site-management">사이트관리</Link></li>
                <li><Link href="/admin/dashboard">대시보드</Link></li>
                <li><Link href="/admin/user-management">사용자 관리</Link></li>
                <li><Link href="/admin/content-management">컨텐츠 관리</Link></li>
                <li><Link href="/admin/board-management">게시판 관리</Link></li>
                <li><Link href="/admin/qna-management">QnA관리</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
