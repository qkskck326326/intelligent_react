import React, { useState, useEffect } from 'react';
import { axiosClient } from "../../axiosApi/axiosClient";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import styles from '../../styles/lecturePackage/categoryModal.module.css';

const PackageCategoryModal = ({ isOpen, onClose, onConfirm, selectedCategories }) => {
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        if (isOpen) {
            const fetchCategories = async () => {
                try {
                    const response = await axiosClient.get('/categories/sub'); // Spring Boot 엔드포인트 호출
                    setCategories(response.data);
                    setSelected(selectedCategories); // 여기서 설정
                } catch (error) {
                    console.error("Error fetching subcategories:", error);
                }
            };
            fetchCategories();
        }
    }, [isOpen, selectedCategories]);

    useEffect(() => {
        setSelected(selectedCategories);
    }, [selectedCategories]);

    const handleCategoryClick = (category) => {
        if (selected.some(cat => cat.id === category.id)) {
            setSelected(selected.filter(cat => cat.id !== category.id));
        } else {
            setSelected([...selected, category]);
        }
    };



    const handleConfirm = () => {
        onConfirm(selected);
        onClose();
    };

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>카테고리</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>강의에 해당하는 강의 카테고리를 선택해 주세요!!</p>
                <div className={styles.categoryContainer}>
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                            variant={selected.some(cat => cat.id === category.id) ? 'primary' : 'outline-primary'}
                            className="m-1"
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    취소
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                    확인
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PackageCategoryModal;