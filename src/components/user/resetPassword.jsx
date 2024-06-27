import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/user/login/resetPassword.module.css';
import { axiosClient } from "../../axiosApi/axiosClient";

const ResetPassword = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [confirmUserPwd, setConfirmUserPwd] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [receivedCode, setReceivedCode] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [timer, setTimer] = useState(180); // 3분
  const [intervalId, setIntervalId] = useState(null);
  const [isVerified, setIsVerified] = useState(false); // 인증 성공 여부 추가

  const router = useRouter();
  const userEmailRef = useRef();
  const userPwdRef = useRef();
  const confirmUserPwdRef = useRef();

  useEffect(() => {
    setIsEmailValid(validateEmail(userEmail));
  }, [userEmail]);

  useEffect(() => {
    if (isCodeSent) {
      const id = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      setIntervalId(id);
    }
    return () => clearInterval(intervalId);
  }, [isCodeSent]);

  useEffect(() => {
    if (timer === 0) {
      clearInterval(intervalId);
      alert('이메일 인증 시간이 만료되었습니다.');
      router.push("/user/login");
    }
  }, [timer, intervalId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'verificationCode') {
      const onlyNums = value.replace(/[^0-9]/g, '').slice(0, 6);
      setVerificationCode(onlyNums);
      setIsCodeValid(onlyNums.length === 6);
    } else if (name === 'userEmail') {
      setUserEmail(value);
    } else if (name === 'userPwd') {
      setUserPwd(value);
    } else if (name === 'confirmUserPwd') {
      setConfirmUserPwd(value);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendVerificationCode = async () => {
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
        alert('입력하신 이메일로 인증번호가 전송되었습니다.');
      } else {
        alert('이메일 전송에 실패했습니다.');
      }
    } catch (error) {
      alert('인증번호 전송 중 오류가 발생했습니다.');
    }
  };

  const handleVerifyCode = () => {
    if (verificationCode === receivedCode) {
      setIsCodeValid(true);
      setIsVerified(true); // 인증 성공 여부 설정
      alert('인증이 성공적으로 완료되었습니다.');
      setIsCodeSent(false);
    } else {
      alert('인증에 실패했습니다.');
    }
  };

  const handleResetPassword = async () => {
    if (!userEmail) {
      alert('이메일을 입력하지 않았습니다.');
      userEmailRef.current.focus();
      return;
    }
    if (!isCodeValid) {
      alert('이메일 인증을 완료하지 않았습니다.');
      return;
    }
    if (!userPwd) {
      alert('비밀번호를 입력하지 않았습니다.');
      userPwdRef.current.focus();
      return;
    }
    if (!confirmUserPwd) {
      alert('비밀번호 확인을 입력하지 않았습니다.');
      confirmUserPwdRef.current.focus();
      return;
    }
    if (userPwd !== confirmUserPwd) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      confirmUserPwdRef.current.focus();
      return;
    }

    try {
      const response = await axiosClient.put(`/users/reset-password/${encodeURIComponent(userEmail)}/${encodeURIComponent(userPwd)}`);

      if (response.status === 200) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        router.push("/user/login");
      } else {
        alert('비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      alert('비밀번호 변경 중 오류가 발생했습니다.');
    }
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
  
  const passwordValidation = validatePassword(userPwd);

  return (
    <div className={styles.container}>
      <div className={styles.form}>
      <div style={{ display: 'block', fontSize: '2rem', marginBlockStart: '0.83em', marginBlockEnd: '0.83em', marginInlineStart: '0px', marginInlineEnd: '0px', fontWeight: 'bold', textAlign: 'center' }} className={styles.title}>
          비밀번호 변경
        </div>
        <div className={styles.formBody}>
          <div className={styles.inputSection}>
            <input
              type="text"
              name="userEmail"
              placeholder="이메일"
              value={userEmail}
              onChange={handleChange}
              className={styles.input}
              maxLength="30"
              ref={userEmailRef}
              readOnly={isVerified} // 인증 성공 시 읽기 전용
            />
            {!isCodeSent && !isVerified && (
              <button
                type="button"
                className={`${styles.verifyButton} ${isEmailValid ? styles.enabled : styles.disabled}`}
                onClick={handleSendVerificationCode}
                disabled={!isEmailValid}
              >
                인증번호 전송
              </button>
            )}
            {isCodeSent && (
              <button
                type="button"
                className={styles.resendButton}
                onClick={handleSendVerificationCode}
              >
                인증번호 재전송
              </button>
            )}
          </div>
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
                value={userPwd}
                onChange={handleChange}
                className={styles.input}
                maxLength="20"
                ref={userPwdRef}
              />
              <div className={styles.tooltiptext}>
                <p className={passwordValidation.minLength ? styles.valid : styles.invalid}>{passwordValidation.minLength ? '✔' : '✖'} 8자 이상</p>
                <p className={passwordValidation.hasUpperCase ? styles.valid : styles.invalid}>{passwordValidation.hasUpperCase ? '✔' : '✖'} 대문자 한 개 이상</p>
                <p className={passwordValidation.hasNumber ? styles.valid : styles.invalid}>{passwordValidation.hasNumber ? '✔' : '✖'} 숫자 한 개 이상</p>
              </div>
            </div>
            <input
              type="password"
              name="confirmUserPwd"
              placeholder="비밀번호 확인"
              value={confirmUserPwd}
              onChange={handleChange}
              className={styles.input}
              maxLength="20"
              ref={confirmUserPwdRef}
            />
        </div>
        <div className={styles.buttons}>
          <button onClick={() => router.push("/user/login")} className={styles.cancelButton}>취소</button>
          <button onClick={handleResetPassword} className={styles.saveButton}>비밀번호 변경</button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
