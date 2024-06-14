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
    const [modalOn, setModalOn] = useState(false);
    const modal = new AlertModal();

    useEffect(()=>{

        (selectedIndices?.length > 0) ? setCheckColor('black') : setCheckColor('lightgray')

    },[selectedIndices])


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
        // TODO 완전히 뜯어 고쳐야함

    }

    return (
        <div
            className={`${commonStyles.chatServiceContainer} ${isAnimating ? commonStyles.animateCollapse : ''} ${isExpanding ? commonStyles.animateExpand : ''}`}>
            <div className={styles.chatlistTop}>
                <button className={styles.topButtons} onClick={handleClickBack}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 448 512">
                        <path
                            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                    </svg>
                </button>
                <button className={styles.topButtons2} onSubmit={handleSubmission}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 448 512">
                        <path
                            d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                            fill={checkColor}/>
                    </svg>
                </button>
            </div>
            <div className={commonStyles.chatServiceMain}>
                <PeopleToAdd
                    selectedIndices={selectedIndices}
                    onSelectionChange={handleSelectionChange}
                />
            </div>

        </div>
    );
});

export default AddingFriends;