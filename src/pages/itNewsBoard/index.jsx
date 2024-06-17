import React from 'react';
import BoardList from "../../components/itNews/boardList";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';

const Index = () => {
    return (
        <div>
            <h1>세계 IT 뉴스</h1>
            <Link href={'/itNewsSite'}>사이트 리스트</Link>
            <BoardList/>
        </div>
    );
};

export default Index;

