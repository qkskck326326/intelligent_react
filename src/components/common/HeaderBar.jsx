import React, { useEffect, useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import { axiosClient } from "../../axiosApi/axiosClient";
import { handleAxiosError } from "../../axiosApi/errorAxiosHandler";
import styles from "../../styles/header.module.css"; // CSS 모듈을 import
import Notification from "../notification/notification";

const HeaderBar = observer(() => {
  const [isClient, setIsClient] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      authStore.checkIsLoggedIn();
    }
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post("/logout"); // 로그아웃 엔드포인트로 요청
      console.log("로그아웃 성공:", response.data);
      localStorage.clear();

      // 페이지 이동 후에 상태 초기화
      window.location.href = "http://localhost:3000"; // 로그아웃 성공 시 이동
      setTimeout(() => {
        authStore.setIsLoggedIn(false);
        authStore.setIsStudent(false);
        authStore.setIsTeacher(false);
        authStore.setIsAdmin(false);
        authStore.setUserEmail("");
        authStore.setProvider("");
        authStore.setNickname("");
        authStore.setProfileImageUrl("");
      }, 1000); // 1초 지연
    } catch (error) {
      console.error("로그아웃 실패:", error);
      handleAxiosError(error);
    }
  };

  if (!isClient) {
    return null; // 클라이언트가 아닐 때는 아무것도 렌더링하지 않음
  }

  return (
      <Navbar collapseOnSelect expand="lg" className={styles.navbar}>
        <Navbar.Brand href="/" className={styles["navbar-brand"]}>
          <img src="/images/logo.png" alt="Logo" />
        </Navbar.Brand>
        <Nav className={styles["navbar-nav"]}>
          {authStore.isAdmin && (
              <Nav.Link href="/admin/dashboard" className={styles["nav-link"]}>
                어드민
              </Nav.Link>
          )}
          <Nav.Link href="/lecturePackage" className={styles["nav-link"]}>
            강의패키지
          </Nav.Link>
          {/* <Nav.Link href="/lecture/list" className={styles["nav-link"]}>
            강의
          </Nav.Link> */}
          <Nav.Link href="/itNewsBoard" className={styles["nav-link"]}>
            itNewsBoard
          </Nav.Link>
          {/* <Nav.Link href="/payment" className={styles["nav-link"]}>
            결제
          </Nav.Link> */}
          {/* <Nav.Link href="/chatting" className={styles["nav-link"]}>
            채팅
          </Nav.Link> */}
          <Nav.Link href="/post" className={styles["nav-link"]}>
            공유게시판
          </Nav.Link>
          <Nav.Link href="/cs" className={styles["nav-link"]}>
            고객센터
          </Nav.Link>
          <Nav.Link href="/cart" className={styles["nav-link"]}>
            장바구니
          </Nav.Link>
        </Nav>
        <Nav className={styles["right-nav"]}>
          {authStore.isLoggedIn ? (
              <>
                <div className={styles.notificationBellWrapper}>
                  <img 
                    src="/images/notificationBell.png" 
                    alt="Notification Bell" 
                    className={styles.notificationBell}
                    onClick={() => setShowNotifications(!showNotifications)}
                  />
                  {notificationCount > 0 && (
                    <span className={styles.notificationCount}>
                      {notificationCount}
                    </span>
                  )}
                </div>
                {showNotifications && <Notification setNotificationCount={setNotificationCount} />}
                <Nav.Link onClick={handleLogout} className={styles["nav-link"]}>
                  로그아웃
                </Nav.Link>
                <Nav.Link href="/user/mypage" className={styles["nav-link"]}>
                  마이페이지
                </Nav.Link>
              </>
          ) : (
              <>
                <Nav.Link href="/user/login" className={styles["nav-link"]}>
                  로그인
                </Nav.Link>
                <Nav.Link href="/user/enroll" className={styles["nav-link"]}>
                  회원가입
                </Nav.Link>
              </>
          )}
        </Nav>
      </Navbar>
  );
});

export default HeaderBar;
