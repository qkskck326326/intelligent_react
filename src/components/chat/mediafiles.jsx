import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import styles from '../../styles/chatting/mediafiles.module.css'
import AuthStore from "../../stores/authStore";
import MediaFile from "./mediafile";

const MediaFiles = observer(()=>{

    return (
        <div className={styles.files}>
            <MediaFile />
            <MediaFile />
            <MediaFile />
            <MediaFile />
            <MediaFile />


        </div>
    );
})

export default MediaFiles;