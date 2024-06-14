import Link from "next/link";
import React from "react";
import { observer } from "mobx-react-lite";
import authStore from "../../stores/authStore";
import styles from "./UploadButton.module.css"; // Import the CSS file

const UploadButton = observer(({ onLoginRequired }) => {
  const handleClick = (e) => {
    if (!authStore.checkIsLoggedIn()) {
      e.preventDefault();
      if (onLoginRequired) {
        onLoginRequired();
      }
    }
  };

  return (
    <div className={styles.uploadButton} onClick={handleClick}>
      <Link href="/post/PostUploadPage" passHref>
        <span>업로드</span>
      </Link>
    </div>
  );
});

export default UploadButton;
