import React from "react";
import Link from "next/link";
import styles from "../../styles/user/mypage/mypage.module.css";
import LecturePackageList from "../../components/lecturePackage/lecturePackageList";


const Index = () => {
    return (
        <div className={styles.container}>
            <h1>lecturePakage page</h1>



            <div>
                <LecturePackageList/>
            </div>
        </div>
    );
};

export default Index;
