import React, { useEffect, useState } from 'react';
import styles from '../../styles/announcement.module.css';
import AnnouncementItem from './announcementitem.jsx';
import Link from "next/link";
import { authStore } from "../../stores/authStore";

export default function Announcement(props) {

    const [announcements, setAnnouncements] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [category, setCategory] = useState(null);


    useEffect(() => {
        resetAndFetchAnnouncements();
    }, [category]);


    const resetAndFetchAnnouncements = async () => {
        setAnnouncements([]);
        setPage(1);
        setHasMore(true);
        if (category === null) {
            fetchAnnouncements(1);
        } else {
            fetchCategorizedAnnouncements(1, category);
        }
    };

    const fetchAnnouncements = async (page) => {
        try {
            const response = await fetch(`http://localhost:8080/announcement?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('An error occurred!');
            }
            const data = await response.json();

            if (data.length > 0) {
                setAnnouncements(prevAnnouncements => [...prevAnnouncements, ...data]);
                if (data.length < 10) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCategorizedAnnouncements = async (page, category) => {
        try {
            const response = await fetch(`http://localhost:8080/announcement/categorized?page=${page}&category=${category}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('An error occurred!');
            }
            const data = await response.json();
            if (data.length > 0) {
                setAnnouncements(prevAnnouncements => [...prevAnnouncements, ...data]);
                if (data.length < 10) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const loadMoreData = () => {
        if (hasMore) {
            const nextPage = page + 1;
            if (category === null) {
                fetchAnnouncements(nextPage);
            } else {
                fetchCategorizedAnnouncements(nextPage, category);
            }
            setPage(nextPage);
        }
    };

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
    };

    function handleSubmit(event){
        event.preventDefault();

    }

    return (
        <div className={styles.announceContainer}>
            <div className={styles.announceHeader}>
                <p>공지사항</p>
            </div>
            <div className={styles.announceMid}>
                <ul className={styles.searchCategory}>
                    <li className={`${styles.searchCategoryItem} ${category === null ? styles.selected : ''}`} onClick={() => handleCategoryChange(null)}>전체</li>
                    <li className={`${styles.searchCategoryItem} ${category === 0 ? styles.selected : ''}`} onClick={() => handleCategoryChange(0)}>서비스</li>
                    <li className={`${styles.searchCategoryItem} ${category === 1 ? styles.selected : ''}`} onClick={() => handleCategoryChange(1)}>업데이트</li>
                    <li className={`${styles.searchCategoryItem} ${category === 2 ? styles.selected : ''}`} onClick={() => handleCategoryChange(2)}>이벤트</li>
                </ul>
                <form onSubmit={handleSubmit} className={styles.searchBar}>
                    <input type="text" name="searchTextarea" id="search-textarea" className={styles.searchTextarea}
                           placeholder="검색어 입력"/>
                    <button type="submit" className={styles.searchButton}>
                        <svg className={styles.searchIcon} viewBox="0 0 512 512">
                            <path
                                d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                        </svg>
                    </button>
                </form>
            </div>
            <div>
                <ul className={styles.announce}>
                    {announcements.length > 0
                        ? announcements.map(announcement => (
                            <AnnouncementItem
                                key={announcement.announcementId}
                                details={announcement}
                            />
                        ))
                        : <div style={{ fontSize: '1.25rem' }}>아직 공지사항이 없어요
                        </div>
                    }
                </ul>
                <div className={styles.announceBottom}>
                    <div></div>
                    {hasMore ?
                        <div className={styles.loadMore} onClick={loadMoreData}>더보기</div>
                        :
                        <div>더 이상 불러올 정보가 없어요.</div>
                    }
                    {authStore.checkIsAdmin() ? <Link className={styles.writeAnnounce} href='cs/write'>글작성</Link> : <div></div>}
                </div>
            </div>
        </div>
    );
}
