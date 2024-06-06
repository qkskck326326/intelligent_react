import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import MyCertificate from "../../components/member/myCertificate";
import styles from "../../styles/myPage.module.css";

 const MyPage = () => {
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setNickname(decodedToken.sub); // 토큰에서 닉네임 추출
    }
  }, []);
// 헤헿
  return (
    <div className={styles.container}>
      <h1>My Page</h1>
      {nickname && <MyCertificate nickname={nickname} />}
    </div>
  );
};

export default MyPage;
