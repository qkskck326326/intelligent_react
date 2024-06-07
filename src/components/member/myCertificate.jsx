import React, { useState, useEffect } from "react";
import CertificateCard from "./CertificateCard";
import Pagination from "../common/Pagination";
import CertificateAddModal from "./CertificateAddModal";
import styles from "../../styles/myCertificate.module.css";
import { axiosClient } from "../../axiosApi/axiosClient";

const MyCertificate = ({ nickname }) => {
  const [certificates, setCertificates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCertificates = async (page, nickname) => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/certificates?nickname=${nickname}&page=${page}&size=10`);
      const data = res.data;
      setCertificates(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nickname) {
      fetchCertificates(currentPage, nickname);
    }
  }, [currentPage, nickname]);

  const handleSave = async (newCertificate) => {
    try {
      const res = await axiosClient.post('/certificates', newCertificate);
      if (res.status === 200 || res.status === 201) {
        fetchCertificates(currentPage, nickname);
        setIsModalOpen(false);
      } else {
        console.error("Failed to add certificate");
      }
    } catch (error) {
      console.error("Error adding certificate", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/certificates/${id}`);
      fetchCertificates(currentPage, nickname);
    } catch (error) {
      console.error("Error deleting certificate", error);
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
        {certificates.map((certificate) => (
            <CertificateCard
                key={certificate.certificateNumber}
                certificate={certificate}
                onDelete={handleDelete}
            />
        ))}
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
        {isModalOpen && (
            <CertificateAddModal
                onSave={handleSave}
                onClose={() => setIsModalOpen(false)}
            />
        )}
      </div>
  );
};

export default MyCertificate;
