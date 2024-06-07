import React from 'react'
import styles from '../../styles/cs.module.css'


export default function CSSideBar(){


    return(
        <ul className={`${styles.sideBarContainer}`}>
            <p>고객센터</p>
            <li className={`${styles.sideBarItem} ${styles.selected}`}>공지사항</li>
            <li className={styles.sideBarItem}>QnA</li>
        </ul>
    );
}