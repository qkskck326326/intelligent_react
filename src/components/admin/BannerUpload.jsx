import React, { useState } from 'react';
import axios from 'axios';
import { axiosClient } from "../../axiosApi/axiosClient"; // axiosClient import 경로 확인

const BannerUpload = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [linkUrl, setLinkUrl] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('linkUrl', linkUrl);
        formData.append('imageFile', file);

        try {
            const response = await axiosClient.post('http://localhost:8080/admins/banners', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('File uploaded successfully. Image URL: ' + response.data.imageUrl);
        } catch (error) {
            console.error('Failed to upload image:', error);
            alert('Failed to upload image');
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Banner Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Link URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
            />
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default BannerUpload;
