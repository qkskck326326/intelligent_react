import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/admin/Banner.module.css';
import Sidebar from "../../components/admin/Sidebar";
import {axiosClient} from "../../axiosApi/axiosClient";

const BannerManagement = () => {
    const [banners, setBanners] = useState([]);
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [selectedBanner, setSelectedBanner] = useState(null);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await axiosClient.get('http://localhost:8080/admins/banners');
            setBanners(response.data);
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    const handleSaveBanner = async () => {
        const bannerData = { title, imageUrl, linkUrl };
        try {
            if (selectedBanner) {
                await axios.put(`http://localhost:8080/admins/banners/${selectedBanner.id}`, bannerData);
            } else {
                await axios.post('http://localhost:8080/admins/banners', bannerData);
            }
            fetchBanners();
            resetForm();
        } catch (error) {
            console.error('Error saving banner:', error);
        }
    };

    const handleEditBanner = (banner) => {
        setSelectedBanner(banner);
        setTitle(banner.title);
        setImageUrl(banner.imageUrl);
        setLinkUrl(banner.linkUrl);
    };

    const handleDeleteBanner = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/admins/banners/${id}`);
            fetchBanners();
        } catch (error) {
            console.error('Error deleting banner:', error);
        }
    };

    const resetForm = () => {
        setSelectedBanner(null);
        setTitle('');
        setImageUrl('');
        setLinkUrl('');
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.content}>
                <div className={styles.header}>
                    <button className={styles.logout}>Logout</button>
                </div>
                <h1 className={styles.title}>배너 관리</h1>
                <div className={styles.formSection}>
                    <input
                        type="text"
                        placeholder="제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="이미지 URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="링크 URL"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                    />
                    <button onClick={handleSaveBanner}>
                        {selectedBanner ? '수정' : '등록'}
                    </button>
                    <button onClick={resetForm}>초기화</button>
                </div>
                <div className={styles.tableSection}>
                    <table className={styles.bannerTable}>
                        <thead>
                        <tr>
                            <th>제목</th>
                            <th>이미지</th>
                            <th>링크</th>
                            <th>액션</th>
                        </tr>
                        </thead>
                        <tbody>
                        {banners.map((banner) => (
                            <tr key={banner.id}>
                                <td>{banner.title}</td>
                                <td><img src={banner.imageUrl} alt={banner.title} /></td>
                                <td><a href={banner.linkUrl} target="_blank" rel="noopener noreferrer">{banner.linkUrl}</a></td>
                                <td>
                                    <button onClick={() => handleEditBanner(banner)}>수정</button>
                                    <button onClick={() => handleDeleteBanner(banner.id)}>삭제</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BannerManagement;
