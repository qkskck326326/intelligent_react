import React, {useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import styles from '../../styles/chatting/chat.module.css'
import bubbleStyles from '../../styles/chatting/chatbubble.module.css'
import {axiosClient} from "../../axiosApi/axiosClient";
import BotBubble from "./chatbotbubble";


const Bot = observer(({ isExpanding, onNavigateToList}) => {

    const [isAnimating, setIsAnimating] = useState(false);
    const [textContent, setTextContent] = useState('');
    const [messages, setMessages] = useState([])

    useEffect(() => {
        document.addEventListener('keypress', handleKeyPress);

        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
    }, []);

    async function fetchAIResponse(prompt) {
        // API 요청에 사용할 옵션을 정의
        const requestOptions = {
            method: 'POST',
            // API 요청의 헤더를 설정
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 여기에 api키 넣어야함 ㅋㅋ`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",  // 사용할 AI 모델
                messages: [{
                    role: "user", // 메시지 역할을 user로 설정
                    content: prompt // 사용자가 입력한 메시지
                }, ],
                temperature: 0.8, // 모델의 출력 다양성
                max_tokens: 256, // 응답받을 메시지 최대 토큰(단어) 수 설정
                top_p: 1, // 토큰 샘플링 확률을 설정
                frequency_penalty: 0.5, // 일반적으로 나오지 않는 단어를 억제하는 정도
                presence_penalty: 0.5, // 동일한 단어나 구문이 반복되는 것을 억제하는 정도
                stop: ["종료"], // 생성된 텍스트에서 종료 구문을 설정
            }),
        };
        // API 요청후 응답 처리
        try {
            const response = await fetch(apiEndpoint, requestOptions);
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            const responseMessage = {
                message: aiResponse
            }
            setMessages((prevMessages) => [...prevMessages, responseMessage])

        } catch (error) {
            console.error('OpenAI API 호출 중 오류 발생:', error);
            const responseMessage = {
                userId: 'gpt',
                message: `<a href='http://localhost:3000'>여기</a>에서 메인 페이지로 돌아갈 수 있습니다.`
            };
            setMessages((prevMessages) => [...prevMessages, responseMessage])
        }
    }


    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleSubmit(event);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleFormSubmit(event);
        }
    };

    const handleClickBack = () => {
        if(window.confirm('나가시면 모든 채팅이 지워집니다.')) {
            setIsAnimating(true);
            setTimeout(() => {
                onNavigateToList();
                setIsAnimating(false);
            }, 500);
        }else{
            return;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (textContent.trim() === '') {
            return window.alert('메시지를 작성해주세요.');
        }
        console.log(textContent)
        const message = {
            userId: 'user',
            message: textContent
        }

        setMessages((prevMessages) => [...prevMessages, message])
        setTextContent('')
        fetchAIResponse(textContent)

    };

    return (
        <div
            className={`${styles.chatContainer} ${isAnimating ? commonStyles.animateCollapse : ''} ${isExpanding ? commonStyles.animateExpand : ''}`}
            onKeyDown={handleKeyPress}>
            <div className={styles.chatTop}>
                <button className={`${styles.topButtons} ${styles.back}`} onClick={handleClickBack}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 448 512">
                        <path
                            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                    </svg>
                </button>
                <div className={styles.title}>
                    인텔리봇
                </div>
                <div className={commonStyles.invisible}>
                    더미
                </div>

            </div>

            <div className={styles.chatMain}>
                <div className={bubbleStyles.bubbleContainer}>
                    <BotBubble message={{userId: 'gpt', message:'안녕하세요 인텔리봇이긔'}} />
                    {   messages.map((message, index) => {
                            return <BotBubble key={index} message={message} />
                        })
                    }
                </div>
            </div>

            <form className={styles.chatBottom} onSubmit={handleSubmit}>
                <textarea
                    name="textContent"
                    id="textContent"
                    placeholder='텍스트를 입력해주세요'
                    className={`${styles.textContent}`}
                    value={textContent}
                    onChange={(event)=> setTextContent(event.target.value)}></textarea>
                <button className={styles.send} type='submit'>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 512 512">
                        <path
                            d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z"/>
                    </svg>
                </button>
            </form>
        </div>

    );
});

export default Bot;
