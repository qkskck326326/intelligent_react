import React, { useEffect } from "react";
import { useRouter } from "next/router";
import authStore from "../../stores/authStore";

const EnrollInterest = () => {
    const router = useRouter();

    useEffect(() => {
        if (authStore.checkIsLoggedIn()) {
            router.push("/"); // 메인 페이지로 리디렉션
        }
    }, []);

    return (
        <>
            <h1>EnrollInterest</h1>
        </>
    );
};

export default EnrollInterest;
