import React, { useEffect, useState } from 'react';
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from '../../styles/admin/TeacherAllow.module.css';
import Sidebar from "../../components/admin/Sidebar";

const TeacherAllow = () => {
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await axiosClient.get('/admins/teacher-applicants');
                setApplicants(response.data);
            } catch (error) {
                console.error('Error fetching applicants:', error);
            }
        };

        fetchApplicants();
    }, []);

    const handleApprove = async (email, provider) => {
        try {
            await axiosClient.put(`/admins/approve-teacher`, {
                email,
                provider
            });
            setApplicants(applicants.filter(applicant => !(applicant.userEmail === email && applicant.provider === provider)));
        } catch (error) {
            console.error('Error approving teacher:', error);
        }
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.content}>
                <h1 className={styles.title}>강사 신청 승인</h1>
                <table className={styles.userTable}>
                    <thead>
                    <tr>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>전화번호</th>
                        <th>닉네임</th>
                        <th>승인</th>
                    </tr>
                    </thead>
                    <tbody>
                    {applicants.length > 0 ? (
                        applicants.map((applicant, index) => (
                            <tr key={`${applicant.userEmail}-${applicant.provider}`}>
                                <td>{applicant.userName}</td>
                                <td>{applicant.userEmail}</td>
                                <td>{applicant.phone}</td>
                                <td>{applicant.nickname}</td>
                                <td>
                                    <button
                                        className={styles.approveButton}
                                        onClick={() => handleApprove(applicant.userEmail, applicant.provider)}
                                    >
                                        승인
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">신청한 강사가 없습니다.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherAllow;
