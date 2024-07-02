import {useState} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/youtubeTextlize/youtubeTextlize.module.css'

export default function TextlizeYoutube() {
    const [url, setUrl] = useState('');
    const [originalText, setOriginalText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [textlizeError, setTextlizeError] = useState('');
    const [translateError, setTranslateError] = useState('');

    const [isLoadingTextlize, setIsLoadingTextlize] = useState(false);
    const [isLoadingTranslate, setIsLoadingTranslate] = useState(false);

    const handleGetText = async () => {
        setIsLoadingTextlize(true); // 로딩 상태 시작
        setTextlizeError(''); // 에러 초기화
        setTranslateError('');
        setOriginalText(''); // 기존 텍스트 초기화
        setTranslatedText(''); // 번역 텍스트 초기화
        try {
            const response = await axios.post('http://localhost:5000/getText', { url }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'text'  // Ensure we get the response as text
            });
            setOriginalText(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setTextlizeError('에러 : ' +  error);
        } finally {
            setIsLoadingTextlize(false); // 로딩 상태 종료
        }
    };

    const handleGetTranslate = async () => {
        setIsLoadingTranslate(true); // 로딩 상태 시작
        setTranslateError(''); // 에러 초기화
        try {
            const response = await axios.post('http://localhost:5000/getTranslate', { originalText }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'text'
            });
            setTranslatedText(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setTranslateError('에러 : ' + error);
        } finally {
            setIsLoadingTranslate(false); // 로딩 상태 종료
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>유튜브 링크 → 텍스트</h1>
            <p className={styles.description}>
                ※ 서버 성능 한계로 연산 자원이 부족하여 긴 영상을 요청하거나 동시에 요청하면 시간이 오래 걸릴 수 있습니다.
            </p>
            <p className={styles.description}>
                평균적으로 영상 길이의 15 ~ 20% 의 시간이 소요됩니다.
            </p>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="유튜브 링크"
                    className={`form-control ${styles.inputField}`}
                />
                {isLoadingTextlize && (
                    <div>
                        <div className={`spinner-border text-primary mt-3 ${styles.spinnerBorder}`} role="status">
                            <span className="visually-hidden">Loading....</span>
                        </div>
                        <p className={styles.statusText} style={{width: '70px'}}>변환중....</p>
                    </div>
                )}
            </div>
            <button onClick={handleGetText} className={`${styles.buttonPrimary} mt-2`}>
                변환하기
            </button>
            {textlizeError && <p className={styles.errorText}>잘못된 url 이거나 크롤링이 금지된 영상입니다.</p>}
            {originalText !== '' && (
                <div className={styles.resultSection}>
                    <h2 className={styles.subHeader}>변환된 텍스트</h2>
                    <p className={styles.originalText}>{originalText}</p>
                    <button onClick={handleGetTranslate} className={`${styles.buttonPrimary} mt-2`}>
                        번역하기
                    </button>
                    {isLoadingTranslate && (
                        <div>
                            <div className={`spinner-border text-primary mt-3 ${styles.spinnerBorder}`} role="status">
                                <span className="visually-hidden">Loading....</span>
                            </div>
                            <p className={styles.statusText} style={{width: '70px'}}>변환중....</p>
                        </div>
                    )}
                </div>
            )}
            {translateError && <p className={styles.errorText}>{translateError}</p>}
            { translatedText !== '' && (<div className={styles.resultSection}>
                <h2 className={styles.subHeader}>번역된 텍스트</h2>
                {isLoadingTranslate && (
                    <div>
                        <div className={`spinner-border text-primary mt-3 ${styles.spinnerBorder}`} role="status">
                            <span className="visually-hidden">Loading....</span>
                        </div>
                        <p className={styles.statusText}>번역중....</p>
                    </div>
                )}
                <p className={styles.translatedText}>{translatedText}</p>
            </div>)}
        </div>
    );
}
