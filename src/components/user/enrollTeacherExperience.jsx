import React, { useEffect } from "react";
import { useRouter } from "next/router";
import authStore from "../../stores/authStore";

const EnrollTeacherExperience = () => {
    const router = useRouter();

    useEffect(() => {
        if (authStore.checkIsLoggedIn()) {
            router.push("/"); // 메인 페이지로 리디렉션
        }
    }, []);

    return (
        <>
            <h1>EnrollTeacherExperience</h1>
        </>
    );
};

export default EnrollTeacherExperience;
