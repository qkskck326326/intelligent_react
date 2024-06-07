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

  const fetchCertificates = async (page, nickname) => {
    try {
      const res = await fetch(
          `/certificates?nickname=${nickname}&page=${page}&size=10`
      );
      const data = await res.json();
      setCertificates(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching certificates", error);
    }
  };

  useEffect(() => {
    if (nickname) {
      fetchCertificates(currentPage, nickname);
    }
  }, [currentPage, nickname]);

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
      await fetch(`/certificates/${id}`, {
        method: "DELETE",
      });
      fetchCertificates(currentPage, nickname);
    } catch (error) {
      console.error("Error deleting certificate", error);
    }
  };

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