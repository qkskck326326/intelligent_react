import React, { useEffect } from 'react';
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import styles from '../../styles/user/mypage/mypageSidebar.module.css';

const MypageSidebar = observer(({ setSelectedComponent }) => {
    useEffect(() => {
        if (!authStore.profileImageUrl) {
            authStore.getProfileImageUrl();
        }
    }, []);

    const handleMenuClick = (component) => {
        setSelectedComponent(component);
    };

    return (
        <div className={styles.sidebar}>
            
            <img src={authStore.profileImageUrl || "/images/defaultProfile.png"} alt="프로필 사진"
                 className={styles.profilePicture}/>
            <p className={styles.nickname}>'{authStore.nickname}' 님</p>
            <div className={styles.horizontalLine}></div>
            <nav className={styles.nav}>
                <ul>
                    <li onClick={() => handleMenuClick('like')}>♥찜 항목</li>
                    <li onClick={() => handleMenuClick('myInfo')}>회원 정보 수정</li>
                    <li onClick={() => handleMenuClick('myAttendance')}>출석 관리</li>
                    <li onClick={() => handleMenuClick('myLecture')}>수강 관리</li>
                    {authStore.checkIsTeacher() && (
                        <>
                            <li onClick={() => handleMenuClick('lectureManagement')}>강좌 관리</li>
                            <li onClick={() => handleMenuClick('educationExperience')}>나의 학력/경력</li>
                        </>
                    )}
                    <li onClick={() => handleMenuClick('certificates')}>나의 자격증</li>
                    <li onClick={() => handleMenuClick("postManagement")}>내 게시물 관리</li>
                    <li onClick={() => handleMenuClick('paymentManagement')}>결제 관리</li>


                </ul>
            </nav>
        </div>
    );
});

export default MypageSidebar;
