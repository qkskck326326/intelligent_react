import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import BoardSaveModal from "./BoardSaveModal";
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomPagination from "../common/customPagenation";

const BoardList = () => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [size, setSize] = useState(10);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentData, setCurrentData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSearch, setIsSearch] = useState("");
    const router = useRouter();
    const [totalElements, setTotalElements] = useState(0);

    const fetchData = () => {
        let url = "/itNewsBoard";
        const params = { page: page - 1, size: size };
        if (isSearch !== "") {
            url += "/search/" + isSearch;
        }
        axiosClient.get(url, { params })
            .then(response => {
                const responseData = response.data.content || response.data;
                setData(responseData);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements)
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
    }, [page, size]);

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
        axiosClient.delete('/itNewsBoard', { data: itNewsBoardDto })
            .then(() => {
                fetchData();
            })
            .catch(err => {
                setError(err);
            });
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
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

    const handleSearch = () => {
        setPage(1);
        fetchData();
    };

    const handleSizeChange = (event) => {
        setSize(Number(event.target.value));
        setPage(1);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="container">
            <div className="mb-3 d-flex align-items-center">
                <select className="form-select" style={{width: '135px'}} value={size} onChange={handleSizeChange}>
                    <option value="5">5개씩 보기</option>
                    <option value="10">10개씩 보기</option>
                    <option value="15">15개씩 보기</option>
                    <option value="20">20개씩 보기</option>
                </select>
                <input
                    type="text"
                    className="form-control me-sm-1"
                    style={{width: '300px'}}
                    placeholder="검색어를 입력하세요"
                    value={isSearch}
                    onChange={(e) => setIsSearch(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSearch}>검색</button>


            </div>
            <p>총 {totalElements} 개의 결과</p>
            <BoardSaveModal show={showModal} handleClose={handleClose} handleSave={handleSave}
                            initialData={currentData}/>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col" className="text-center">#</th>
                    <th scope="col" className="text-center">제목</th>
                    <th scope="col" className="text-center" style={{width: '120px'}}>링크</th>
                    <th scope="col" className="text-center" style={{width: '150px'}}>수정 / 삭제</th>
                    <th scope="col" className="text-center" style={{width: '100px'}}>등록일</th>
                </tr>
                </thead>
                <tbody>
                {isSearch !== "" && data.length === 0 ? (
                    <tr>
                        <td colSpan="5" className="text-center">검색 결과가 없습니다.</td>
                    </tr>
                ) : (
                    data.map((item, index) => (
                        <tr key={item.boardId}>
                            <th scope="row" className="text-center">{index + 1}</th>
                            <td onClick={() => router.push(`/itNewsBoard/${item.boardId}`)}
                                className="text-center" style={{transition: 'background-color 0.3s'}}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = ''}>{item.title}</td>
                            <td className="text-center">
                                <a href={item.siteUrl} className="btn btn-primary" target="_blank"
                                   rel="noopener noreferrer">
                                    원글이동
                                </a>
                            </td>
                            <td className="text-center">
                                <button className="btn btn-secondary" onClick={() => handleEdit(item)}>수정</button>
                                &nbsp;
                                <button className="btn btn-danger" onClick={() => handleDelete(item)}>삭제</button>
                            </td>
                            <td className="text-center">{formatDate(item.registDate)}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
            <CustomPagination align="center" currentPage={page} totalPages={totalPages}
                              onPageChange={handlePageChange}/>
        </div>
    );
}

export default BoardList;
