import React, { useState } from "react";
import styles from "../../styles/addModal.module.css";

const CertificateAddModal = ({ onSave, onClose }) => {
  const [form, setForm] = useState({
    pdfFile: "",
    kind: "",
    passDate: "",
    issuePlace: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <div className={styles.modal}>
      <div className={styles["modal-content"]}>
        <h2>자격증 추가</h2>
        <input
          type="text"
          name="pdfFile"
          value={form.pdfFile}
          onChange={handleChange}
          placeholder="PDF 파일 경로"
        />
        <input
          type="text"
          name="kind"
          value={form.kind}
          onChange={handleChange}
          placeholder="종목"
        />
        <input
          type="date"
          name="passDate"
          value={form.passDate}
          onChange={handleChange}
        />
        <input
          type="text"
          name="issuePlace"
          value={form.issuePlace}
          onChange={handleChange}
          placeholder="발행처"
        />
        <div className={styles["modal-actions"]}>
          <button onClick={handleSave}>저장</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default CertificateAddModal;
