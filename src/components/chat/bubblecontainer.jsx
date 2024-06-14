import React, {useEffect, useState} from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import AuthStore from "../../stores/authStore";
import Bubble from './bubble.jsx'
import styles from '../../styles/chatting/chatbubble.module.css'
import authStore from "../../stores/authStore";

const BubbleContainer = observer(()=>{



    return(
        <div className={`${styles.bubbleContainer}`}>
        {<>
            <Bubble />
            <Bubble />
            <Bubble />
            <Bubble />
            <Bubble />
            <Bubble />
            <Bubble />
            <Bubble />
            <Bubble />
            <Bubble />
        </>
        }
    </div>);
})

export default BubbleContainer;