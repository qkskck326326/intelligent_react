import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import CertificateAddModal from "./CertificateAddModal";
import styles from "../../styles/myCertificate.module.css";
import { axiosClient } from "../../axiosApi/axiosClient";
import {authStore} from "../../stores/authStore";
import {observer} from "mobx-react";

const MyCertificate = observer(() => {
  const [certificates, setCertificates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);





  const ITEMS_PER_PAGE = 10;  // 페이지당 보이는 데이터 개수

  const fetchCertificates = async (nickname) => {
    setLoading(true);
    try {
      axiosClient.get('/certificates', { params: { nickname: nickname } })
          .then(response => {
            const responseData = response.data;
            const dataArray = Array.isArray(responseData) ? responseData : [responseData];
            setCertificates(dataArray);
            setLoading(false);
          })
          .catch(err => {
            setError(err);
            setLoading(false);
          });
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {

      fetchCertificates(authStore.getNickname());

  }, []);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(certificates.length / ITEMS_PER_PAGE);

  // 현재 페이지에 해당하는 데이터 추출
  const currentData = certificates.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
  );

  // 페이징의 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSave = async (newCertificate) => {
    const certificateToSave = {
      ...newCertificate,
      nickname
    };


    try {
      const res = await axiosClient.post('/certificates', certificateToSave);
      if (res.status === 200 || res.status === 201) {
        fetchCertificates(nickname);
        setIsModalOpen(false);
      } else {
        console.error("Failed to add certificate");
      }
    } catch (error) {
      console.error("Error adding certificate", error);
    }
  };

  const handleDelete = async (certificateNumber) => {
    try {
      axiosClient.delete(`/certificates/${certificateNumber}`)
          .then(response => {
            fetchCertificates(nickname);
            setLoading(false);
          })

          .catch(err => {
            setError(err);
            setLoading(false);
          });
    } catch (error) {
      setError("Error deleting certificate", error);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>자격증</span>
          <button
              className={styles["add-button"]}
              onClick={() => setIsModalOpen(true)}
          >
            + 추가
          </button>
        </div>
        <div className={styles.list}>
          <table className={styles.table}>
            <thead>
            <tr>
              <th>자격증 번호</th>
              <th>종류</th>
              <th>취득일</th>
              <th>발행처</th>
              <th>액션</th>
            </tr>
            </thead>
            <tbody>
            {currentData.map((item, index) => (
                <tr key={index}>
                  <td>{item.certificateNumber}</td>
                  <td>{item.kind}</td>
                  <td>{item.passDate}</td>
                  <td>{item.issuePlace}</td>
                  <td>
                    <button onClick={() => handleDelete(item.certificateNumber)} className={styles.deleteButton}>🗑️</button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
        {isModalOpen && (
            <CertificateAddModal
                onSave={handleSave}
                onClose={() => setIsModalOpen(false)}
            />
        )}
      </div>
  );
});

export default MyCertificate;