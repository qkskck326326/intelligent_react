import React from 'react';
import styles from '../../styles/lecturePackage/profileModal.module.css'

const ProfileModal = ({ profile, onClose }) => {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <div className={styles.profileContainer}>
                    <img src={profile.pictureUrl} alt="프로필 사진" className={styles.profilePicture} />
                    <p className={styles.nickname}>{profile.nickname}</p>
                    {/* 추가 프로필 정보들 */}
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;