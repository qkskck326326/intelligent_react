import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import PackageCategoryModal from './packageCategoryModal';
import ThumbnailModal from './thumbnailModal';
import styles from '../../styles/lecturePackage/lecturePackageRegister.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import authStore from "../../stores/authStore"; // Bootstrap CSS 추가

// 동적 import를 통해 TextEditor를 클라이언트에서만 로드
const TextEditor = dynamic(() => import('../CKEditor/textEditor'), { ssr: false });

const LecturePackageRegister = () => {
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [isThumbnailModalOpen, setThumbnailModalOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [editorData, setEditorData] = useState('');
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const [form, setForm] = useState({
        title: '',
        level: '',
        priceKind: '',
        price: ''
    });

    const handleCategoryClick = () => {
        setCategoryModalOpen(true);
    };

    const handleThumbnailClick = () => {
        setThumbnailModalOpen(true);
    };

    const closeCategoryModal = () => {
        setCategoryModalOpen(false);
    };

    const closeThumbnailModal = () => {
        setThumbnailModalOpen(false);
    };

    const handleConfirm = (categories) => {
        setSelectedCategories(categories);
        setCategoryModalOpen(false); // 모달을 닫음
    };

    const handleThumbnailSave = (preview) => {
        setThumbnailPreview(preview);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        const data = {
            nickname: authStore.nickname,
            title: form.title,
            content: editorData,
            packageLevel: form.level,
            priceKind: parseInt(form.priceKind),
            price: parseInt(form.price),
            thumbnail: thumbnailPreview,
            packageSubCategoryId: selectedCategories.map(category => category.id),
            packageTechStackId: []
        };

        try {
            const response = await axios.post('/packages', {prams :{ data : data} });
            if (response.status === 200) {
                alert('등록이 성공적으로 완료되었습니다.');

            }
        } catch (error) {
            console.error('등록 중 오류 발생:', error);
            alert('등록 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.lecturePackageRegister}>
            <h1>강의 패키지 등록</h1>
            <div className={styles.formSection}>
                <label htmlFor="title">제목</label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="강의 제목을 입력하세요"
                />
            </div>
            <div className={styles.formSection}>

                <div>
                    <input
                        type="radio"
                        id="beginner"
                        name="level"
                        value="입문"
                        checked={form.level === '입문'}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="beginner">입문</label>
                    <input
                        type="radio"
                        id="advanced"
                        name="level"
                        value="심화"
                        checked={form.level === '심화'}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="advanced">심화</label>
                </div>
            </div>
            <div className={styles.formSection}>
                <label htmlFor="priceKind">가격 종류</label>
                <select
                    id="priceKind"
                    name="priceKind"
                    value={form.priceKind}
                    onChange={handleInputChange}
                >
                    <option value="">선택</option>
                    <option value="0">월정액</option>
                    <option value="1">평생소장</option>
                </select>
                <label htmlFor="price">패키지 금액</label>
                <input
                    id="price"
                    name="price"
                    type="text"
                    value={form.price}
                    onChange={handleInputChange}
                    placeholder="금액을 입력하세요"
                />
            </div>
            <button className={styles.categoryButton} onClick={handleCategoryClick}>강의 카테고리 선택</button>
            <div className={styles.selectedCategories}>
                {selectedCategories.map(category => (
                    <span key={category.id} className={styles.selectedCategory}>{category.name}</span>
                ))}
            </div>
            <div className={styles.thumbnailPreview}>
                {thumbnailPreview ? (
                    <img src={thumbnailPreview} alt="썸네일 미리보기" className={styles.thumbnailImage} />
                ) : (
                    <p className={styles.placeholderText}>썸네일</p>
                )}
            </div>
            <button className={styles.thumbnailButton} onClick={handleThumbnailClick}>썸네일 등록</button>
            {isCategoryModalOpen && (
                <PackageCategoryModal
                    isOpen={isCategoryModalOpen}
                    onClose={closeCategoryModal}
                    onConfirm={handleConfirm}
                    selectedCategories={selectedCategories} // 선택된 카테고리를 전달
                />
            )}
            {isThumbnailModalOpen && (
                <ThumbnailModal
                    isOpen={isThumbnailModalOpen}
                    onClose={closeThumbnailModal}
                    onSave={handleThumbnailSave}
                />
            )}
            <TextEditor setEditorData={setEditorData} />
            <div style={{ display: 'flex' }}>
                <div className="ck ck-editor__main" style={{ width: '100%' }}>
                    <div
                        className="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred"
                        dangerouslySetInnerHTML={{ __html: editorData }} // 결과 확인
                    />
                </div>
            </div>
            <button className={styles.saveButton} onClick={handleSubmit}>등록하기</button>
        </div>
    );
};

export default LecturePackageRegister;