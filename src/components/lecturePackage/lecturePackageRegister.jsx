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


const CKEditorComponent = dynamic(() => import('../CKEditor/CKEditorComponent'), { ssr: false });

const LecturePackageRegister = observer(({ isEditMode, lecturePackageId, onBackListClick }) => {
    const router = useRouter();
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [isThumbnailModalOpen, setThumbnailModalOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [editorData, setEditorData] = useState('');
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [techStacks, setTechStacks] = useState([]);
    const [selectedTechStacks, setSelectedTechStacks] = useState([]);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff'); // 배경색 상태 추가
    const [learningPersons, setLearningPersons] = useState(['']); // 학습대상자 목록 상태 추가
    const [readyKnowledge, setReadyKnowledge] = useState(['']); // 선수 지식 목록 상태 추가

    const [form, setForm] = useState({
        title: '',
        level: '',
        priceForever: '',
        averageClassLength: '',
    });

    useEffect(() => {
        const fetchPackageData = async () => {
            if (isEditMode && lecturePackageId) {
                try {
                    const response = await axiosClient.get(`/packages/detail`, { params: { lecturePackageId } });
                    const packageData = response.data;
                    console.log("packageData : ", packageData);
                    setForm({
                        title: packageData.title || '',
                        level: packageData.packageLevel?.toString() || '',
                        priceForever: packageData.priceForever?.toString() || '',
                        averageClassLength: packageData.averageClassLength || '',
                    });
                    setEditorData(packageData.content || '');
                    setThumbnailPreview(packageData.thumbnail || '');

                    const subCategoryNames = packageData.subCategoryName.split(', ');
                    const subCategories = packageData.subCategoryId.map((id, index) => ({
                        id,
                        name: subCategoryNames[index]
                    }));
                    setSelectedCategories(subCategories);

                    const techStackPaths = packageData.techStackPath.split(', ');
                    const techStacks = packageData.techStackId.map((id, index) => ({
                        techStackId: id,
                        techStackPath: techStackPaths[index]
                    }));
                    setSelectedTechStacks(techStacks);
                    setBackgroundColor(packageData.backgroundColor || '#ffffff'); // 배경색 설정
                    // 학습대상자와 선수 지식을 배열로 설정
                    setLearningPersons(packageData.learningContent || ['']);
                    setReadyKnowledge(packageData.readyContent || ['']);
                } catch (error) {
                    console.error('패키지 데이터를 가져오는 중 오류 발생:', error);
                }
            }
        };

        fetchPackageData();
    }, [isEditMode, lecturePackageId]);

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

    useEffect(() => {
        setSelectedCategories(selectedCategories);
    }, [selectedCategories]);

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

    //기술스택
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
            learningContent: learningPersons.filter(person => person.trim() !== ''), // 배열로 전송
            readyContent: readyKnowledge.filter(knowledge => knowledge.trim() !== ''), // 배열로 전송
            content: editorData,
            averageClassLength: form.averageClassLength,
            packageLevel: form.level,
            priceForever: parseInt(form.priceForever),
            thumbnail: thumbnailPreview,
            packageSubCategoryId: selectedCategories.map(category => category.id),
            packageTechStackId: selectedTechStacks.map(stack => stack.techStackId),
            backgroundColor: backgroundColor // 배경색 추가
        };
        console.log("data : ", data);
        try {
            let response;
            if (isEditMode) {
                response = await axiosClient.put(`/packages?lecturePackageId=${lecturePackageId}`, data);
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

    //학습대상자
    const handleLearningPersonChange = (index, value) => {
        setLearningPersons(prev => {
            const newLearningPersons = [...prev];
            newLearningPersons[index] = value;
            return newLearningPersons;

        });
        console.log("learningPersons : ", learningPersons);
    };

    const addLearningPerson = () => {
        setLearningPersons(prev => [...prev, '']);
    };

    const removeLearningPerson = (index) => {
        setLearningPersons(prev => prev.filter((_, i) => i !== index));
    };

    // 선수 지식
    const handleReadyKnowledgeChange = (index, value) => {
        setReadyKnowledge(prev => {
            const newReadyKnowledge = [...prev];
            newReadyKnowledge[index] = value;
            return newReadyKnowledge;
        });
    };

    const addReadyKnowledge = () => {
        setReadyKnowledge(prev => [...prev, '']);
    };

    const removeReadyKnowledge = (index) => {
        setReadyKnowledge(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <body className={styles.body}>
        <div className={styles.lecturePackageRegister}>
            <h1 className={styles.h1Title}>{isEditMode ? '강의 패키지 수정' : '강의 패키지 등록'}</h1>
            <div className={styles.horizontalLine}></div>
            <div className={styles.thumbnailPreview}>
                {thumbnailPreview ? (
                    <img src={thumbnailPreview} alt="썸네일 미리보기" className={styles.thumbnailImage}/>
                ) : (
                    <p className={styles.placeholderText}>썸네일</p>
                )}
            </div>
            <button className={styles.thumbnailButton} onClick={handleThumbnailClick}>썸네일 등록</button>
            {isThumbnailModalOpen && (
                <ThumbnailModal
                    isOpen={isThumbnailModalOpen}
                    onClose={closeThumbnailModal}
                    onSave={handleThumbnailSave}
                />
            )}
            <div className={styles.formSection}>
                <label htmlFor="title" className={styles.title}>⊙ 제목</label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="강의 제목을 입력하세요"
                    className={styles.titleInput}

                />
            </div>
            <div className={styles.formSection}>
                <label htmlFor="learningPerson" className={styles.learning}>⊙ 학습대상자</label>
                <button type="button" className={styles.addButton} onClick={addLearningPerson}>+ 추가</button>
                {learningPersons.map((person, index) => (
                    <div key={index} className={styles.learningPersonRow}>
                        <input
                            id={`learningPerson-${index}`}
                            name="learningPerson"
                            type="text"
                            value={person}
                            onChange={(e) => handleLearningPersonChange(index, e.target.value)}
                            placeholder="학습대상자를 입력하세요"
                            className={styles.learningInput}
                        />
                        <button type="button" onClick={() => removeLearningPerson(index)}>삭제</button>
                    </div>
                ))}

            </div>

            <div className={styles.formSection}>
                <label htmlFor="readyKnowledge" className={styles.ready}>⊙ 선수 지식</label>
                <button type="button" className={styles.addButton} onClick={addReadyKnowledge}>+ 추가</button>
                {readyKnowledge.map((knowledge, index) => (
                    <div key={index} className={styles.readyKnowledgeRow}>
                        <input
                            id={`readyKnowledge-${index}`}
                            name="readyKnowledge"
                            type="text"
                            value={knowledge}
                            onChange={(e) => handleReadyKnowledgeChange(index, e.target.value)}
                            placeholder="선수 지식을 입력하세요"
                            className={styles.readyInput}
                        />
                        <button type="button" onClick={() => removeReadyKnowledge(index)}>삭제</button>
                    </div>
                ))}

            </div>
            <div className={styles.horizontalLine}></div>


            <div className={styles.formSection}>
                <div>
                    <div className={styles.levelText}> ※ 패키지에 해당하는 레벨을 선택해주세요!</div>
                    <input
                        type="radio"
                        id="beginner"
                        name="level"
                        value={0}
                        checked={form.level === '0'}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="beginner" className={styles.radius}>입문</label>
                    <input
                        type="radio"
                        id="default"
                        name="level"
                        value={1}
                        checked={form.level === '1'}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="basic" className={styles.radius}>기본</label>
                    <input
                        type="radio"
                        id="advanced"
                        name="level"
                        value={2}
                        checked={form.level === '2'}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="advanced" className={styles.radius}>심화</label>
                </div>
            </div>
            <div className={styles.formSection}>
                <div>
                    <label htmlFor="priceForever" className={styles.priceText}>⊙ 평생소장 금액</label>
                    <input
                        id="priceForever"
                        name="priceForever"
                        type="text"
                        value={form.priceForever}
                        onChange={handleInputChange}
                        placeholder="금액을 입력하세요"
                        className={styles.priceInput}
                    />
                </div>
            </div>
            <div className={styles.formSection}>
                <div>
                    <label htmlFor="averageClassLength" className={styles.averageText}>⊙ 평균 수강기한</label>
                    <input
                        id="averageClassLength"
                        name="averageClassLength"
                        type="text"
                        value={form.averageClassLength}
                        onChange={handleInputChange}
                        placeholder="평균 수강기한"
                        className={styles.averageInput}
                    />
                </div>
            </div>
            <div className={styles.horizontalLine}></div>
            <div className={styles.categoryBox}>
                <button className={styles.categoryButton} onClick={handleCategoryClick}>강의 카테고리 선택</button>
                <span className={styles.categoryText}>※ 패키지에 해당하는 카테고리를 선택해주세요!</span>
                <div className={styles.selectedCategories}>
                    {selectedCategories.map(category => (
                        <span key={category.id} className={styles.selectedCategory}>{category.name}</span>
                    ))}
                </div>
            </div>

            {isCategoryModalOpen && (
                <PackageCategoryModal
                    isOpen={isCategoryModalOpen}
                    onClose={closeCategoryModal}
                    onConfirm={handleConfirm}
                    selectedCategories={selectedCategories}
                />
            )}

            <div className={styles.horizontalLine}></div>

            <div className={styles.toolText}>⊙ 사용될 프로그래밍 tool</div>
            <div className={styles.toolText2}>※ 강의에서 사용될 tool을 드래그로 선택해주세요!</div>
            <DndProvider backend={HTML5Backend}>
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
            </DndProvider>
            <div style={{fontSize: '13px', fontWeight: "bold", marginLeft: 30}}>&lt; ※ 다른 기술스택이 필요할 경우에는 '채팅 → 문의하기'를
                이용해 주세요.&gt;</div>
            <div className={styles.horizontalLine}></div>

            <div className={styles.formSection}>
                <label htmlFor="backgroundColor">배경색</label>
                <input
                    type="color"
                    id="backgroundColor"
                    name="backgroundColor"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                />
            </div>
            <CKEditorComponent data={editorData} onChange={setEditorData}/>
            <button className={styles.saveButton} onClick={handleSubmit}>{isEditMode ? '수정하기' : '등록하기'}</button>
            {isEditMode ? (
                <button className={styles.actionButton}
                        onClick={() => router.push(`/lecturePackage/${lecturePackageId}`)}>상세보기</button>
            ) : (
                <button className={styles.actionButton} onClick={onBackListClick}>리스트목록으로 이동</button>
            )}
        </div>
        </body>
    );
});

export default LecturePackageRegister;