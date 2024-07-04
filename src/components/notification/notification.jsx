import React, { useEffect, useState } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import authStore from "../../stores/authStore";
import styles from "../../styles/notification/notification.module.css";
import NotificationSettings from "./notificationSettings";

const Notification = ({ setNotificationCount }) => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [isRotating, setIsRotating] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const nickname = authStore.getNickname();
                const response = await axiosClient.get(`/notification/${nickname}`);
                setNotifications(response.data);
                setNotificationCount(response.data.length);
            } catch (err) {
                setError(err);
            }
        };

        fetchNotifications();
    }, [setNotificationCount]);

    const handleDelete = async (notificationId) => {
        try {
            await axiosClient.delete(`/notification/${notificationId}`);
            setNotifications((prevNotifications) =>
                prevNotifications.filter((notification) => notification.notificationId !== notificationId)
            );
            setNotificationCount(notifications.length - 1);
        } catch (err) {
            console.error("Error deleting notification:", err);
        }
    };

    const handleNotificationClick = (link) => {
        window.location.href = link;
    };

    const toggleSettings = () => {
        setIsRotating(true);
        setShowSettings(!showSettings);

        setTimeout(() => {
            setIsRotating(false);
        }, 360);
    };

    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.notificationPopup}>
            <div className={styles.notificationHeader}>
                <span className={styles.notificationTitle}>알림</span>
                <button onClick={toggleSettings} className={`${styles.settingsButton} ${isRotating ? styles.rotating : ''}`}>
                    <img src="/images/settingsIcon.png" alt="Settings" className={styles.settingsIcon} />
                </button>
            </div>
            <div className={styles.notificationContentWrapper}>
                {showSettings ? (
                    <NotificationSettings />
                ) : (
                    <>
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div key={notification.notificationId} className={styles.notificationItem}>
                                    <div 
                                        className={styles.notificationContent}
                                        onClick={() => handleNotificationClick(notification.notificationLink)}
                                    >
                                        {notification.notificationContent}
                                    </div>
                                    <button onClick={() => handleDelete(notification.notificationId)} className={styles.deleteButton}>
                                        X
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noNotifications}>
                                <p>알림이 없습니다.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Notification;
