import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../axiosApi/axiosClient';
import styles from '../../styles/lecture/transcriptSummary.module.css';

const TranscriptSummary = ({ streamUrl }) => {
    const [transcript, setTranscript] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (streamUrl) {
            fetchTranscript(streamUrl);
        }
    }, [streamUrl]);

    const fetchTranscript = async (streamUrl) => {
        try {
            const response = await axiosClient.get(`/transcript_and_summary`, {
                params: { video_url: streamUrl }
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
                <button className={styles.tabButton}>텍스트</button>
                <button className={styles.tabButton}>요약</button>
            </div>
            <div className={styles.content}>
                <h2>Transcript</h2>
                <pre>{transcript}</pre>
                <h2>Summary</h2>
                <pre>{summary}</pre>
            </div>
        </div>
    );
};

export default TranscriptSummary;
