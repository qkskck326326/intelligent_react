import React from 'react';
import styles from '../../styles/announcement.module.css';
import clsx from 'clsx'

export default function AnnouncementItem(props){

    const{title, createdAt, category, importance} = props.details
    
    
    const important = Number(importance)

    function checkImportance(){
        return important === 1;
    }

    // console.log(checkImportance)

    const classes = clsx({
        [styles.announceTitle]: true,
        [styles.important]: checkImportance(),
    });

    return (
        <li className={styles.announceItem}>
            <div className={styles.announceCategory}>{category}</div>
            <div className={classes}>{(important === 1) ? '[중요] ' : ''}{title}</div>
            <div className={styles.announceDate}>{new Date(createdAt).toLocaleDateString()}</div>
        </li>
    );
}