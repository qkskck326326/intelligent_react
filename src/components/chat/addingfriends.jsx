import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import styles from "../../styles/chatting/chatlist.module.css";
import PeopleToAdd from "./peopletoadd.jsx";
import AlertModal from "../common/Modal";

const AddingFriends = observer(({ isExpanding, onNavigateToList, onNavigateToModal, onNavigateToChat }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [checkColor, setCheckColor] = useState('lightgray')
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [noOneSelected, setNoOneSelected] = useState(false);
    const [activeModal, setActiveModal] = useState()
    const modal = new AlertModal();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(()=>{

        (selectedIndices?.length > 0) ? setCheckColor('black') : setCheckColor('lightgray')

    },[selectedIndices, searchQuery])


    const handleSelectionChange = (index) => {
        setSelectedIndices((prevSelectedIndices) => {
            if (prevSelectedIndices.includes(index)) {
                return prevSelectedIndices.filter((i) => i !== index);
            } else {
                return [...prevSelectedIndices, index];
            }
        });
    };

    const handleClickBack = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onNavigateToList();
            setIsAnimating(false);
            setCheckColor('lightgrey')
        }, 500);
    };

    const handleSubmission = (event) => {
        event.preventDefault();

        console.log(selectedIndices.join(', '))
        //0명이 선택되었을 때
        if (selectedIndices.length === 0){
            setNoOneSelected(true)
            return false;
        }
    }

    function handleSearchChange(event){
        // TODO useEffect로 변환시 마다 재랜더링 할수 있게 작업
        console.log(event.target.value)
        setSearchQuery(event.target.value)
    }

    function handleSubmit(event){
        event.preventDefault();
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
                <input className={styles.searchBox} type="text" placeholder='검색어를 입력하세요' onChange={handleSearchChange}/>
                <button className={styles.resetButton} type='reset'>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 384 512">
                        <path
                            d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/>
                    </svg>
                </button>
            </form>
            <div className={commonStyles.chatServiceMain}>
                <PeopleToAdd
                    selectedIndices={selectedIndices}
                    onSelectionChange={handleSelectionChange}
                />
            </div>
            {
                noOneSelected && modal.yesOnly(`최소 한 명 이상을 선택해야 합니다.`, setNoOneSelected, false)
            }
        </div>
    );
});

export default AddingFriends;