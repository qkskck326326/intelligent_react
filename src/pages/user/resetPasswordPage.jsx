import ResetPassword from "../../components/user/resetPassword";
import React, { useEffect } from 'react';

const ResetPasswordPage = () => {
  useEffect(() => {
    // 페이지가 마운트될 때 body에 overflow: hidden; 적용
    document.body.style.overflow = 'hidden';
    
    // 페이지가 언마운트될 때 원래 상태로 복구
    return () => {
        document.body.style.overflow = '';
    };
}, []);

    return (
    <div>
        <ResetPassword/>
    </div>
    );
};

export default ResetPasswordPage;
