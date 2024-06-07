import React, { useEffect, useState } from 'react';
import styles from '../../styles/announcement.module.css';
import AnnouncementItem from './announcementitem.jsx'
import Link from "next/link";

export default function Announcement(props){

    const [announcements, setAnnouncements] = useState([])

    useEffect(()=>{
        fetch('/jsonsample/announcementExample.json')
        .then(response => {
            if(!response.ok){
                throw new Error('An error occured!')
            }
            return response.json()
        })
        .then(data => {
            // console.log(data['announcements'])
            setAnnouncements(data['announcements']);
        })
    }, [])


    function loadMoreData(){

        fetch('/jsonsample/announcementExample.json')
        .then(response => {
            if(!response.ok){
                throw new Error('An error occured!')
            }
            return response.json()
        })
        .then(data => {
            // console.log(data['announcements'])
            //스프레드 사용 시 무조건 화살표 익명 함수 안에서 해야 integrity 훼손 안됌
            setAnnouncements(prevAnnouncements => [
                ...prevAnnouncements,
                ...data['announcements']
            ]);
        })

    }

    return (
        <div className={styles.announceContainer}>
            <div className={styles.announceHeader}>
                <p>공지사항</p>
            </div>
            <div className={styles.announceMid}>
                <ul className={styles.searchCategory}>
                    <li className={`${styles.searchCategoryItem} ${styles.selected}`} data-id="1">전체</li>
                    <li className={styles.searchCategoryItem} data-id="2">서비스</li>
                    <li className={styles.searchCategoryItem} data-id="3">업데이트</li>
                    <li className={styles.searchCategoryItem} data-id="4">이벤트</li>
                </ul>
                <form className={styles.searchBar}>
                    <input type="text" name="searchTextarea" id="search-textarea" className={styles.searchTextarea}
                           placeholder="검색어 입력"/>
                    <svg className={styles.searchIcon} viewBox="0 0 512 512">
                        <path
                            d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                    </svg>
                </form>
            </div>
            <div className={styles.announceMain}>
                <ul className={styles.announce}>
                    {announcements.map(announcement => (
                        <AnnouncementItem key={announcement.announcementId} details={announcement}/>
                    ))}
                </ul>
                <div className={styles.announceBottom}>
                    <div></div>
                    <div className={styles.loadMore} onClick={loadMoreData}>더보기</div>
                    <Link className={styles.writeAnnounce} href='cs/write'>글작성</Link>
                </div>
            </div>
        </div>
    );


}