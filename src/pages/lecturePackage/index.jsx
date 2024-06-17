import React, { useState, useEffect } from "react";
import LecturePackageList from "../../components/lecturePackage/lecturePackageList";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import LecturePackageRegister from '../../components/lecturePackage/lecturePackageRegister';
import styles from "../../styles/lecturePackage/lecturePackage.module.css";



const Index = () => {
    const [showRegister, setShowRegister] = useState(false);

    const handleShowRegister = () => {
        setShowRegister(prevState => !prevState); // 상태 값을 이전 상태의 반대로 설정함.
    };

    return (
        <div className={styles.container}>
            {showRegister ? (
                <LecturePackageRegister onBackListClick={handleShowRegister} />
            ) : (
                <LecturePackageList onRegisterClick={handleShowRegister} />
            )}
        </div>
    );
};

export default Index;