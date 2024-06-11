import React, {useState, useEffect} from 'react'
import styles from '../../styles/eachannouncement.module.css'
import {useRouter} from "next/router";

export default function Announcedetail(props){

    console.log(props)

    const [receivedData, setReceivedData] = useState(null);

    const router = useRouter();
    const {announcementId, title, createdAt, category, importance, content, ...rest} = router.query

    console.log(createdAt)

    const categoryMap = {
        0: '서비스',
        1: '업데이트',
        2: '이벤트'
    };

    function handleEdit(){
        router.push({
            pathname: '/cs/write',
            query: {
                givenImportance: importance,
                givenCategory: category,
                givenId: announcementId,
                givenTitle: title,
                givenContent: content,
                givenCreatedAt: createdAt
            }
        });

    }

    return (
        <div className={styles.eachAnnounceContainer}>
            <div className={styles.eachAnnounceTop}>
                <p>{title}</p>
                <div className={styles.eachCategory}>
                    {categoryMap[category]}
                </div>
            </div>

            <div className={styles.eachAnnounceDate}>
                {new Date(createdAt).toLocaleDateString('ko-KR')}
            </div>
            <div className={styles.eachAnnounceContent}>
                {content}
            </div>
            <div className={styles.eachAnnounceBottom}>
                <div className={styles.announceBefore}>
                    이전 공지사항
                </div>
                <div className={styles.announceAfter}>
                    다음 공지사항
                </div>
                <div className={styles.backToList} onClick={() => window.location.href = '/cs'}>
                    목록으로
                </div>
            </div>
            <div className={styles.announceAdmin}>
                <button className={styles.announceControl}>
                    삭제
                </button>
                <button className={styles.announceControl} onClick={handleEdit}>
                    수정
                </button>
            </div>
        </div>
    );
}