import React, {useEffect, useState} from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import AuthStore from "../../stores/authStore";
import Bubble from './bubble.jsx'
import styles from '../../styles/chatting/chatbubble.module.css'
import authStore from "../../stores/authStore";

const BubbleContainer = observer(({onAnnouncementChange, onReport, option})=>{

    const sampleArray = Array.from({length: 20}, (_, index) => index)


    return(
        <div className={`${styles.bubbleContainer}`}>
        {
            sampleArray.map(sample => <Bubble key={sample} index={sample} option={option} onAnnouncementChange={onAnnouncementChange} onReport={onReport} />)
        }
    </div>);
})

export default BubbleContainer;