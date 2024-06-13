import React, { useState } from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import AuthStore from "../../stores/authStore";
import Bubble from './bubble.jsx'
import styles from '../../styles/chatting/chatbubble.module.css'

const BubbleContainer = observer(()=>{

    return(<div className={styles.bubbleContainer}>
        {<>
            <Bubble />

        </>
        }
    </div>);
})

export default BubbleContainer;