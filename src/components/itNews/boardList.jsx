import React, { useState, useEffect } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import BoardSaveModal from "./BoardSaveModal";
import { useRouter } from 'next/router';
import CustomPagination from "../common/customPagenation";
import {observer} from "mobx-react";
import authStore from "../../stores/authStore";
import styles from '/src/styles/itNewsBoard/itNewsBoardListCSS.module.css'

const BoardList = observer(() => {
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
        return `${year}년${month}월${day}일`;
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

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSizeChange = (event) => {
        setSize(Number(event.target.value));
        setPage(1);
    };



    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.container}>
            <div className={`${styles['mb-3']} ${styles['d-flex']} ${styles['align-items-center']}`}>
                <select className={styles['form-select']} value={size} onChange={handleSizeChange}>
                    <option value="5">5개씩 보기</option>
                    <option value="10">10개씩 보기</option>
                    <option value="15">15개씩 보기</option>
                    <option value="20">20개씩 보기</option>
                </select>
                <input
                    type="text"
                    className={`${styles['form-control']} ${styles['me-sm-1']}`}
                    placeholder="제목으로 검색"
                    value={isSearch}
                    onChange={(e) => setIsSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className={`${styles['btn']} ${styles['btn-primary']}`} onClick={handleSearch}>검색</button>
            </div>
            <p>총 {totalElements} 개의 결과</p>
            <BoardSaveModal show={showModal} handleClose={handleClose} handleSave={handleSave} initialData={currentData} />
            <table className={styles.table}>
                <thead>
                <tr>
                    <th scope="col" className={styles['text-center']} style={{ width: '40px' }}>#</th>
                    <th scope="col" className={styles['text-center']}>제목</th>
                    <th scope="col" className={styles['text-center']} style={{ width: '130px' }}>링크</th>
                    {authStore.checkIsAdmin() === true ? (
                        <th scope="col" className={styles['text-center']} style={{ width: '100px' }}>삭제</th>
                    ) : null}
                    <th scope="col" className={styles['text-center']} style={{ width: '100px' }}>등록일</th>
                </tr>
                </thead>
                <tbody>
                {isSearch !== "" && data.length === 0 ? (
                    <tr>
                        <td colSpan="5" className={styles['text-center']}>검색 결과가 없습니다.</td>
                    </tr>
                ) : (
                    data.map((item, index) => (
                        <tr key={item.boardId}>
                            <th scope="row" className={styles['text-center']}>{index + 1}</th>
                            <td
                                onClick={() => router.push(`/itNewsBoard/${item.boardId}`)}
                                className={styles['text-center']}
                                style={{ transition: 'background-color 0.3s' }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = ''}
                            >
                                {item.title}
                            </td>
                            <td className={styles['text-center']}>
                                <a href={item.boardUrl} className={`${styles['btn']} ${styles['btn-primary']}`} target="_blank" rel="noopener noreferrer">
                                    원글이동
                                </a>
                            </td>
                            {authStore.checkIsAdmin() === true ? (
                                <td className={styles['text-center']}>
                                    <button className={`${styles['btn']} ${styles['btn-delete']}`} onClick={() => handleDelete(item)}>삭제</button>
                                </td>
                            ) : null}
                            <td className={styles['resist-date']}>{formatDate(item.registDate)}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
            <br/>
            <CustomPagination align="center" currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    );
});

export default BoardList;
