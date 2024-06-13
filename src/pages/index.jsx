import React from 'react';
import NavBar from "../components/common/NavBar";
import CourseList from "../components/common/CourseList";
import styles from '../styles/common/HomePage.module.css'; // CSS 모듈 임포트

const HomePage = () => {

    const handleOpenTestAI = () => {
        const width = 800;
        const height = 600;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);
        window.open('/admin/testAI', 'TestAI', `width=${width},height=${height},left=${left},top=${top}`);
    };

    return (
        <div>
            <main>
                <img src='/images/banner.png' alt="Banner" style={{width: '100%', height:'auto'}}/>
                <NavBar/>
                <CourseList/>
                <div
                    className={styles.fixedButton}
                    onClick={handleOpenTestAI}
                    style={{ cursor: 'pointer' }}
                >
                    <img
                        src="/images/SCC.png"
                        alt="Simple Code Compiler"
                        style={{ width: '100px', height: '100px' }}
                    />
                </div>
            </main>
        </div>
    );
}

export default HomePage;
