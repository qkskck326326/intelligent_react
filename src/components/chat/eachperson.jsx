import React, {useEffect, useState} from "react";
import {observer} from 'mobx-react'
import styles from '../../styles/chatting/eachperson.module.css'

const EachPerson = observer(({person, isSelected, onSelectionChange }) => {

    function handleSelection() {
        onSelectionChange(person.nickname);
    }

    return (
        <div className={`${styles.eachPersonContainer} ${isSelected && styles.checked}`} onClick={handleSelection}>
            <div className={styles.imageFrame}>
                <img className={styles.image} src={person.profileImageUrl} alt="" />
            </div>
            <div className={styles.userdetail}>
                {person.nickname}
            </div>
        </div>
    );
});

export default EachPerson;