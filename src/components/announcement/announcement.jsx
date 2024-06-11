import React, { useEffect, useState } from 'react';
import styles from '../../styles/announcement.module.css';
import AnnouncementItem from './announcementitem.jsx';
import Link from "next/link";
import authStore from "../../stores/authStore";
import AnnouncementAxios from '../../axiosApi/announcementAxios';
import { observer } from 'mobx-react';

const Announcement = observer (() => {
    const [announcements, setAnnouncements] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [category, setCategory] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {

        if (category !== null) {
            // 카테고리가 클릭되었을 때
            setAnnouncements([]);
            setPage(1);
            fetchCategorizedAnnouncements(1, category);
        } else if (keyword !== '') {
            // 키워드가 입력되었을 때
            setAnnouncements([]);
            setPage(1);
            searchAnnouncements(1, keyword);
        } else {
            // 첫 진입시
            setAnnouncements([]);
            setPage(1);
            fetchAnnouncements(1);
        }
    }, [category, searchQuery]);

    // fetch문 작성 연습
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
                // page 값을 1을 올림
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
        setCategory(newCategory);
        setSearchQuery('');
        console.log(searchQuery);
        console.log(keyword);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        setCategory(null);
        setSearchQuery(keyword);
    };

    function handleClick(id) {
        console.log('triggered');
        const axios = new AnnouncementAxios();
        axios.get('/announcement/id', `?announcementId=${id}`)
            .then(data => {
                setDetails(data);
                console.log(`data임 ${data}`);
            });
    }

    return (
        <div className={styles.announceContainer}>
            <div className={styles.announceHeader}>
                <p>공지사항</p>
            </div>
            <div className={styles.announceMid}>
                <ul className={styles.searchCategory}>
                    <li className={`${styles.searchCategoryItem} ${category === null ? styles.selected : ''}`} onClick={() => window.location.href = '/cs'}>전체</li>
                    <li className={`${styles.searchCategoryItem} ${category === 0 ? styles.selected : ''}`} onClick={() => handleCategoryChange(0)}>서비스</li>
                    <li className={`${styles.searchCategoryItem} ${category === 1 ? styles.selected : ''}`} onClick={() => handleCategoryChange(1)}>업데이트</li>
                    <li className={`${styles.searchCategoryItem} ${category === 2 ? styles.selected : ''}`} onClick={() => handleCategoryChange(2)}>이벤트</li>
                </ul>
                <form className={styles.searchBar} onSubmit={handleSearch}>
                    <input type="text" name="searchTextarea" id="search-textarea" className={styles.searchTextarea}
                           placeholder="검색어 입력" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                    <button type="submit" className={styles.searchButton}>
                        <svg className={styles.searchIcon} viewBox="0 0 512 512">
                            <path
                                d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                        </svg>
                    </button>
                </form>
            </div>
            <div className={styles.announceMain}>
                <ul className={styles.announce}>
                    {announcements.length > 0
                        ? announcements.map(announcement => (
                            <AnnouncementItem
                                key={announcement.announcementId}
                                details={announcement}
                                onClick={() => { handleClick(announcement.announcementId) }}
                            />
                        ))
                        : <div></div>
                    }
                </ul>
                <div className={styles.announceBottom}>
                    <div></div>
                    {hasMore ?
                        <div className={styles.loadMore} onClick={loadMoreData}>더보기</div>
                        :
                        <div></div>
                    }
                    {authStore.checkIsAdmin() ?
                    <Link className={styles.writeAnnounce} href='cs/write'>글작성</Link>
                    : <div></div>}
                </div>
            </div>
        </div>
    );
});

export default Announcement;
