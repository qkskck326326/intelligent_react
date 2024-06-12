// import React, { useEffect, useState } from "react";
// import jwtDecode from "jwt-decode";

import SignUpForm from "../../components/user/signUp";
import styles from "../../styles/myPage.module.css";

const Enroll = () => {
    return (
    <div className={styles.title}>
      <h1>임시 회원가입 페이지</h1>
        <SignUpForm/>
    </div>
    );
};

export default Enroll;

