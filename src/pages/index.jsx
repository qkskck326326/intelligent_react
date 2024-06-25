import React, { useEffect, useState } from 'react';
import { axiosClient } from "../axiosApi/axiosClient";
import NavBar from "../components/common/NavBar";
import UserInterestPackageList from "../components/main/userInterestPakcageList";
import UpperCategoryPackageList from "../components/main/upperCategoryPackageList";
import styles from '../styles/common/HomePage.module.css';

const HomePage = () => {
    const [banner, setBanner] = useState({ imageUrl: '/images/banner.png', linkUrl: '#' });

    useEffect(() => {
        fetchBannerImage();
    }, []);

    const fetchBannerImage = async () => {
        try {
            const response = await axiosClient.get('/admins/banners/latest');
            setBanner(response.data);
        } catch (error) {
            console.error('Failed to fetch banner image:', error);
        }
    };

    const handleOpenTestAI = () => {
        const width = 800;
        const height = 600;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);
        window.open('/admin/testAI', 'TestAI', `width=${width},height=${height},left=${left},top=${top}`);
    };

    const handleBannerClick = () => {
        if (banner.linkUrl) {
            window.open(banner.linkUrl, '_blank');
        }
    };

    return (
        <div>
            <main>
                <img
                    src={banner.imageUrl}
                    alt="Banner"
                    style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                    onClick={handleBannerClick}
                />
                <NavBar />
                <UserInterestPackageList />
                <UpperCategoryPackageList />
                <div
                    className={styles.fixedButton}
                    onClick={handleOpenTestAI}
                    style={{ cursor: 'pointer' }}
                >
                    <img
                        src="/images/SCC.png"
                        alt="Simple Code Compiler test"
                        style={{ width: '100px', height: '100px' }}
                    />
                </div>
            </main>
        </div>
    );
}

export default HomePage;
