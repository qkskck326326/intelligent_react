import React from 'react';
import { useRouter } from 'next/router';
import BoardDetail from '../../components/itNews/BoardDetail';

const BoardDetailPage = () => {
    const router = useRouter();
    const {no} = router.query;
    console.log(router.query);
    console.log(parseInt(no, 10));
    // no가 존재하는 경우에만 BoardDetail 컴포넌트를 렌더링합니다.
    return no ? <BoardDetail boardId={parseInt(no, 10)} /> : <div>Loading...</div>;
};

export default BoardDetailPage;
