import React from 'react';
import BoardList from "../../components/itNews/boardList";
import Link from "next/link";

const Index = () => {
    return (
        <div>
            <h1>itNewsBoard</h1>
            <Link href={'/itNewsSite'}/>
            <BoardList/>
        </div>
    );
};

export default Index;

