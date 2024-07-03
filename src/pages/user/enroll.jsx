import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import authStore from "../../stores/authStore";
import SelectRole from "../../components/user/selectRole";
import BasicInfo from '../../components/user/basicInfo';
import EnrollInterest from '../../components/user/enrollInterest';  
import EnrollEducationExperience from '../../components/user/enrollEducationExperience';  
import EnrollFaceRegistration from '../../components/user/enrollFaceRegistration'; 
import styles from '../../styles/user/enroll/enroll.module.css';

const Enroll = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [basicInfo, setBasicInfo] = useState({
    userName: '',
    userEmail: '',
    userPwd: '',
    confirmUserPwd: '',
    phone: '',
    nickname: '',
    profileImageUrl: '',
    userType: null,
    interests: [],
    isNicknameChecked: false, 
  });
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [educationExperience, setEducationExperience] = useState([]);
  const [careerExperience, setCareerExperience] = useState([]);

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  const router = useRouter();

  useEffect(() => {
    if (authStore.checkIsLoggedIn()) {
      router.push("/"); // 홈 페이지로 리디렉션
    }
    // document.body.style.overflow = 'hidden';

    // return () => {
    //   document.body.style.overflow = '';
    // };
  }, [router]);

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return <SelectRole setBasicInfo={setBasicInfo} nextPage={nextPage} />;
      case 1:
        return (
          <BasicInfo basicInfo={basicInfo} setBasicInfo={setBasicInfo} nextPage={nextPage} prevPage={prevPage} isEmailVerified={isEmailVerified} setIsEmailVerified={setIsEmailVerified}/>
        );
      case 2:
        return basicInfo.userType === 0 ? 
          <EnrollInterest nextPage={nextPage} prevPage={prevPage} basicInfo={basicInfo} setBasicInfo={setBasicInfo} educationExperience={educationExperience} careerExperience={careerExperience}/> : 
          <EnrollEducationExperience nextPage={nextPage} prevPage={prevPage} educationExperience={educationExperience} careerExperience={careerExperience} setEducationExperience={setEducationExperience} setCareerExperience={setCareerExperience} />;
      case 3:
        return <EnrollInterest nextPage={nextPage} prevPage={prevPage} basicInfo={basicInfo} setBasicInfo={setBasicInfo} educationExperience={educationExperience} careerExperience={careerExperience} />;
      case 4:
        return <EnrollFaceRegistration prevPage={prevPage} basicInfo={basicInfo} educationExperience={educationExperience} careerExperience={careerExperience} />;
      default:
        return <SelectRole setBasicInfo={setBasicInfo} nextPage={nextPage} />;
    }
  };

  return (
    <div className={styles.center_div}>
      <div className={styles.contentContainer}>
        <div style={{ display: 'block', fontSize: '2rem', marginBlockStart: '0.83em', marginBlockEnd: '0.83em', marginInlineStart: '0px', marginInlineEnd: '0px', fontWeight: 'bold', textAlign: 'center' }}>
          InTelliClass 계정 생성
        </div>
        {renderPage()}
      </div>
    </div>
  );
};

export default Enroll;
