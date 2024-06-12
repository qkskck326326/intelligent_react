import React, { useState, useEffect } from "react";
import {Pagination} from "react-bootstrap";
import { axiosClient } from "../../axiosApi/axiosClient";
import BoardSaveModal from "./BoardSaveModal";
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

const BoardList = () => {
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [size, setSize] = useState(10);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentData, setCurrentData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const fetchData = () => {
        axiosClient.get('/itNewsBoard', {params: {page: page, size: size}})
            .then(response => {
                const responseData = response.data;
                const dataArray = Array.isArray(responseData) ? responseData : [responseData];
                setData(dataArray);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = (newData) => {
        axiosClient.post('/itNewsBoard', newData)
            .then(() => {
                fetchData(); // 데이터 추가 후 목록을 다시 불러옴
                handleClose();
            })
            .catch(err => {
                setError(err);
            });
    };

    const handleDelete = (itNewsBoardDto) => {
        axiosClient.delete('/itNewsBoard', {data:itNewsBoardDto})
            .then(() => {
                fetchData(); // 데이터 삭제 후 목록을 다시 불러옴
            })
            .catch(err => {
                setError(err);
            });
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleShow = () => {
        setCurrentData(null);
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setCurrentData(item);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleClose = () => {
        setCurrentData(null);
        setIsEditing(false);
        setShowModal(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="container">
            <h1>Board List</h1>
            <BoardSaveModal show={showModal} handleClose={handleClose} handleSave={handleSave} initialData={currentData}/>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Link</th>
                    <th scope="col">수정 / 삭제</th>
                    <th scope="col">등록일</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={item.boardId}>
                        <th scope="row">{index + 1}</th>
                        <td onClick={() => router.push(`/itNewsBoard/${item.boardId}`)}>{item.title}</td>
                        <td>
                            <a href={item.siteUrl} className="btn btn-primary" target="_blank"
                               rel="noopener noreferrer">
                                원글이동
                            </a>
                        </td>
                        <td>
                            <button onClick={() => handleEdit(item)}>수정</button>
                            &nbsp;
                            <button onClick={() => handleDelete(item)}>삭제</button>
                        </td>
                        <td>
                            {formatDate(item.registDate)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Pagination style={{justifyContent: 'center'}}>
                <Pagination.First onClick={() => handlePageChange(0)} disabled={page === 0} />
                <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />
                {[...Array(Math.max(totalPages, 1))].map((_, i) => (
                    <Pagination.Item key={i} active={i === page} onClick={() => handlePageChange(i)}>
                        {i + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} />
                <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={page === totalPages - 1} />
            </Pagination>
        </div>
    );
}

export default BoardList;
