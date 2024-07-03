import React, { useEffect } from "react";
import { useRouter } from "next/router";
import authStore from "../../stores/authStore";
import styles from "../../styles/user/enroll/selectRole.module.css";

const SelectRole = ({ setBasicInfo, nextPage }) => {
    const router = useRouter();

    useEffect(() => {
        if (authStore.checkIsLoggedIn()) {
            router.push("/"); // 홈 페이지로 리디렉션
        }
    }, [router]);

    const handleRoleSelection = (role) => {
        setBasicInfo(prevState => ({
            ...prevState,
            userType: role === 'student' ? 0 : 1
        }));
        nextPage();
    };

    return (
        <div className={styles.container}>
            <div className={styles.card + " " + styles.student} onClick={() => handleRoleSelection('student')}>
                <div className={styles.icon + " " + styles.studentIcon}></div>
                <p className={styles.cardName}>학 생</p>
            </div>
            <div className={styles.card + " " + styles.teacher} onClick={() => handleRoleSelection('teacher')}>
                <div className={styles.icon + " " + styles.teacherIcon}></div>
                <p className={styles.cardName}>강 사</p>
            </div>
        </div>
    );
};

export default SelectRole;
