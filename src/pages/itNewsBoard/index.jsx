import React from 'react';
import BoardList from "../../components/itNews/boardList";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';

const Index = () => {
    return (
        <div>
            <h1>itNewsBoard</h1>
            <Link href={'/itNewsSite'}>사이트 리스트</Link>
            <BoardList/>
        </div>
    );
};

export default Index;

