import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../axiosApi/axiosClient';
import SiteSaveModal from "./siteSaveModal";
import { Button, Pagination } from 'react-bootstrap';
import axios from "axios";

const SiteList = () => {
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [size, setSize] = useState(10);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentData, setCurrentData] = useState(null);
    const [isSearch, setIsSearch] = useState("");

    const fetchData = () => {
        let url = "/itNewsSite";
        const params = { page: page - 1, size: size };
        if (isSearch !== "") {
            url += "/search/" + isSearch;
        }
        axiosClient.get(url, {params})
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

    const doCrowling = () => {
        axios.get("http://localhost:5000/crowling")
    }

    const handleSearch = () => {
        setPage(1);
        fetchData();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSizeChange = (event) => {
        setSize(Number(event.target.value));
        setPage(1);
    };

    return (
        <div className="container">
            <h1>Board List</h1>
            <Button variant="btn btn-primary" onClick={handleShow} className="mb-3">
                작성하기
            </Button> &nbsp;
            <Button variant="btn btn-secondary" className="mb-3" onClick={doCrowling}>크롤링 요청</Button>
            <SiteSaveModal show={showModal} handleClose={handleClose} handleSave={handleSave}
                           initialData={currentData}/>
            <div className="mb-3 d-flex align-items-center">
                <select className="form-select" style={{width: '135px', height: '38px'}} value={size} onChange={handleSizeChange}>
                    <option value="5">5개씩 보기</option>
                    <option value="10">10개씩 보기</option>
                    <option value="15">15개씩 보기</option>
                    <option value="20">20개씩 보기</option>
                </select>
                <input
                    type="text"
                    className="form-control me-sm-1"
                    style={{width: '300px'}}
                    placeholder="site name으로 검색"
                    value={isSearch}
                    onChange={(e) => setIsSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="btn btn-primary" onClick={handleSearch}>검색</button>
            </div>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Site URL</th>
                    <th scope="col">Latest Board URL</th>
                    <th scope="col">Site Name</th>
                    <th scope="col">Title Element</th>
                    <th scope="col">Context Element</th>
                    <th scope="col" style={{width: '500px'}}> 수정 / 삭제</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.siteUrl}</td>
                        <td>{item.latestBoardUrl}</td>
                        <td>{item.siteName}</td>
                        <td>{item.titleElement}</td>
                        <td>{item.contextElement}</td>
                        <td style={{justifyContent: 'center'}}>
                            <button onClick={() => handleEdit(item)}>수정</button>
                            &nbsp;
                            <button onClick={() => handleDelete(item)}>삭제</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Pagination style={{justifyContent: 'center'}}>
                <Pagination.First onClick={() => handlePageChange(0)} disabled={page === 0}/>
                <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0}/>
                {[...Array(Math.max(totalPages, 1))].map((_, i) => (
                    <Pagination.Item key={i} active={i === page} onClick={() => handlePageChange(i)}>
                        {i + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1}/>
                <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={page === totalPages - 1}/>
            </Pagination>
        </div>
    );
}

export default SiteList;
