import React, { useEffect } from "react";
import { useRouter } from "next/router";
import authStore from "../../stores/authStore";
import styles from "../../styles/user/enroll/selectRole.module.css";

const SelectRole = ({ setRole, nextPage }) => {
    const router = useRouter();

    useEffect(() => {
        if (authStore.checkIsLoggedIn()) {
            router.push("/"); // 홈 페이지로 리디렉션
        }
    }, []);

    return (
        
        <div className={styles.container}>
            <p className={styles.title}>InTelliClass 계정 생성</p>
            <div className={styles.card + " " + styles.student} onClick={() => { setRole('student'); nextPage(); }}>
                <div className={styles.icon + " " + styles.studentIcon}></div>
                <p className={styles.cardName}>학 생</p>
            </div>
            <div className={styles.card + " " + styles.teacher} onClick={() => { setRole('teacher'); nextPage(); }}>
                <div className={styles.icon + " " + styles.teacherIcon}></div>
                <p className={styles.cardName}>강 사</p>
            </div>
        </div>
    );
};

export default SelectRole;