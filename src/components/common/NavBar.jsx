import React from 'react';
import { Container } from 'react-bootstrap';
import styles from '../../styles/NavBar.module.css'; // CSS 모듈을 import

const NavBar = () => {
    return (
        <div className={styles.navbar}>
            <ul>
                <li>백엔드</li>
                <li>프론트엔드</li>
                <li>인공지능</li>
                <li>개발툴</li>
                <li>알고리즘</li>
                <li>ChatGpt</li>
            </ul>
            <Container className={styles['search-container']}>
                <img src={'/images/search.png'} style={{ width: '50px', height: '50px' }} alt="Search" />
                <input type="text" placeholder="과정을 검색하세요..." className={styles.search} />
            </Container>
        </div>
    );
};

export default NavBar;
