import React from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css"; // Import the CSS file

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <ul>
        <li>
          <h1>공유게시판</h1>
        </li>
        <li>
          <Link href="http://localhost:3000/post">게시판 목록</Link>
        </li>
        <li>
          <Link href="/myPosts">내 게시물</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
