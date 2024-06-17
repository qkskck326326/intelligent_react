import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import SignUpForm from "../../components/user/signUp";
import styles from "../../styles/user/mypage/mypage.module.css";

const Enroll = observer(() => {
    const router = useRouter();

    useEffect(() => {
        if (authStore.checkIsLoggedIn()) {
            router.push("/"); // 홈 페이지로 리디렉션
        }
    }, []);

    return (
        <div className={styles.title}>
            <h1>임시 회원가입 페이지</h1>
            <SignUpForm />
        </div>
    );
});

export default Enroll;
