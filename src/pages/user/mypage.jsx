import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import MyCertificate from "../../components/user/myCertificate";
import EducationExperience from "../../components/user/educationExperience";
import MyAttendance from "../../components/user/myAttendance";
import MyInfo from "../../components/user/myInfo";
import MyLecture from "../../components/user/myLecture";
import LectureManagement from "../../components/user/lectureManagement";
import PaymentHistoryManagement from "../payment/PaymentHistoryManagement";

import styles from "../../styles/user/mypage/mypage.module.css";
import MypageSidebar from "../../components/user/mypageSidebar";
import MyLecturePackage from "../../components/user/lectureManagement";
import MyLecturePackageLike from "../../components/user/myLecturePackageLike";

const Mypage = observer(() => {
    const router = useRouter();
    const [selectedComponent, setSelectedComponent] = useState(null);

    useEffect(() => {
        if (!authStore.checkIsLoggedIn()) {
            router.push("/user/login"); // 로그인 페이지로 리디렉션
        }
    }, []);

    const renderComponent = () => {
        switch (selectedComponent) {
            case "certificates":
                return <MyCertificate />;
            case "educationExperience":
                return <EducationExperience />;
            case "myAttendance":
                return <MyAttendance />;
            case "myInfo":
                return <MyInfo />;
            case "myLecture":
                return <MyLecture />;
            case "lectureManagement":
                return <LectureManagement />;
            case "paymentManagement":
                return <PaymentHistoryManagement />;
            case "like":
                return <MyLecturePackageLike />;
            // 다른 컴포넌트들도 여기 추가
            default:
                return <div>메뉴를 선택해주세요.</div>;
        }
    };

    return (
        <div className={styles.mypage}>
            <MypageSidebar setSelectedComponent={setSelectedComponent} />
            <div className={styles.content}>
                {renderComponent()}
            </div>
        </div>
    );
});

export default Mypage;