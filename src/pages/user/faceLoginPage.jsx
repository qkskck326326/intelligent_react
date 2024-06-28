import FaceLogin from "../../components/user/faceLogin";
import styles from '../../styles/user/enroll/enroll.module.css';

const FaceLoginPage = () => {
    return (
        <div className={styles.center_div}>
            <div className={styles.contentContainer}>
                <div style={{ display: 'block', fontSize: '2rem', marginBlockStart: '0.83em', marginBlockEnd: '0.83em', marginInlineStart: '0px', marginInlineEnd: '0px', fontWeight: 'bold', textAlign: 'center' }}>
                    Face Login
                </div>
                {/* <LoginForm/> */}
                <FaceLogin/>
            </div>
        </div>
    );
};

export default FaceLoginPage;