import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../axiosApi/axiosClient';
import SiteInsertModal from "./siteInsertModal";
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const BoardList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentData, setCurrentData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        axiosClient.get('/itNewsSite')
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
    }, []);

    const handleSave = (newData) => {
        axiosClient.post('/itNewsSite', newData)
            .then(response => {
                setData([...data, response.data]);
            })
            .catch(err => {
                setError(err);
            });
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
            <Button variant="primary" onClick={handleShow} className="mb-3">
                작성하기
            </Button>
            <SiteInsertModal show={showModal} handleClose={handleClose} handleSave={handleSave} initialData={currentData}/>
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
                            <button>삭제</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default BoardList;
