import ResetPassword from "../../components/user/resetPassword";
import styles from "../../styles/user/mypage/mypage.module.css";
import { observer } from "mobx-react";
import authStore from "../../stores/authStore";

const ResetPasswordPage = observer(() => {
    return (
    <div className={styles.title}>
      <h1>임시 비밀번호 찾기 페이지</h1>
      
        <ResetPassword/>
    </div>
    );
});

export default ResetPasswordPage;
