import React, { useState, useEffect } from 'react';
import {axiosClient} from "../../axiosApi/axiosClient";
import 'bootstrap/dist/css/bootstrap.min.css';

const BoardDetail = ({ boardId }) => {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log("boardId: ", boardId)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const postResponse = await axiosClient.get(`/itNewsBoard/${boardId}`);
                //const commentsResponse = await axiosClient.get(`//itNewsBoard/${boardId}/comments`);
                setPost(postResponse.data);
                //setComments(commentsResponse.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [boardId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="board-detail">
            <h1>{post.title}</h1>
            <div className="post-meta">
                <span>작성일: {post.registDate}</span><br/>
                <span>원글링크: <a href={post.boardUrl}>{post.boardUrl}</a></span>
            </div>
            <br/>
            <div className="originalContext">
                {post.originalContext}
            </div>
            {/*post.videoTextlizedContext*/}
            {/*<div className="comments-section">*/}
            {/*    <h2>댓글</h2>*/}
            {/*    {comments.length > 0 ? (*/}
            {/*        comments.map(comment => (*/}
            {/*            <div key={comment.id} className="comment">*/}
            {/*                <div className="comment-meta">*/}
            {/*                    <span>{comment.author}</span>*/}
            {/*                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>*/}
            {/*                </div>*/}
            {/*                <div className="comment-content">*/}
            {/*                    {comment.content}*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        ))*/}
            {/*    ) : (*/}
            {/*        <div>댓글이 없습니다.</div>*/}
            {/*    )}*/}
            {/*</div>*/}
        </div>
    );
};

export default BoardDetail;