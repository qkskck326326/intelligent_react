import React, { useEffect, useState } from 'react';
import styles from '../../styles/lecturePackage/profileModal.module.css';
import { axiosClient } from "../../axiosApi/axiosClient";
import { differenceInMonths, parseISO } from "date-fns";

const ProfileModal = ({ profile, onClose }) => {
    const [educations, setEducations] = useState([]);
    const [careers, setCareers] = useState([]);
    const [totalCareer, setTotalCareer] = useState("");
    const nickname = profile.nickname;

    useEffect(() => {
        const fetchEducationData = async () => {
            try {
                const response = await axiosClient.get('/educations', { params: { nickname: nickname } });
                setEducations(response.data);
                console.log("Educations: ", response.data);
            } catch (error) {
                console.error("Error fetching education data:", error);
            }
        };

        const fetchCareerData = async () => {
            try {
                const response = await axiosClient.get('/careers', { params: { nickname: nickname } });
                setCareers(response.data);
                console.log("Careers: ", response.data);

                // 경력 총계 계산
                const totalMonths = response.data.reduce((total, career) => {
                    const start = parseISO(career.startDate);
                    const end = parseISO(career.endDate);
                    return total + differenceInMonths(end, start);
                }, 0);

                const years = Math.floor(totalMonths / 12);
                const months = totalMonths % 12;
                if(months === 0){
                    setTotalCareer(`${years}년`);
                }else{
                    setTotalCareer(`${years}년 ${months}개월`);
                }

            } catch (error) {
                console.error("Error fetching career data:", error);
            }
        };

        fetchEducationData();
        fetchCareerData();
    }, [nickname]);

    // 경력 기간 계산 함수

    const calculateCareerDuration = (startDate, endDate) => {
        if(startDate != null && endDate != null) {
            const start = parseISO(startDate);
            const end = parseISO(endDate);
            const totalMonths = differenceInMonths(end, start);
            const years = Math.floor(totalMonths / 12);
            const months = totalMonths % 12;
            if (months === 0) {
                return `${years}년`;
            } else {
                return `${years}년 ${months}개월`;
            }
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.line}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <div className={styles.profileContainer}>
                    <div className={styles.profileItem}>
                        <img src={profile.pictureUrl} alt="프로필 사진" className={styles.profilePicture}/>
                        <span className={styles.nickname}>{profile.nickname}</span>
                    </div>
                </div>
                <div className={styles.horizontalLine}></div>
                <div className={styles.educationSection}>
                    <div className={styles.titleEducation}>학력</div>
                    {educations.filter(education => education.educationLevel === "university").map((education) => (
                        <div key={education.educationId} className={styles.educationItem}>
                            <div>
                                <span className={styles.title}>{education.schoolName}</span>
                                <span>{education.educationStatus}</span>
                            </div>
                            <div>
                                <span>{education.major}</span>
                                <span>({education.universityLevel})</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.horizontalLine}></div>
                <div className={styles.careerSection}>
                    <div className={styles.titleCareer}>경력 <span className={styles.totalCareer}>(총 경력: {totalCareer})</span>
                    </div>
                    <div className={styles.careerGrid}>
                        {careers.map((career) => (
                            <div key={career.careerId} className={styles.careerItem}>
                                <span className={styles.careerItemLeft}>
                                    <span className={styles.title2}>{career.institutionName}</span>
                                    <span className={styles.position}>{career.position}</span>
                                </span>
                                <span className={styles.careerItemRight}>
                                    <span>({career.department})</span>
                                    <span
                                        className={styles.duration}>{calculateCareerDuration(career.startDate, career.endDate)}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.horizontalLine}></div>
            </div>
            </div>
        </div>
    );
};

export default ProfileModal;