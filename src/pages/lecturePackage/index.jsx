import React from "react";
import Link from "next/link";
import styles from "../../styles/mypage.module.css";
import LecturePackage from "../../components/member/lecturePackage";

const Index = () => {
    return (
        <div className={styles.container}>
            <h1>lecturePakage page</h1>

            <h1 className={styles.mypage}>
                마이페이지
                <Link href="/user/mypage">this page!</Link>
            </h1>
            <div>
                <LecturePackage/>
            </div>
        </div>
    );
};

export default Index;
