import React, { useState, useEffect } from 'react';
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from '../../styles/lecture/transcriptSummary.module.css';

const TranscriptSummary = ({ streamUrl }) => {
    const [transcript, setTranscript] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('transcript');

    useEffect(() => {
        if (streamUrl) {
            fetchTranscript(streamUrl);
        }
    }, [streamUrl]);

    const fetchTranscript = async (streamUrl) => {
        try {
            const response = await axiosClient.get(`/api/transcript`, {
                params: { stream_url: streamUrl }
            });
            setTranscript(response.data);
            setLoading(false);
            fetchSummary(response.data);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    const fetchSummary = async (transcript) => {
        try {
            const response = await axiosClient.post(`/api/summary`, { transcript });
            setSummary(response.data);
        } catch (error) {
            setError(error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.transcriptContainer}>
            <div className={styles.tabMenu}>
                <button 
                    className={activeTab === 'transcript' ? styles.activeTabButton : styles.tabButton}
                    onClick={() => setActiveTab('transcript')}
                >
                    텍스트
                </button>
                <button 
                    className={activeTab === 'summary' ? styles.activeTabButton : styles.tabButton}
                    onClick={() => setActiveTab('summary')}
                >
                    요약
                </button>
            </div>
            <div className={styles.content}>
                {activeTab === 'transcript' && (
                    <>
                        <h2>Transcript</h2>
                        <pre>{transcript}</pre>
                    </>
                )}
                {activeTab === 'summary' && (
                    <>
                        <h2>Summary</h2>
                        <pre>{summary}</pre>
                    </>
                )}
            </div>
        </div>
    );
};

export default TranscriptSummary;
