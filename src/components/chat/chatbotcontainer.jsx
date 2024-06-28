import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { observer } from 'mobx-react';
import commonStyles from '../../styles/chatting/chatcommon.module.css';
import styles from '../../styles/chatting/chat.module.css';
import bubbleStyles from '../../styles/chatting/chatbubble.module.css';
import BotBubble from './chatbotbubble';

const Bot = observer(({ isExpanding, onNavigateToList }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [textContent, setTextContent] = useState('');
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const isTypingRef = useRef(false);
    const chatContainerRef = useRef(null);
    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

    useEffect(() => {
        document.addEventListener('keypress', handleKeyPress);
        document.addEventListener('keydown', handleF5Press);
        document.addEventListener('click', handleLinkClick);

        return () => {
            document.removeEventListener('keypress', handleKeyPress);
            document.removeEventListener('keydown', handleF5Press);
            document.removeEventListener('click', handleLinkClick);
        };
    }, []);

    useLayoutEffect(() => {
        scrollToBottom();
    }, [messages, currentMessage]);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    const handleF5Press = (event) => {
        if (event.key === 'F5') {
            const confirmRefresh = window.confirm(
                '새로고침을 하시면 지금까지의 채팅이 사라지고 페이지를 새로고침하게 됩니다. 계속하시겠습니까?'
            );
            if (!confirmRefresh) {
                event.preventDefault();
            }
        }
    };

    const handleLinkClick = (event) => {
        const target = event.target.closest('a');
        if (target && target.href && !target.href.includes('#')) {
            event.preventDefault();
            const confirmLeave = window.confirm(
                '이 링크를 클릭하면 지금까지의 채팅이 사라집니다. 계속하시겠습니까?'
            );
            if (confirmLeave) {
                window.location.href = target.href;
            }
        }
    };

    async function fetchAIResponse(prompt) {
        isTypingRef.current = true;
        setCurrentMessage(''); //
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer `
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0.5,
                presence_penalty: 0.5
            })
        };
        try {
            const response = await fetch(apiEndpoint, requestOptions);
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            simulateTyping(aiResponse);
        } catch (error) {
            console.error('OpenAI API 호출 중 오류 발생:', error);
            const errorMessage =
                "예기치 못한 에러가 발생했습니다. <a href='http://localhost:3000'>여기</a>에서 메인 페이지로 돌아갈 수 있습니다. 문제가 지속된다면 1:1문의 바랍니다.";
            simulateTyping(errorMessage);
        }
    }

    const simulateTyping = (text) => {
        // 어째서인지 첫번째 글자가 잘려서 강제로 글자 하나 추가함
        text = ' ' + text;
        let index = 0;
        const interval = setInterval(() => {
            setCurrentMessage((prev) => prev + text[index]);
            index++;
            if (index === text.length) {
                clearInterval(interval);
                isTypingRef.current = false;
                const responseMessage = {
                    message: text
                };
                setMessages((prevMessages) => [...prevMessages, responseMessage]);
            }
        }, 20);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleSubmit(event);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !isTypingRef.current) {
            handleFormSubmit(event);
        }
    };

    const handleClickBack = () => {
        if (window.confirm('나가시면 모든 채팅이 지워집니다.')) {
            setIsAnimating(true);
            setTimeout(() => {
                onNavigateToList();
                setIsAnimating(false);
            }, 500);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (textContent.trim() === '') {
            return window.alert('메시지를 작성해주세요.');
        }
        const message = {
            userId: 'user',
            message: textContent
        };

        setMessages((prevMessages) => [...prevMessages, message]);
        setTextContent('');
        await fetchAIResponse(textContent);
    };

    return (
        <div
            className={`${styles.chatContainer} ${
                isAnimating ? commonStyles.animateCollapse : ''
            } ${isExpanding ? commonStyles.animateExpand : ''}`}
            onKeyDown={handleKeyPress}
        >
            <div className={styles.chatTop}>
                <button
                    className={`${styles.topButtons} ${styles.back}`}
                    onClick={handleClickBack}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path
                            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
                        />
                    </svg>
                </button>
                <div className={styles.title}>인텔리봇</div>
                <div className={commonStyles.invisible}>더미</div>
            </div>

            <div className={styles.chatMain}>
                <div className={bubbleStyles.bubbleContainer} ref={chatContainerRef}>
                    <BotBubble message={{ userId: 'gpt', message: '안녕하세요 인텔리봇이긔' }} />
                    {messages.map((message, index) => (
                        <BotBubble key={index} message={message} />
                    ))}
                    {isTypingRef.current && currentMessage && (
                        <BotBubble message={{ userId: 'gpt', message: currentMessage }} />
                    )}
                </div>
            </div>

            <form className={styles.chatBottom} onSubmit={handleSubmit}>
                <textarea
                    name="textContent"
                    id="textContent"
                    placeholder="텍스트를 입력해주세요"
                    className={`${styles.textContent}`}
                    value={textContent}
                    onChange={(event) => setTextContent(event.target.value)}
                ></textarea>
                {!isTypingRef.current ? (
                    <button className={styles.send} type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path
                                d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7 9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z"
                            />
                        </svg>
                    </button>
                ) : (
                    <button className={styles.loader}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path
                                d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"
                            />
                        </svg>
                    </button>
                )}
            </form>
        </div>
    );
});

export default Bot;
