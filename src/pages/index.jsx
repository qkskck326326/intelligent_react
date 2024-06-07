import React from 'react';
import NavBar from "../components/common/NavBar";
import CourseList from "../components/common/CourseList";

const HomePage = () => {
    return (
        <div>
            <main>
                <img src='/images/banner.png' alt="Banner" style={{width: '100%', height:'auto'}}/>
                <NavBar/>
                <CourseList/>
            </main>
        </div>
    );
}

export default HomePage;
