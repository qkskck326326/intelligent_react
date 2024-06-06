import React, { useState, useEffect } from "react";
import CertificateCard from "./certificateCard ";
import Pagination from "../common/pagination";
import CertificateAddModal from "./certificateAddModal";
import styles from "../../styles/myCertificate.module.css";

const MyCertificate = ({ nickname }) => {
  const [certificates, setCertificates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (nickname) {
      fetchCertificates(currentPage, nickname);
    }
  }, [currentPage, nickname]);

  const fetchCertificates = async (page, nickname) => {
    try {
      const res = await fetch(
          `/certificates?nickname=${nickname}&page=${page}&size=10`
      );
      const data = await res.json();
      setCertificates(data);
      setTotalPages(Math.ceil(data.length / 10));
    } catch (error) {
      console.error("Error fetching certificates", error);
    }
  };

  const handleSave = async (newCertificate) => {
    try {
      const res = await fetch(`/certificates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCertificate),
      });
      if (res.ok) {
        fetchCertificates(currentPage, nickname); // 추가 후 자격증 목록을 다시 가져옵니다.
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
      await fetch(`/certificates/${id}`, {
        method: "DELETE",
      });
      fetchCertificates(currentPage, nickname); // 삭제 후 현재 페이지의 데이터를 다시 가져옵니다.
    } catch (error) {
      console.error("Error deleting certificate", error);
    }
  };

  return (
      <div className={styles.container}>
        <button
            className={styles["add-button"]}
            onClick={() => setIsModalOpen(true)}
        >
          + 추가
        </button>
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