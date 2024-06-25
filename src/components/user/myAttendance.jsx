import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";

const MyAttendance = observer(() => {
    const router = useRouter();

    useEffect(() => {
        if (!authStore.checkIsLoggedIn()) {
            router.push("/user/login"); // 로그인 페이지로 리디렉션
        }
    }, []);

    return (
        <>
            <h1>My Attendance</h1>
        </>
    );
});

export default MyAttendance;
