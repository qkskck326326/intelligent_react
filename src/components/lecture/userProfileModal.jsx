import React from 'react';
import styles from '../../styles/lecture/userProfileModal.module.css';

const UserProfileModal = ({ user, education = [], career = [], certificates = [], onClose }) => {
    if (!user) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <span className={styles.closeButton} onClick={onClose}>X</span>
                <div className={styles.profileContainer}>
                    <div className={styles.profileImageContainer}>
                        <img src={user.profileImageUrl} alt="Profile" className={styles.profileImage} />
                    </div>
                    <div className={styles.profileDetails}>
                        <h2>{user.nickname}</h2>
                        <p>가입 날짜: {new Date(user.registerTime).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.\s*/g, '-').replace(/-$/, '')}</p>
                        <p>사용자 유형: {user.userType}</p>
                        {user.userType === '강사' && (
                            <>
                                <div className={styles.tooltipContainer}>
                                    <span className={styles.tooltipLabel}>학력</span>
                                    <div className={styles.tooltipContent}>
                                        {education.length > 0 ? (
                                            education.map((edu, index) => (
                                                <div key={index}>
                                                    <p>
                                                        {edu.schoolName && `${edu.schoolName} `}
                                                        {edu.major && `${edu.major} `}
                                                    </p>
                                                    <p>
                                                        {edu.entryDate && `${new Date(edu.entryDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.\s*/g, '-').replace(/-$/, '')} `}
                                                        {edu.graduationDate && `${new Date(edu.graduationDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.\s*/g, '-').replace(/-$/, '')} `}
                                                        {edu.educationStatus && `${edu.educationStatus} `}
                                                        {edu.homeAndTransfer && `${edu.homeAndTransfer} `}
                                                        {edu.passDate && `${new Date(edu.passDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.\s*/g, '-').replace(/-$/, '')}`}
                                                    </p>
                                                    <br></br>
                                                </div>
                                            ))
                                        ) : (
                                            <p>등록된 학력 정보가 없습니다.</p>
                                        )}
                                    </div>
                                </div>
                                <br></br>
                                <div className={styles.tooltipContainer}>
                                    <span className={styles.tooltipLabel}>경력</span>
                                    <div className={styles.tooltipContent}>
                                        {career.length > 0 ? (
                                            career.map((car, index) => (
                                                <div key={index}>
                                                    <p>
                                                        {car.institutionName && `${car.institutionName} `}
                                                        {car.department && `${car.department} `}
                                                        {car.position && `${car.position} `}
                                                    </p>
                                                    <p>
                                                        {car.startDate && `${new Date(car.startDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.\s*/g, '-').replace(/-$/, '')} `}
                                                        {car.endDate && `${new Date(car.endDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.\s*/g, '-').replace(/-$/, '')} `}
                                                        {car.responsibilities && `${car.responsibilities}`}
                                                    </p>
                                                    <br></br>
                                                </div>
                                            ))
                                        ) : (
                                            <p>등록된 경력 정보가 없습니다.</p>
                                        )}
                                    </div>
                                </div>
                                <br></br>
                                <div className={styles.tooltipContainer}>
                                    <span className={styles.tooltipLabel}>자격증</span>
                                    <div className={styles.tooltipContent}>
                                        {certificates.length > 0 ? (
                                            certificates.map((cert, index) => (
                                                <div key={index}>
                                                    <p>{cert.kind && `${cert.kind} `}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p>등록된 자격증 정보가 없습니다.</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
