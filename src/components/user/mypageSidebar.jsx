import React, { useEffect } from 'react';
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import styles from '../../styles/user/mypage/mypageSidebar.module.css';

const MypageSidebar = observer(({ setSelectedComponent }) => {
    useEffect(() => {
        if (!authStore.profileImageUrl) {
            authStore.fetchProfileImageUrl();
        }
    }, []);

    const handleMenuClick = (component) => {
        setSelectedComponent(component);
    };

    return (
        <div className={styles.sidebar}>
            <img src={authStore.profileImageUrl || "/path/to/default-profile-image.png"} alt="프로필 사진"
                 className={styles.profilePicture}/>
            <p className={styles.nickname}>'{authStore.nickname}' 님</p>
            <nav className={styles.nav}>
                <ul>
                    <li onClick={() => handleMenuClick('myInfo')}>회원 정보 수정</li>
                    <li onClick={() => handleMenuClick('myAttendance')}>출석 관리</li>
                    <li onClick={() => handleMenuClick('myLecture')}>수강 관리</li>
                    <li onClick={() => handleMenuClick('paymentManagement')}>결제 관리</li>
                    <li onClick={() => handleMenuClick('certificates')}>자격증 관리</li>
                    {authStore.checkIsTeacher() && (
                        <>
                            <li onClick={() => handleMenuClick('lectureManagement')}>강좌 관리</li>
                            <li onClick={() => handleMenuClick('educationExperience')}>학력/경력 관리</li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
});

export default MypageSidebar;
