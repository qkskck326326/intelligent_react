import Link from "next/link";
import styles from "./UploadButton.module.css"; // Import the CSS file

const UploadButton = () => (
  <Link href="/post/PostUploadPage" className={styles.uploadButton}>
    업로드
  </Link>
);

export default UploadButton;
