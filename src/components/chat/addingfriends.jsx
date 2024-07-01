import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import styles from "../../styles/chatting/chatlist.module.css";
import PeopleToAdd from "./peopletoadd.jsx";
import AlertModal from "../common/Modal";
import {axiosClient} from "../../axiosApi/axiosClient";

const AddingFriends = observer(({option, isExpanding, onNavigateToList, onNavigateToModal, userId, userType }) => {

    const [isAnimating, setIsAnimating] = useState(false);
    const [people, setPeople] = useState([])
    const [roomType, setRoomType] = useState(option)
    const [checkColor, setCheckColor] = useState('lightgray')
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [noOneSelected, setNoOneSelected] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const modal = new AlertModal();
    const [keyword, setKeyword] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const scrollContainerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(()=>{
        setPeople([]);
        setSelectedIndices([]);
        setPage(1);
        setHasMore(true);

        if(searchQuery === ''){
            fetchFriends(1)
        } else {
            fetchFriendswithQuery(1, searchQuery)
        }

    }, [searchQuery])

    useEffect(() => {
        setCheckColor(selectedIndices.length > 0 ? 'black' : 'lightgray');
    }, [selectedIndices]);

    const fetchFriends = (page) => {
        axiosClient.get('/users/getpeople', {
            params: {
                userId: userId,
                userType: userType,
                addingOption: option,
                page: page
            }
        })
            .then(response => {
                const data = response.data;
                if (data.length > 0) {
                    setPeople(prevPeople => [...prevPeople, ...data]);
                    setPage(prevPage => prevPage + 1);

                    if (data.length < 50) {
                        setHasMore(false);
                    }
                } else {
                    setHasMore(false);
                }
            })
            .catch(error => {
                console.error('An error occurred!', error);
            });
    };

    const fetchFriendswithQuery = (page, searchQuery) => {
        axiosClient.get('/users/getpeople', {
            params: {
                userId: userId,
                userType: userType,
                addingOption: option,
                page: page,
                searchQuery: searchQuery
            }
        })
            .then(response => {
                const data = response.data;
                if (data.length > 0) {
                    setPeople(prevPeople => [...prevPeople, ...data]);
                    setPage(prevPage => prevPage + 1);

                    if (data.length < 50) {
                        setHasMore(false);
                    }
                } else {
                    setHasMore(false);
                }
            })
            .catch(error => {
                console.error('An error occurred!', error);
            });
    }

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore) {
            if (searchQuery === '') {
                fetchFriends(page);
            } else {
                fetchFriendswithQuery(page, searchQuery);
            }
        }
    };

    const handleSelectionChange = (nickname) => {

        setSelectedIndices(prevSelectedIndices => {
            if (option === 'groups') {
                if (prevSelectedIndices.includes(nickname)) {
                    return prevSelectedIndices.filter(i => i !== nickname);
                } else {
                    return [...prevSelectedIndices, nickname];
                }
            } else {
                if (prevSelectedIndices.includes(nickname)) {
                    return [];
                } else {
                    return [nickname];
                }
            }
        });
    };

    const handleClickBack = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onNavigateToList();
            setIsAnimating(false);
            setCheckColor('lightgrey')
            setRoomType('')
        }, 500);
    };

    const handleSubmission = (event) => {

        event.preventDefault();

        //0명이 선택되었을 때
        if (selectedIndices.length === 0){
            setNoOneSelected(true)
            return false;
        } else{
            onNavigateToModal(selectedIndices.join(', '), roomType)
        }

    }

    function handleSearchChange(event){
        setKeyword(event.target.value)
    }

    function handleSubmit(event){
        event.preventDefault();
        setSearchQuery(keyword)
    }

    function handleReset(event){
        event.preventDefault();
        textRef.current.value = ''
        setPeople([]);
        setSelectedIndices([]);
        setPage(1);
        setHasMore(true);
        fetchFriends(1);
    }
    return (
        <div
            className={`${commonStyles.chatServiceContainer} ${isAnimating && commonStyles.animateCollapse} ${isExpanding ? commonStyles.animateExpand : ''}`}>
            <div className={styles.chatlistTop}>
                <button className={styles.topButtons} onClick={handleClickBack}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 448 512">
                        <path
                            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                    </svg>
                </button>
                <button className={`${styles.topButtons2} ${selectedIndices.length === 0 && styles.invalid}`}
                        onClick={handleSubmission}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 448 512">
                        <path
                            d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                            fill={checkColor}/>
                    </svg>
                </button>
            </div>
            <form className={styles.searchBar} onSubmit={handleSubmit}>
                <input className={styles.searchBox} type="text" placeholder='검색어를 입력하세요' onChange={handleSearchChange} ref={textRef}/>
                <button className={styles.resetButton} type='reset' onClick={handleReset}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 384 512">
                        <path
                            d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/>
                    </svg>
                </button>
            </form>
            <div className={commonStyles.chatServiceMain}
                 ref={scrollContainerRef}
                 onScroll={handleScroll}>
                <PeopleToAdd
                    selectedIndices={selectedIndices}
                    onSelectionChange={handleSelectionChange}
                    people={people}
                />
            </div>
            {
                noOneSelected && modal.yesOnly(`최소 한 명 이상을 선택해야 합니다.`, setNoOneSelected, false)
            }
        </div>
    );
});

export default AddingFriends;