import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';

const courses = [
    {
        title: '파이썬 기초부터 고급까지',
        description: '쉽고 재밌게 파이썬 배우기',
        price: 69000,
        rating: 5,
        imageSrc: '/images/test1.png'  // public 폴더 기준 절대 경로
    },
    {
        title: '백엔드 개발 (Java/Spring)',
        description: '쉽고 재밌게 배우는 백엔드 개발',
        price: 69000,
        rating: 4,
        imageSrc: '/images/test2.png'  // public 폴더 기준 절대 경로
    },
    // 추가 코스 객체들
    {
        title: '내가 최고의 AI',
        description: '내가 최고의 AI',
        price: 18000,
        rating: 5,
        imageSrc: '/images/test3.png'  // public 폴더 기준 절대 경로
    },
];

const CourseList = () => {
    const [courseData, setCourseData] = useState([]);

    useEffect(() => {
        // Fetch the course data from the API or database
        // For example:
        // fetch('/api/courses')
        //   .then(response => response.json())
        //   .then(data => setCourseData(data));

        // Here we use the static courses array for simplicity
        setCourseData(courses);
    }, []);

    return (
        <div className="course-list">
            {courseData.map((course, index) => (
                <CourseCard
                    key={index}
                    title={course.title}
                    description={course.description}
                    price={course.price}
                    rating={course.rating}
                    imageSrc={course.imageSrc}
                />
            ))}
        </div>
    );
};

export default CourseList;
