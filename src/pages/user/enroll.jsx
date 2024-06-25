// Enroll.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import authStore from "../../stores/authStore";
import SignUpForm from "../../components/user/signUp";
import SelectRole from "../../components/user/selectRole";
import BasicInfo from '../../components/user/basicInfo';
import EnrollInterest from '../../components/user/enrollInterest';  
import EnrollTeacherExperience from '../../components/user/enrollTeacherExperience';  
import EnrollFaceRegistration from '../../components/user/enrollFaceRegistration'; 
import styles from '../../styles/user/enroll/enroll.module.css';
import { axiosClient } from "../../axiosApi/axiosClient";

const Enroll = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [basicInfo, setBasicInfo] = useState({
    userName: '',
    userEmail: '',
    userPwd: '',
    confirmUserPwd: '',
    phone: '',
    nickname: '',
    profileImageUrl: null,
    userType: null,
    interests: [], // 추가된 부분
  });
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  const router = useRouter();

  useEffect(() => {
    if (authStore.checkIsLoggedIn()) {
      router.push("/"); // 홈 페이지로 리디렉션
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return <SelectRole setBasicInfo={setBasicInfo} nextPage={nextPage} />;
      case 1:
        return (
          <BasicInfo
            basicInfo={basicInfo}
            setBasicInfo={setBasicInfo}
            nextPage={nextPage}
            prevPage={prevPage}
            isEmailVerified={isEmailVerified}
            setIsEmailVerified={setIsEmailVerified}
          />
        );
      case 2:
        return basicInfo.userType === 0 ? 
          <EnrollInterest nextPage={nextPage} prevPage={prevPage} basicInfo={basicInfo} setBasicInfo={setBasicInfo} /> : 
          <EnrollTeacherExperience nextPage={nextPage} prevPage={prevPage} basicInfo={basicInfo} />;
      case 3:
        return <EnrollInterest nextPage={nextPage} prevPage={prevPage} basicInfo={basicInfo} setBasicInfo={setBasicInfo} />;
      case 4:
        return <EnrollFaceRegistration prevPage={prevPage} basicInfo={basicInfo} />;
      default:
        return <SelectRole setBasicInfo={setBasicInfo} nextPage={nextPage} />;
    }
  };

  return (
    <div>
      <h1>임시 회원가입 페이지</h1>
      <SignUpForm />
      <hr></hr>
      <h2>공사중입니다...</h2>
      <div style={{ display: 'block', fontSize: '2rem', marginBlockStart: '0.83em', marginBlockEnd: '0.83em', marginInlineStart: '0px', marginInlineEnd: '0px', fontWeight: 'bold', textAlign: 'center' }}>
        InTelliClass 계정 생성
      </div>
      {renderPage()}
    </div>
  );
};

export default Enroll;
