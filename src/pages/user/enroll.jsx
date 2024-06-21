import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import { observer } from "mobx-react";
import authStore from "../../stores/authStore";
import SignUpForm from "../../components/user/signUp";
import SelectRole from "../../components/user/selectRole";
import BasicInfo from '../../components/user/basicInfo';

const Enroll = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [role, setRole] = useState('');
    const [basicInfo, setBasicInfo] = useState({
      name: '',
      email: '',
      verificationCode: '',
      password: '',
      contact: '',
      nickname: '',
      profileImage: null
  });

  
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
          return <SelectRole setRole={setRole} nextPage={nextPage} />;
        case 1:
          return <BasicInfo basicInfo={basicInfo} setBasicInfo={setBasicInfo} nextPage={nextPage} prevPage={prevPage} />;
        case 2:
          return role === 'student' ? 
            <StudentInterestPage nextPage={nextPage} prevPage={prevPage} basicInfo={basicInfo} /> : 
            <InstructorExperiencePage nextPage={nextPage} prevPage={prevPage} basicInfo={basicInfo} />;
        case 3:
          return <InterestPage nextPage={nextPage} prevPage={prevPage} basicInfo={basicInfo} />;
        case 4:
          return <FaceRegistrationPage prevPage={prevPage} basicInfo={basicInfo} />;
        default:
          return <SelectRole setRole={setRole} nextPage={nextPage} />;
      }
    };

    return (
            <div>
                <h1>임시 회원가입 페이지</h1>
                <SignUpForm />
                <hr></hr>
                <h2>공사중입니다...</h2>
                {renderPage()}
            </div>
    );
};

export default Enroll;
