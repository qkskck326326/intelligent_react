import React from 'react';

const CourseCard = ({ title, description, price, rating, imageSrc }) => {
    return (
        <div className="course-card">
            <div className="course-image">
                <img src={imageSrc} alt={`${title} 썸네일`} />
            </div>
            <div className="course-info">
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="course-meta">
                    <span>{price}원</span>
                    <span>{'⭐'.repeat(rating)}</span>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
