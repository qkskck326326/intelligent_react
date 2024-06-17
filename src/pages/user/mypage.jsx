import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import MyCertificate from "../../components/user/myCertificate";
import styles from "../../styles/user/mypage/mypage.module.css";

const MyPage = observer(() => {
    const router = useRouter();

    useEffect(() => {
        if (!authStore.checkIsLoggedIn()) {
            router.push("/user/login"); // 로그인 페이지로 리디렉션
        }
    }, []);

    return (
        <div className={styles.title}>
            <h1>My Page</h1>
            <MyCertificate />
        </div>
    );
});

export default MyPage;
