import React from "react";
import { observer } from "mobx-react-lite";
import authStore from "../../stores/authStore";
import styles from "../../styles/lecturePackage/UploadButton.module.css";
import { LuPencilLine } from "react-icons/lu";

const UploadButton = observer(({ onLoginRequired, onRegisterClick }) => {
    const handleClick = (e) => {
        onRegisterClick();
    };

    return (
        <div className={styles.uploadButtonContainer} onClick={handleClick}>
            <div className={styles.uploadButton}>
                <LuPencilLine className={styles.icon} />
            </div>
        </div>
    );
});

export default UploadButton;