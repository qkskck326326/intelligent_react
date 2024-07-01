import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import styles from '../../styles/chatting/mediafiles.module.css'
import MediaFile from "./mediafile";

const MediaFiles = observer(({items, setItems})=>{

    const [fileUrls, setFileUrls] = useState([]);

    useEffect(() => {
        const newFileUrls = items.map((item) => {
            const reader = new FileReader();
            reader.readAsDataURL(item);
            return new Promise(resolve => {
                reader.onloadend = () => {
                    if (item.type.startsWith('image/')) {
                        resolve({ url: reader.result, details: item})
                    }
                    else if (item.type.startsWith('video/')) {
                        resolve({ url: '/images/defaultvideoicon.png', details: item})
                    } else{
                        resolve({ url: '/images/defaultfileicon.png', details: item})
                    }

                };
            });
        });

        Promise.all(newFileUrls).then(urls => {
            setFileUrls(urls);
        });
    }, [items]);

    const handleDelete = (item) => {
        setItems(prevItems => prevItems.filter(file => file !== item));
    };

    return (
        <div className={styles.files}>
            {fileUrls.map((file, index) => (
                <MediaFile key={index} details={file.details} url={file.url} index={index + 1} onDelete={() => handleDelete(file.details)} />
            ))}
        </div>
    );
});

export default MediaFiles;