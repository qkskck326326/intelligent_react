import React, {useEffect} from "react";
import { observer } from 'mobx-react';
import styles from '../../styles/chatting/mediafiles.module.css'

const MediaFile = observer(({ details, url, onDelete, index }) => {
    return (
        <div className={styles.fileContainer}>
            <img className={styles.preview} src={url} alt={details.name}/>
            <button className={styles.x} onClick={onDelete}>
                <svg className={styles.xImage} xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 384 512">
                    <path
                        d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                </svg>
            </button>
            <div className={styles.numero}>
                {index}
            </div>
        </div>
    );
});

export default MediaFile;