import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/lecture/transportext.module.css';

const Transportext = ({ lectureId }) => {
    const [transcript, setTranscript] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [activeTab, setActiveTab] = useState('transcript'); // activeTab 상태 추가

    useEffect(() => {
        if (lectureId) {
            fetchVideoUrl(lectureId);
        }
    }, [lectureId]);

    useEffect(() => {
        if (videoUrl) {
            fetchTranscript(videoUrl);
        }
    }, [videoUrl]);

    const fetchVideoUrl = async (lectureId) => {
        try {
            const response = await axios.get('http://localhost:5000/video-url', {
                params: { lecture_id: lectureId }
            });
            setVideoUrl(response.data.video_url);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    const fetchTranscript = async (videoUrl) => {
        try {
            const response = await axios.get('http://localhost:5000/transcribe', {
                params: { video_url: videoUrl }
            });
            setTranscript(response.data.transcript);
            setSummary(response.data.summary);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.transcriptContainer}>
            <div className={styles.tabMenu}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'transcript' ? styles.active : ''}`}
                    onClick={() => setActiveTab('transcript')}
                >
                    텍스트
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'summary' ? styles.active : ''}`}
                    onClick={() => setActiveTab('summary')}
                >
                    요약
                </button>
            </div>
            <div className={styles.content}>
                {activeTab === 'transcript' && (
                    <>
                        <h2>Transcript</h2>
                        <pre className={styles.contentPre} dangerouslySetInnerHTML={{ __html: transcript }}></pre>
                    </>
                )}
                {activeTab === 'summary' && (
                    <>
                        <h2>Summary</h2>
                        <pre className={styles.contentPre} dangerouslySetInnerHTML={{ __html: summary }}></pre>
                    </>
                )}
            </div>
        </div>
    );
};

export default Transportext;
