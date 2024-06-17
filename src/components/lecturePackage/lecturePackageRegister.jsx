import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { axiosClient } from "../../axiosApi/axiosClient";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRouter } from 'next/router';
import PackageCategoryModal from './packageCategoryModal';
import ThumbnailModal from './thumbnailModal';
import { TechStack, DropZone } from './techStack';
import styles from '../../styles/lecturePackage/lecturePackageRegister.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import authStore from "../../stores/authStore";
import { observer } from "mobx-react";

const TextEditor = dynamic(() => import('../CKEditor/textEditor'), { ssr: false });

const LecturePackageRegister = observer(({ isEditMode, packageData, onBackListClick }) => {
    const router = useRouter();
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [isThumbnailModalOpen, setThumbnailModalOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [editorData, setEditorData] = useState('');
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [techStacks, setTechStacks] = useState([]);
    const [selectedTechStacks, setSelectedTechStacks] = useState([]);

    const [form, setForm] = useState({
        title: '',
        level: '',
        priceKind: '',
        price: ''
    });

    useEffect(() => {
        if (isEditMode && packageData) {
            console.log('packageData:', packageData);
            setForm({
                title: packageData.title || '',
                level: packageData.packageLevel || '',
                priceKind: packageData.priceKind?.toString() || '',
                price: packageData.price?.toString() || ''
            });
            setEditorData(packageData.content || '');
            setThumbnailPreview(packageData.thumbnail || '');
            setSelectedCategories(packageData.packageSubCategoryId?.map(id => ({ id })) || []);
            setSelectedTechStacks(packageData.packageTechStackId?.map(id => ({ techStackId: id })) || []);
        }
    }, [isEditMode, packageData]);

    useEffect(() => {
        const fetchTechStacks = async () => {
            try {
                const response = await axiosClient.get('/techstacks');
                setTechStacks(response.data);
            } catch (error) {
                console.error('기술 스택 데이터를 가져오는 중 오류 발생:', error);
            }
        };

        fetchTechStacks();
    }, []);

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
        setCategoryModalOpen(false);
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

    const handleDrop = (item) => {
        if (!selectedTechStacks.some(stack => stack.techStackId === item.techStackId)) {
            setSelectedTechStacks((prev) => [...prev, item]);
        }
    };

    const handleRemove = (id) => {
        setSelectedTechStacks(selectedTechStacks.filter(stack => stack.techStackId !== id));
    };

    const handleSubmit = async () => {
        const nickname = authStore.getNickname();
        const data = {
            nickname: nickname,
            title: form.title,
            content: editorData,
            packageLevel: form.level,
            priceKind: parseInt(form.priceKind),
            price: parseInt(form.price),
            thumbnail: thumbnailPreview,
            packageSubCategoryId: selectedCategories.map(category => category.id),
            packageTechStackId: selectedTechStacks.map(stack => stack.techStackId)
        };
        console.log("data : ", data);
        try {
            let response;
            if (isEditMode) {
                response = await axiosClient.put(`/packages?lecturePackageId=${packageData.lecturePackageId}`, data);
            } else {
                response = await axiosClient.post('/packages', data);
            }

            if (response.status === 200) {
                alert(isEditMode ? '수정이 완료되었습니다.' : '등록이 성공적으로 완료되었습니다.');
                const { lecturePackageId } = response.data;
                router.push(`/lecturePackage/${lecturePackageId}`);
            }
        } catch (error) {
            console.error(isEditMode ? '수정 중 오류 발생:' : '등록 중 오류 발생:', error);
            alert(isEditMode ? '수정 중 오류가 발생했습니다.' : '등록 중 오류가 발생했습니다.');
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={styles.lecturePackageRegister}>
                <h1>{isEditMode ? '강의 패키지 수정' : '강의 패키지 등록'}</h1>
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
                        <img src={thumbnailPreview} alt="썸네일 미리보기" className={styles.thumbnailImage}/>
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
                        selectedCategories={selectedCategories}
                    />
                )}
                {isThumbnailModalOpen && (
                    <ThumbnailModal
                        isOpen={isThumbnailModalOpen}
                        onClose={closeThumbnailModal}
                        onSave={handleThumbnailSave}
                    />
                )}

                <div className={styles.techStackSection}>
                    <div className={styles.techStacks}>
                        {techStacks.map(stack => (
                            <TechStack key={stack.techStackId} stack={stack}/>
                        ))}
                    </div>
                </div>
                <div className={styles.selectedTechStacks}>
                    <DropZone onDrop={handleDrop} selectedStacks={selectedTechStacks} onRemove={handleRemove}/>
                </div>

                <TextEditor setEditorData={setEditorData} initialData={editorData} />
                <button className={styles.saveButton} onClick={handleSubmit}>{isEditMode ? '수정하기' : '등록하기'}</button>
                {isEditMode ? (
                    <button className={styles.actionButton}
                            onClick={() => router.push(`/lecturePackage/${packageData.lecturePackageId}`)}>상세보기</button>
                ) : (
                    <button className={styles.actionButton} onClick={onBackListClick}>리스트목록으로 이동</button>
                )}
            </div>
        </DndProvider>
    );
});

export default LecturePackageRegister;