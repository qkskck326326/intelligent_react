import {useEffect, useState} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {axiosClient} from "../../axiosApi/axiosClient";

export default function GetText() {
    const [url, setUrl] = useState('');
    const [originalText, setOriginalText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGetText = async () => {
        setIsLoading(true); // 로딩 상태 시작
        setError(''); // 에러 초기화
        setOriginalText(''); // 기존 텍스트 초기화
        setTranslatedText(''); // 번역 텍스트 초기화
        try {
            const response = await axios.post('http://192.168.0.93:5000/getText', { url }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'text'  // Ensure we get the response as text
            });
            setOriginalText(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError('Error fetching data.');
        } finally {
            setIsLoading(false); // 로딩 상태 종료
        }
    };

    const doCrowling = () => {
        axios.get("http://localhost:5000/crowling")
    }

    return (
        <div>
            <h1>유튜브 링크 → 텍스트</h1><button onClick={doCrowling}>크롤링 요청</button>
            <p>※ 서버 성능 한계로 연산자원이 부족하여 긴 영상을 요청하거나 동시에 요청하면 시간이 오래 걸릴 수 있습니다.</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="유튜브 링크"
                className="form-control"
                style={{ width: '550px' }}
            />
                {isLoading && <div><div className="spinner-border text-primary mt-3" role="status">
                    <span className="visually-hidden">Loading....</span>
                </div><p>변환중....</p></div>}
            </div>
            <button onClick={handleGetText} className="btn btn-primary mt-2">
                변환하기
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <br />
            <h2>Original Text</h2>
            <br />
            <div dangerouslySetInnerHTML={{ __html: originalText }} />
            <h2>Translated Text</h2>
            <br />
            <p>{translatedText}</p>
        </div>
    );
}
