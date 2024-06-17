import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
    const maxPagesToShow = 10;
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
        // 총 페이지 수가 최대 페이지 수보다 적을 경우
        startPage = 1;
        endPage = totalPages;
    } else {
        // 총 페이지 수가 최대 페이지 수보다 클 경우
        const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
        const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
        if (currentPage <= maxPagesBeforeCurrentPage) {
            // 현재 페이지가 시작 페이지에 가까운 경우
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
            // 현재 페이지가 끝 페이지에 가까운 경우
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            // 현재 페이지가 중간에 있는 경우
            startPage = currentPage - maxPagesBeforeCurrentPage;
            endPage = currentPage + maxPagesAfterCurrentPage;
        }
    }

    let items = [];
    for (let i = startPage; i <= endPage; i++) {
        items.push(
            <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>
                {i}
            </Pagination.Item>
        );
    }

    return (
        <div className="d-flex justify-content-center">
            <Pagination>
                <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
                {items}
                <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
        </div>
    );
};


export default CustomPagination;
