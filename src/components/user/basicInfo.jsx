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
      <p className={styles.title}>InTelliClass 계정 생성</p>
      <div className={styles.form}>
        <div className={styles.formBody}>
          <div className={styles.imageSection}>
            <div className={styles.imageUpload}>
              <img src={basicInfo.profileImage ? URL.createObjectURL(basicInfo.profileImage) : '/default-image.png'} alt="프로필 이미지" className={styles.profileImage} />
              <label htmlFor="fileUpload" className={styles.fileUploadLabel}>프로필 이미지 업로드</label>
              <input type="file" id="fileUpload" name="profileImage" onChange={handleImageChange} />
            </div>
          </div>
          <div className={styles.inputSection}>
            <input type="text" name="name" placeholder="이름" value={basicInfo.name} onChange={handleChange} className={styles.input} />
            <div className={styles.emailSection}>
              <input type="text" name="email" placeholder="이메일" value={basicInfo.email} onChange={handleChange} className={styles.input} />
              <button className={styles.verifyButton}>인증번호 재전송</button>
            </div>
            <input type="password" name="password" placeholder="비밀번호" value={basicInfo.password} onChange={handleChange} className={styles.input} />
            <input type="password" name="confirmPassword" placeholder="비밀번호 확인" value={basicInfo.confirmPassword} onChange={handleChange} className={styles.input} />
            <input type="text" name="contact" placeholder="연락처" value={basicInfo.contact} onChange={handleChange} className={styles.input} />
            <div className={styles.nicknameSection}>
              <input type="text" name="nickname" placeholder="닉네임" value={basicInfo.nickname} onChange={handleChange} className={styles.input} />
              <button className={styles.checkButton}>중복 체크</button>
            </div>
          </div>
        </div>
        <div className={styles.buttons}>
            <button onClick={prevPage} className={styles.prevButton}>이 전</button>
            <button onClick={nextPage} className={styles.nextButton}>다 음</button>
          </div>
      </div>
    </div>
  );
};

export default BasicInfo;
