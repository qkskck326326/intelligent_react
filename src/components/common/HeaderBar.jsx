import React, { useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { authStore } from '../../stores/authStore';
import { logout } from '../../axiosApi/MemberAxios';
import styles from '../../styles/header.module.css'; // CSS 모듈을 import

const HeaderBar = observer(() => {
    const loggedIn = authStore.loggedIn; // 로그인 상태값

    useEffect(() => {
        authStore.checkLoggedIn();
    }, []);

    // 로그아웃 핸들러
    const handleLogout = () => {
        logout().then(res => {
            localStorage.clear();
            authStore.setLoggedIn(false);
        });
    };

    return (
        <Navbar collapseOnSelect expand="lg" className={styles.navbar}>
            <Navbar.Brand href="/" className={styles['navbar-brand']}>
                <img src="/images/logo.png" alt="Logo" />
            </Navbar.Brand>
            <Nav className={styles['navbar-nav']}>
                <Nav.Link href="/admin/dashboard" className={styles['nav-link']}>어드민</Nav.Link>
                <Nav.Link href="/lecturePackage" className={styles['nav-link']}>강의패키지</Nav.Link>
                <Nav.Link href="/lecture" className={styles['nav-link']}>강의</Nav.Link>
                <Nav.Link href="/itNewsBoard" className={styles['nav-link']}>itNewsBoard</Nav.Link>
                <Nav.Link href="/user" className={styles['nav-link']}>유저</Nav.Link>
                <Nav.Link href="/user/login" className={styles['nav-link']}>로그인페이지</Nav.Link>
                <Nav.Link href="/payment" className={styles['nav-link']}>결제</Nav.Link>
                <Nav.Link href="/chatting" className={styles['nav-link']}>채팅</Nav.Link>
                <Nav.Link href="/post" className={styles['nav-link']}>공유게시판</Nav.Link>
                <Nav.Link href="/cs" className={styles['nav-link']}>고객센터</Nav.Link>
            </Nav>
            <Nav className={styles['right-nav']}>
                {loggedIn ? (
                    <>
                        <Nav.Link onClick={handleLogout} className={styles['nav-link']}>로그아웃</Nav.Link>
                        <Nav.Link href="/" className={styles['nav-link']}>내 정보</Nav.Link>
                    </>
                ) : (
                    <>
                        <Nav.Link href="/" className={styles['nav-link']}>로그인</Nav.Link>
                        <Nav.Link href="/" className={styles['nav-link']}>회원가입</Nav.Link>
                        <Nav.Link href="/user/mypage" className={styles['nav-link']}>마이페이지</Nav.Link>
                    </>
                )}
            </Nav>
        </Navbar>
    );
});

export default HeaderBar;
