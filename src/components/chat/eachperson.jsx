import React, {useEffect, useState} from "react";
import {observer} from 'mobx-react'
import styles from '../../styles/chatting/eachperson.module.css'

const EachPerson = observer(({ index, isSelected, onSelectionChange }) => {

    function handleSelection() {
        onSelectionChange(index);
    }

    //TODO 여기 디자인 작성
    return (
        <div className={`${styles.eachPersonContainer} ${isSelected && styles.checked}`} onClick={handleSelection}>
            <div className={styles.imageFrame}>
                {/* TODO 받아온 값*/}
                <img src="" alt="" />
            </div>

        </div>
    );
});

export default EachPerson;