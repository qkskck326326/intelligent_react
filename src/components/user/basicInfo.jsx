import React from 'react';
import styles from '../../styles/user/enroll/basicInfo.module.css';

const BasicInfo = ({ basicInfo, setBasicInfo, nextPage, prevPage }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setBasicInfo(prevState => ({
      ...prevState,
      profileImage: e.target.files[0]
    }));
  };

  return (
    <div className={styles.container}>
      <h2>InTelliClass 계정 생성</h2>
      <div className={styles.form}>
        <input type="text" name="name" placeholder="이름" value={basicInfo.name} onChange={handleChange} />
        <div className={styles.emailSection}>
          <input type="text" name="email" placeholder="이메일" value={basicInfo.email} onChange={handleChange} />
          <button className={styles.verifyButton}>인증번호 재전송</button>
        </div>
        <div className={styles.verifySection}>
          <input type="text" name="verificationCode" placeholder="인증번호" value={basicInfo.verificationCode} onChange={handleChange} />
          <button className={styles.verifyButton}>인증하기</button>
          <span className={styles.timer}>00:05</span>
        </div>
        <input type="password" name="password" placeholder="비밀번호" value={basicInfo.password} onChange={handleChange} />
        <div className={styles.passwordCriteria}>
          <p>암호 필수 조건</p>
          <ul>
            <li>8자 이상</li>
            <li>대소문자</li>
            <li>숫자 한 개 이상</li>
          </ul>
        </div>
        <input type="text" name="contact" placeholder="연락처" value={basicInfo.contact} onChange={handleChange} />
        <div className={styles.nicknameSection}>
          <input type="text" name="nickname" placeholder="닉네임" value={basicInfo.nickname} onChange={handleChange} />
          <button className={styles.checkButton}>중복 체크</button>
        </div>
        <div className={styles.imageUpload}>
          <img src={basicInfo.profileImage ? URL.createObjectURL(basicInfo.profileImage) : '/default-image.png'} alt="profile" />
          <label htmlFor="fileUpload">프로필 이미지 업로드</label>
          <input type="file" id="fileUpload" name="profileImage" onChange={handleImageChange} />
        </div>
        <div className={styles.buttons}>
          <button onClick={prevPage}>이전</button>
          <button onClick={nextPage}>다음</button>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
