import React, { useState, useEffect } from 'react';
import { axiosClient } from "../../axiosApi/axiosClient";
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="alert alert-danger">Error: {error.message}</div>;

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h1 className="card-title">{post.title}</h1>
                    <div className="post-meta text-muted mb-3">
                        <span>작성일: {formatDate(post.registDate)}</span><br />
                        <span>원글링크: <a href={post.boardUrl} target="_blank" rel="noopener noreferrer">{post.boardUrl}</a></span>
                    </div>
                    <div className="originalContext mb-3">
                        {post.originalContext}
                    </div>
                    <div className="videoTextlizedContext">
                        <h5>영상 내용 :</h5>
                        {post.videoTextlizedContext ? (
                            <div>{post.videoTextlizedContext}</div>
                        ) : (
                            <p>없음</p>
                        )}
                    </div>
                </div>
            </div>
            {/*<div className="comments-section mt-4">*/}
            {/*    <h2>댓글</h2>*/}
            {/*    {comments.length > 0 ? (*/}
            {/*        comments.map(comment => (*/}
            {/*            <div key={comment.id} className="comment mb-3">*/}
            {/*                <div className="comment-meta text-muted mb-1">*/}
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
