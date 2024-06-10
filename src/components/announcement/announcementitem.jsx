import React from 'react';
import styles from '../../styles/announcement.module.css';
import clsx from 'clsx'
import {authStore} from "../../stores/authStore";

export default function AnnouncementItem(props){

    const{title, createdAt, category, importance} = props.details

    const categoryMap = {
        0: '서비스',
        1: '업데이트',
        2: '이벤트'
    };

    function handlePageMove(event){
        console.log(props.details)
        console.log(authStore.checkIsAdmin())
        console.log(authStore.checkIsLoggedIn())
    }

    const important = Number(importance)

    function checkImportance(){
        return important === 1;
    }

    const classes = clsx({
        [styles.announceTitle]: true,
        [styles.important]: checkImportance(),
    });

    return (
        <li className={styles.announceItem}>
            <div className={styles.announceCategory}>{categoryMap[category]}</div>
            <div className={classes} onClick={handlePageMove}>{(important === 1) ? '[중요] ' : ''}{title}</div>
            <div className={styles.announceDate}>{new Date(createdAt).toLocaleDateString()}</div>
        </li>
    );
}