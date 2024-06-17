import React from 'react';
import styles from '../../styles/cs/announcement.module.css';
import clsx from 'clsx'
import {authStore} from "../../stores/authStore";
import { useRouter } from 'next/router';
import Axios from '../../axiosApi/Axios'

export default function AnnouncementItem(props){

    const axios = new Axios();

    const{announcementId, title, createdAt, category, importance, content, ...rest} = props.details
    const router = useRouter();
    const categoryMap = {
        0: '서비스',
        1: '업데이트',
        2: '이벤트'
    };


    function handlePageMove(event) {
        console.log(announcementId)
        axios.get(`/announcement/id`, `?announcementId=${announcementId}`)
            .then(data =>  console.log(data))

        router.push({
            pathname: '/cs/announcedetail',
            query: {
                announcementId,
                title,
                createdAt,
                category,
                importance,
                content,
                ...rest
            }
        });
    }

    const important = Number(importance)

    function checkImportance(){
        return important === 1;
    }

    const classes = clsx({
        [styles.announceTitle]: true,
        [styles.important]: checkImportance()
    });


    return (
        <li className={styles.announceItem}>
            <div className={styles.announceCategory}>{categoryMap[category]}</div>
            <div className={classes} onClick={handlePageMove} >{title}</div>
            <div className={styles.announceDate}>{new Date(createdAt).toLocaleDateString('ko-KR')}</div>
        </li>
    );
}