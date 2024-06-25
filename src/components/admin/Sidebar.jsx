import React from 'react';
import Link from 'next/link';
import styles from '../../styles/admin/Sidebar.module.css';

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <ul className={styles.nav}>
                <li className={styles.navHeader}>ADMIN</li>
                <li><Link href="/">사이트 바로가기</Link></li>
                <br/>
                <br/>
                <br/>
                <li aria-readonly></li>
                <li className={styles.navHeader}>사이트관리</li>
                <li><Link href="/admin/dashboard">대시보드</Link></li>
                <li><Link href="/admin/user-management">사용자 관리</Link></li>
                <li><Link href="/admin/content-management">컨텐츠 관리</Link></li>
                <li><Link href="/admin/board-management">게시판 관리</Link></li>
                <li><Link href="/admin/qna-management">QnA관리</Link></li>
                <li><Link href="/admin/testAI">AI코드채점</Link></li>
                <li><Link href="/admin/reportList">김채림신고</Link></li>
                <li><Link href="/admin/categoryAndTechStack-management.jsx">김채림HDMI도둑김시원</Link></li>
                <li><Link href="/admin/BannerManagement">배너관리</Link></li>
                <li><Link href="/admin/test-page">테스트 페이지</Link></li>
                {/* 새 페이지 링크 추가 */}
            </ul>
        </div>
    );
};

export default Sidebar;
