import Link from "next/link";
import React from "react";
import { observer } from "mobx-react-lite";
import authStore from "../../stores/authStore";
import styles from "./UploadButton.module.css"; // Import the CSS file
import { LuPencilLine } from "react-icons/lu";

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
        {/* <span>업로드</span> */}
        <LuPencilLine style={{ color: 'white'}}/>
      </Link>
    </div>
  );
});

export default UploadButton;
