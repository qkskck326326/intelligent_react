import React from "react";
import styles from "../../styles/myCertificate.module.css";

const CertificateCard = ({ certificate, onDelete }) => (
    <div className={styles.card}>
        <div className={styles["card-content"]}>
            <span className={styles["card-title"]}>{certificate.kind}</span>
            <span className={styles["card-date"]}>
        {new Date(certificate.passDate).toLocaleDateString()}
      </span>
            <span>{certificate.issuePlace}</span>
        </div>
        <div className={styles["card-actions"]}>
            <button onClick={() => onDelete(certificate.certificateNumber)}>🗑️</button>
        </div>
    </div>
);

export default CertificateCard;