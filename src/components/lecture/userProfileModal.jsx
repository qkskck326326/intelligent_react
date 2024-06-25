import React from 'react';
import styles from '../../styles/lecture/userProfileModal.module.css';

const UserProfileModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <span className={styles.closeButton} onClick={onClose}>X</span>
                <img src={user.profileImageUrl} alt="Profile" className={styles.profileImage} />
                <h2>{user.nickname}</h2>
                <p>가입 날짜: {new Date(user.registerTime).toLocaleDateString()}</p>
                <p>사용자 유형: {user.userType}</p>
            </div>
        </div>
    );
};

export default UserProfileModal;
