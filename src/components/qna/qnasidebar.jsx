import React, { useState, useEffect } from 'react';
import styles from '../../styles/qna/qna.module.css';

export default function QnaSideBar() {
    const [currentPath, setCurrentPath] = useState('');

    useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, []);

    const isActive = (path) => currentPath === path ? styles.active : '';

    return (
        <ul className={styles.sideBarContainer}>
            <p>고객센터</p>
            <li className={styles.sideBarItem} onClick={() => window.location.href = '/cs'}>공지사항</li>
            <li className={styles.sideBarItem} onClick={() => window.location.href = '/qnaQuestion/list'}>QnA</li>
            <ul className={styles.subMenu}>
                <li className={`${styles.subMenuItem} ${isActive('/qnaQuestion/list')}`} onClick={() => window.location.href = '/qnaQuestion/list'}>▶ 질문한 목록</li>
                <li className={`${styles.subMenuItem} ${isActive('/qnaQuestion/answered')}`} onClick={() => window.location.href = '/qnaQuestion/answered'}>▶ 답변온 목록</li>
            </ul>
        </ul>
    );
}
