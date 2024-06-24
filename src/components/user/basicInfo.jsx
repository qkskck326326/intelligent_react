import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/user/enroll/basicInfo.module.css';
import { axiosClient } from "../../axiosApi/axiosClient";

const BasicInfo = ({ basicInfo, setBasicInfo, nextPage, prevPage, isEmailVerified, setIsEmailVerified }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [receivedCode, setReceivedCode] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState('/images/defaultProfile.png');
  const [timer, setTimer] = useState(180); // 3분
  const [intervalId, setIntervalId] = useState(null);
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [checkedNickname, setCheckedNickname] = useState('');

  const userNameRef = useRef();
  const userEmailRef = useRef();
  const userPwdRef = useRef();
  const confirmUserPwdRef = useRef();
  const phoneRef = useRef();
  const nicknameRef = useRef();

  useEffect(() => {
    setIsEmailValid(validateEmail(basicInfo.userEmail));
  }, [basicInfo.userEmail]);

  useEffect(() => {
    if (basicInfo.profileImageUrl) {
      setPreviewImageUrl(URL.createObjectURL(basicInfo.profileImageUrl));
    } else {
      setPreviewImageUrl('/images/defaultProfile.png');
    }
  }, [basicInfo.profileImageUrl]);

  useEffect(() => {
    if (isCodeSent && timer > 0) {
      const id = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      setIntervalId(id);
    } else if (timer === 0) {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isCodeSent, timer]);

  useEffect(() => {
    setIsNicknameValid(basicInfo.nickname.length >= 2);
  }, [basicInfo.nickname]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'userPwd') {
      setShowTooltip(true);
    }

    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setBasicInfo(prevState => ({
        ...prevState,
        [name]: formatPhoneNumber(onlyNums)
      }));
    } else if (name === 'userName') {
      const isValid = validateNameLength(value);
      if (isValid) {
        setBasicInfo(prevState => ({
          ...prevState,
          [name]: value
        }));
      }
    } else if (name === 'verificationCode') {
      const onlyNums = value.replace(/[^0-9]/g, '').slice(0, 6);
      setVerificationCode(onlyNums);
      setIsCodeValid(onlyNums.length === 6);
    } else {
      setBasicInfo(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setBasicInfo(prevState => ({
        ...prevState,
        profileImageUrl: file
      }));
      setPreviewImageUrl(URL.createObjectURL(file));
    } else {
      alert('이미지 파일만 업로드할 수 있습니다.');
    }
  };

  const validateEmail = (userEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(userEmail);
  };

  const formatPhoneNumber = (phone) => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const validateNameLength = (userName) => {
    const koreanCharRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    const koreanCharCount = userName.split('').filter(char => koreanCharRegex.test(char)).length;
    const nonKoreanCharCount = userName.length - koreanCharCount;

    return (koreanCharCount <= 10 && nonKoreanCharCount <= 20);
  };

  const validatePassword = (userPwd) => {
    const minLength = userPwd.length >= 8;
    const hasUpperCase = /[A-Z]/.test(userPwd);
    const hasNumber = /[0-9]/.test(userPwd);

    return {
      minLength,
      hasUpperCase,
      hasNumber
    };
  };

  const handleSendVerificationCode = async () => {
    const userEmail = basicInfo.userEmail;

    if (!validateEmail(userEmail)) {
      alert('유효한 이메일 주소를 입력하세요.');
      return;
    }

    try {
      const response = await axiosClient.post('/users/send-verification-code', null, {
        params: {
          userEmail,
        },
      });

      if (response.status === 200) {
        setIsCodeSent(true);
        setTimer(180); // 타이머를 3분으로 재설정
        setReceivedCode(response.data.verificationCode); // 받은 인증코드 저장
        alert('인증번호가 전송되었습니다.');
      } else {
        alert('이메일 전송에 실패했습니다.');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert('중복된 이메일 입니다.');
      } else {
        alert('인증번호 전송 중 오류가 발생했습니다.');
      }
    }
  };

  const handleVerifyCode = () => {
    if (verificationCode === receivedCode) {
      setIsCodeValid(true);
      alert('인증이 성공적으로 완료되었습니다.');
      // 이메일 입력을 읽기 전용으로 설정
      setBasicInfo(prevState => ({
        ...prevState,
        emailReadOnly: true
      }));
      // 인증 상태를 상위 컴포넌트로 전달
      setIsEmailVerified(true);
      // 인증 코드 입력란, 버튼, 타이머, 인증번호 전송 버튼 숨기기
      setIsCodeSent(false);
    } else {
      alert('인증에 실패했습니다.');
    }
  };

  const handleCheckNickname = async () => {
    const nickname = basicInfo.nickname;

    if (nickname.length < 2) {
      alert('닉네임은 최소 2자 이상이어야 합니다.');
      return;
    }

    try {
      const response = await axiosClient.get('/users/check-nickname', {
        params: { nickname }
      });

      if (response.status === 200) {
        alert(response.data); // "사용 가능한 닉네임입니다."
        setCheckedNickname(nickname); // 중복 확인된 닉네임을 저장
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert(error.response.data); // "닉네임 중복입니다."
      } else {
        alert('닉네임 중복 확인 중 오류가 발생했습니다.');
      }
    }
  };

  const handleNextPage = () => {
    if (!basicInfo.userName) {
      alert('이름을 입력하지 않았습니다.');
      userNameRef.current.focus();
      return;
    }
    if (!basicInfo.userEmail) {
      alert('이메일을 입력하지 않았습니다.');
      userEmailRef.current.focus();
      return;
    }
    if (!isEmailVerified) {
      alert('이메일 인증을 완료하지 않았습니다.');
      userEmailRef.current.focus();
      return;
    }
    if (!basicInfo.userPwd) {
      alert('비밀번호를 입력하지 않았습니다.');
      userPwdRef.current.focus();
      return;
    }
    if (!basicInfo.confirmUserPwd) {
      alert('비밀번호 확인을 입력하지 않았습니다.');
      confirmUserPwdRef.current.focus();
      return;
    }
    if (basicInfo.userPwd !== basicInfo.confirmUserPwd) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      confirmUserPwdRef.current.focus();
      return;
    }
    if (!basicInfo.phone) {
      alert('연락처를 입력하지 않았습니다.');
      phoneRef.current.focus();
      return;
    }
    if (!basicInfo.nickname) {
      alert('닉네임을 입력하지 않았습니다.');
      nicknameRef.current.focus();
      return;
    }
    if (basicInfo.nickname !== checkedNickname) {
      alert('닉네임 중복체크를 완료하지 않았습니다.');
      nicknameRef.current.focus();
      return;
    }
    nextPage();
  };

  const passwordValidation = validatePassword(basicInfo.userPwd);

  return (
    <div className={styles.container}>
      <p className={styles.title}>InTelliClass 계정 생성</p>
      <div className={styles.form}>
        <div className={styles.formBody}>
          <div className={styles.imageSection}>
            <div className={styles.imageUpload}>
              <div className={styles.profileImageContainer}>
                <img src={previewImageUrl} alt="프로필 이미지" className={styles.profileImage} />
                <label htmlFor="fileUpload" className={styles.fileUploadLabel}></label>
              </div>
              <input type="file" id="fileUpload" name="profileImageUrl" onChange={handleImageChange} className={styles.fileInput} accept="image/*"/>
            </div>
          </div>
          <div className={styles.inputSection}>
            <input
              type="text"
              name="userName"
              placeholder="이름"
              value={basicInfo.userName}
              onChange={handleChange}
              className={styles.input}
              maxLength="20"
              ref={userNameRef}
            />
            <div className={styles.emailSection}>
              <input
                type="text"
                name="userEmail"
                placeholder="이메일"
                value={basicInfo.userEmail}
                onChange={handleChange}
                className={styles.input}
                maxLength="25"
                readOnly={basicInfo.emailReadOnly}
                ref={userEmailRef}
              />
              {!isEmailVerified && (
                <button
                  type="button"
                  className={`${styles.verifyButton} ${isEmailValid ? styles.enabled : styles.disabled}`}
                  onClick={handleSendVerificationCode}
                  disabled={!isEmailValid || basicInfo.emailReadOnly}
                >
                  {isCodeSent ? '인증번호 재전송' : '인증번호 전송'}
                </button>
              )}
            </div>
            {isCodeSent && <p className={styles.codeSentMessage}>인증번호가 전송되었습니다.</p>}
            {isCodeSent && (
              <div className={styles.codeSection}>
                <input
                  type="text"
                  name="verificationCode"
                  placeholder="인증번호 입력"
                  value={verificationCode}
                  onChange={handleChange}
                  className={styles.input}
                  maxLength="6"
                />
                <span className={`${styles.timer} ${timer < 60 ? styles.redTimer : ''}`}>
                  {Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}
                </span>
                <button
                  type="button"
                  className={`${styles.verifyCodeButton} ${isCodeValid ? styles.enabled : styles.disabled}`}
                  onClick={handleVerifyCode}
                  disabled={!isCodeValid}
                >
                  인증하기
                </button>
              </div>
            )}
            <div className={styles.tooltip}>
              <input
                type="password"
                name="userPwd"
                placeholder="비밀번호"
                value={basicInfo.userPwd}
                onChange={handleChange}
                className={styles.input}
                maxLength="20"
                ref={userPwdRef}
              />
              <div className={styles.tooltiptext}>
                <p className={passwordValidation.minLength ? styles.valid : styles.invalid}>✔ 8자 이상</p>
                <p className={passwordValidation.hasUpperCase ? styles.valid : styles.invalid}>✖ 대소문자</p>
                <p className={passwordValidation.hasNumber ? styles.valid : styles.invalid}>✔ 숫자 한 개 이상</p>
              </div>
            </div>
            <input
              type="password"
              name="confirmUserPwd"
              placeholder="비밀번호 확인"
              value={basicInfo.confirmUserPwd}
              onChange={handleChange}
              className={styles.input}
              maxLength="20"
              ref={confirmUserPwdRef}
            />
            <input
              type="text"
              name="phone"
              placeholder="연락처"
              value={basicInfo.phone}
              onChange={handleChange}
              className={styles.input}
              maxLength="13"
              ref={phoneRef}
            />
            <div className={styles.nicknameSection}>
              <input
                type="text"
                name="nickname"
                placeholder="닉네임"
                value={basicInfo.nickname}
                onChange={handleChange}
                className={styles.input}
                maxLength="15"
                ref={nicknameRef}
              />
              <button
                type="button"
                className={`${styles.checkButton} ${isNicknameValid ? styles.enabled : styles.disabled}`}
                onClick={handleCheckNickname}
                disabled={!isNicknameValid}
              >
                중복 체크
              </button>
            </div>
          </div>
        </div>
        <div className={styles.buttons}>
          <button onClick={prevPage} className={styles.prevButton}>이 전</button>
          <button onClick={handleNextPage} className={styles.nextButton}>다 음</button>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
