import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../axiosApi/axiosClient';
import authStore from '../../stores/authStore';
import styles from '../../styles/notification/notificationSettings.module.css';

const NotificationSettings = () => {
    const [settings, setSettings] = useState([]);
    const nickname = authStore.getNickname(); // authStore에서 닉네임 가져오기

    useEffect(() => {
        axiosClient.get(`/notification/settings/${nickname}`)
            .then(response => {
                setSettings(response.data);
            })
            .catch(err => {
                console.error("Error fetching notification settings:", err);
            });
    }, [nickname]);

    const toggleSetting = (type) => {
        const updatedSettings = settings.map(setting =>
            setting.notificationType === type
                ? { ...setting, isEnabled: setting.isEnabled === 'Y' ? 'N' : 'Y' }
                : setting
        );
        setSettings(updatedSettings);

        axiosClient.put(`/notification/settings/${nickname}`, { notificationType: type, isEnabled: updatedSettings.find(setting => setting.notificationType === type).isEnabled })
            .then(response => {
                console.log("Notification setting updated:", response.data);
            })
            .catch(err => {
                console.error("Error updating notification setting:", err);
            });
    };

    return (
        <div className={styles.settingsContainer}>
            {settings.map(setting => (
                <div key={setting.notificationType} className={styles.settingItem}>
                    <span>{setting.notificationType === 1 ? "강의 댓글의 답글" : 
                          setting.notificationType === 2 ? "QnA 질문에 답변" : 
                          setting.notificationType === 3 ? "공지사항" : 
                          setting.notificationType === 4 ? "본인 게시물 좋아요" : 
                          "본인 게시물에 댓글"}</span>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={setting.isEnabled === 'Y'}
                            onChange={() => toggleSetting(setting.notificationType)}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>
            ))}
        </div>
    );
};

export default NotificationSettings;
