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
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        if (category !== null) {
            fetchCategorizedAnnouncements(page, category);
        } else if (keyword !== '') {
            searchAnnouncements(page, keyword);
        } else {
            fetchAnnouncements(page);
        }
    }, [category, keyword]);

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
                setPage(page + 1);

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
                setPage(page + 1);

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

    const searchAnnouncements = async (page, keyword) => {
        try {
            const response = await fetch(`http://localhost:8080/announcement/search?page=${page}&keyword=${keyword}`, {
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
                setPage(page + 1);

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
            if (category !== null) {
                fetchCategorizedAnnouncements(page, category);
            } else if (keyword !== '') {
                searchAnnouncements(page, keyword);
            } else {
                fetchAnnouncements(page);
            }
        }
    };

    const handleCategoryChange = (newCategory) => {
        setAnnouncements([]);
        setPage(1);
        setHasMore(true);
        setCategory(newCategory);
        setKeyword('');
    };

    const handleSearch = (event) => {
        event.preventDefault();
        setAnnouncements([]);
        setPage(1);
        setHasMore(true);
        setCategory(null);
        searchAnnouncements(1, keyword);
    };

    return (
        <div className={styles.announceContainer}>
            <div className={styles.announceHeader}>
                <p>공지사항</p>
            </div>
            <div className={styles.announceMid}>
                <ul className={styles.searchCategory}>
                    <li className={`${styles.searchCategoryItem} ${category === null ? styles.selected : ''}`} onClick={() => handleCategoryChange(null)}>전체</li>
                    <li className={styles.searchCategoryItem} onClick={() => handleCategoryChange(0)}>서비스</li>
                    <li className={styles.searchCategoryItem} onClick={() => handleCategoryChange(1)}>업데이트</li>
                    <li className={styles.searchCategoryItem} onClick={() => handleCategoryChange(2)}>이벤트</li>
                </ul>
                <form className={styles.searchBar} onSubmit={handleSearch}>
                    <input type="text" name="searchTextarea" id="search-textarea" className={styles.searchTextarea}
                           placeholder="검색어 입력" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                    <button type="submit">검색</button>
                </form>
            </div>
            <div className={styles.announceMain}>
                <ul className={styles.announce}>
                    {announcements.length > 0
                        ? announcements.map(announcement => (
                            <AnnouncementItem
                                key={announcement.announcementId}
                                details={announcement}
                            />
                        ))
                        : <div style={{ fontSize: '1.25rem' }}>아직 공지사항이 없어요 한번 만들어 보시는 건 어떨까요?
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
