import React from 'react';
import styles from '../../styles/cs/announcement.module.css';
import clsx from 'clsx'
import { useRouter } from 'next/router';
import {axiosClient} from "../../axiosApi/axiosClient";

export default function AnnouncementItem(props){

    const{announcementId, title, createdAt, category, importance, content, ...rest} = props.details
    const router = useRouter();
    const categoryMap = {
        0: '서비스',
        1: '업데이트',
        2: '이벤트'
    };


    function handlePageMove() {

        axiosClient.get(`/announcement/id`, {
            params: {
                announcementId: announcementId
            }
        })
            .then(response => {
                console.log(response.data);
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
            })
            .catch(error => {
                console.error('An error occurred!', error);
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