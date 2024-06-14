import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import styles from '../../styles/lecturePackage/thumbnailModal.module.css';

const ThumbnailModal = ({ isOpen, onClose, onSave }) => {
    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!thumbnail) {
            setPreview(null);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(thumbnail);
    }, [thumbnail]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setThumbnail(file);
        }
    };

    const handleSave = () => {
        onSave(preview);
        onClose();
    };

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>썸네일 등록</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={styles.thumbnailPreview}>
                    {preview ? (
                        <img src={preview} alt="썸네일 미리보기" className={styles.previewImage} />
                    ) : (
                        <p className={styles.placeholderText}>이미지 미리보기</p>
                    )}
                </div>
                <div className="mt-3">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="form-control"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    취소
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    등록
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ThumbnailModal;