import React, { useEffect, useState } from 'react';
import { axiosClient } from "../axiosApi/axiosClient";
import NavBar from "../components/common/NavBar";
import UserInterestPackageList from "../components/main/userInterestPakcageList";
import UpperCategoryPackageList from "../components/main/upperCategoryPackageList";
import styles from '../styles/common/HomePage.module.css';

const HomePage = () => {
    const [banners, setBanners] = useState([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    useEffect(() => {
        fetchBanners();
        recordVisit();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await axiosClient.get('/admins/banners');
            setBanners(response.data);
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        }
    };

    const recordVisit = async () => {
        try {
            const userEmail = localStorage.getItem('userEmail'); // 사용자의 이메일을 로컬 스토리지에서 가져옴
            if (userEmail) {
                await axiosClient.post('/admins/record-visit', null, {
                    params: { userEmail }
                });
            }
        } catch (error) {
            console.error('Failed to record visit:', error);
        }
    };

    const handleNextBanner = () => {
        setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    const handlePrevBanner = () => {
        setCurrentBannerIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    };

    const handleOpenTestAI = () => {
        const width = 800;
        const height = 600;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);
        window.open('/admin/testAI', 'TestAI', `width=${width},height=${height},left=${left},top=${top}`);
    };

    const handleBannerClick = () => {
        if (banners[currentBannerIndex].linkUrl) {
            window.open(banners[currentBannerIndex].linkUrl, '_blank');
        }
    };

    return (
        <div>
            <main>
                {banners.length > 0 && (
                    <div className={styles.bannerContainer}>
                        <button onClick={handlePrevBanner} className={`${styles.bannerButton} ${styles.left}`}>‹</button>
                        <img
                            src={banners[currentBannerIndex].imageUrl}
                            alt="Banner"
                            style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                            onClick={handleBannerClick}
                        />
                        <button onClick={handleNextBanner} className={`${styles.bannerButton} ${styles.right}`}>›</button>
                        <div className={styles.paginationContainer}>
                            <span>{currentBannerIndex + 1}/{banners.length}</span>
                        </div>
                    </div>
                )}
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
                        style={{ width: '100px', height: '100px' ,marginRight:'100px'}}
                    />
                </div>
            </main>
        </div>
    );
}

export default HomePage;
