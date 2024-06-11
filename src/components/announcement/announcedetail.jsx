import styles from '../../styles/eachannouncement.module.css'
import {useRouter} from "next/router";
import AnnouncementAxios from '../../axiosApi/announcementAxios.js'
import {useEffect, useState} from "react";

export default function Announcedetail(){

    const router = useRouter();
    const {announcementId, title, createdAt, category, importance, content, ...rest} = router.query
    const [prevId, setPrevId] = useState(0)

    const axios = new AnnouncementAxios();

    console.log(createdAt)

    const categoryMap = {
        0: '서비스',
        1: '업데이트',
        2: '이벤트'
    };

    function handleDelete(id){
        axios.delete('/announcement',{
            announcementId
        })
        window.location.href = '/cs'
    }

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
                <div className={styles.backToList} onClick={() => window.location.href = '/cs'}>
                    ← 목록으로
                </div>
            </div>
            <div className={styles.announceAdmin}>
                <button className={styles.announceControl} onClick={() => handleDelete(announcementId)}>
                    삭제
                </button>
                <button className={styles.announceControl} onClick={handleEdit}>
                    수정
                </button>
            </div>
        </div>
    );
}