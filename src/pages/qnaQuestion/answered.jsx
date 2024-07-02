import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import QnaSideBar from '../../components/qna/qnasidebar';
import AnswerList from '../../components/qna/answerList';

const QnAPage = observer(() => {
    const [nickname, setNickname] = useState(null);

    useEffect(() => {
        // authStore에서 유저 닉네임을 가져옴
        const fetchNickname = async () => {
            const nickname = localStorage.getItem("nickname");
            if (nickname) {
                setNickname(nickname);
            }
        };
        fetchNickname();
    }, []);

    // 유저 닉네임이 로드되기 전까지 로딩 메시지를 표시
    if (!nickname) {
        return <p>Loading user info...</p>;
    }

    return (
        <div style={{ display: 'flex' }}>
            <QnaSideBar />
            <AnswerList nickname={nickname} />
        </div>
    );
});

export default QnAPage;
