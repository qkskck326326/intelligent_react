import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../axiosApi/axiosClient';
import SiteSaveModal from "./siteSaveModal";
import { Button, Pagination } from 'react-bootstrap';
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

    const fetchData = () => {
        axiosClient.get('/itNewsSite', {params: {page: page, size: size}})
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

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = (itNewsSiteDto) => {
        axiosClient.delete('/itNewsSite', {data:itNewsSiteDto})
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
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setCurrentData(item);
        setShowModal(true);
    };

    const handleSave = (newData) => {
        axiosClient.post('/itNewsSite', newData)
            .then(() => {
                fetchData(); // 데이터 추가 후 목록을 다시 불러옴
                handleClose();
            })
            .catch(err => {
                setError(err);
            });
    };

    const handleClose = () => {
        setCurrentData(null);
        setShowModal(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="container">
            <h1>Board List</h1>
            <Button variant="primary" onClick={handleShow} className="mb-3">
                작성하기
            </Button>
            <SiteSaveModal show={showModal} handleClose={handleClose} handleSave={handleSave} initialData={currentData}/>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Site URL</th>
                    <th scope="col">Latest Board URL</th>
                    <th scope="col">Site Name</th>
                    <th scope="col">Video Element</th>
                    <th scope="col">Title Element</th>
                    <th scope="col">Context Element</th>
                    <th scope="col">수정 / 삭제</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.siteUrl}</td>
                        <td>{item.latestBoardUrl}</td>
                        <td>{item.siteName}</td>
                        <td>{item.videoElement}</td>
                        <td>{item.titleElement}</td>
                        <td>{item.contextElement}</td>
                        <td>
                            <button onClick={() => handleEdit(item)}>수정</button> &nbsp;
                            {/*<button onClick={() => handleDelete(item)}>삭제</button>*/}
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
