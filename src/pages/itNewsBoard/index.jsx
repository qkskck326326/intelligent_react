import React from 'react';
import BoardList from "../../components/itNews/boardList";
import Link from "next/link";

const Index = () => {
    return (
        <div>
            <h1>해외 IT 뉴스</h1>
            <Link href={'/itNewsSite'}>사이트 리스트</Link>
            <BoardList/>
        </div>
    );
};

export default Index;

