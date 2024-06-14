import React, {useEffect, useState} from "react";
import {observer} from 'mobx-react'
import styles from '../../styles/chatting/eachperson.module.css'

const EachPerson = observer(({ index, isSelected, onSelectionChange }) => {

    function handleSelection() {
        onSelectionChange(index);
    }

    return (
        <div className={`${styles.eachPersonContainer} ${isSelected ? styles.checked : ''}`} onClick={handleSelection}>
            눌러보삼
        </div>
    );
});

export default EachPerson;