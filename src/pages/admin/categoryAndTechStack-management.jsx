import React, { useEffect, useState } from 'react';
import { axiosClient } from "../../axiosApi/axiosClient";
import { TechStackUpload } from '../../components/admin/techStackUpload'; // 추가된 라인
import styles from '../../styles/admin/categoryAndTechStack-management.module.css';
import Sidebar from '../../components/admin/Sidebar';

const CategoryAndTechStackManagement = () => {
    const [topCategories, setTopCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [techStack, setTechStack] = useState([]);
    const [selectedTopCategory, setSelectedTopCategory] = useState('');
    const [newTopCategory, setNewTopCategory] = useState('');
    const [newSubCategory, setNewSubCategory] = useState('');
    const [newTechStack, setNewTechStack] = useState('');
    const [newTechStackImage, setNewTechStackImage] = useState(null);

    useEffect(() => {
        const fetchTopCategories = async () => {
            try {
                const response = await axiosClient.get('/categories/upper');
                setTopCategories(response.data);
            } catch (error) {
                console.error('상위 카테고리 가져오기 실패:', error);
            }
        };

        const fetchSubCategories = async () => {
            try {
                const response = await axiosClient.get('/categories/sub');
                setSubCategories(response.data);
            } catch (error) {
                console.error('하위 카테고리 가져오기 실패:', error);
            }
        };

        const fetchTechStack = async () => {
            try {
                const response = await axiosClient.get('/techstacks');
                setTechStack(response.data);
            } catch (error) {
                console.error('기술 스택 가져오기 실패:', error);
            }
        };

        fetchTopCategories();
        fetchSubCategories();
        fetchTechStack();
    }, []);

    const handleAddTopCategory = async () => {
        try {
            const response = await axiosClient.post('/categories/insertUpper', { name: newTopCategory });
            setTopCategories([...topCategories, response.data]);
            setNewTopCategory('');
        } catch (error) {
            console.error('상위 카테고리 추가 실패:', error);
        }
    };

    const handleAddSubCategory = async (upperCategoryId) => {
        if (!upperCategoryId) {
            console.error('상위 카테고리가 선택되지 않았습니다.');
            return;
        }

        console.log("newSubCategory : ", newSubCategory);
        console.log("{ id: upperCategoryId } : ", { id: upperCategoryId });
        try {
            const response = await axiosClient.post('/categories/insertSub', {
                name: newSubCategory,
                upperCategory: { id: upperCategoryId }
            });
            setSubCategories([...subCategories, response.data]);
            setNewSubCategory('');
        } catch (error) {
            console.error('서브 카테고리 추가에 실패했습니다:', error);
        }
    };

    const handleAddTechStack = async () => {
        if (!newTechStack || !newTechStackImage) {
            console.error('기술 스택 명과 이미지를 모두 입력해주세요.');
            return;
        }

        try {
            console.log("newTechStackImage : ", newTechStackImage);
            const imageUrl = await TechStackUpload(newTechStackImage); // AWS S3에 이미지 업로드
            const response = await axiosClient.post('/techstacks', {
                techStackName: newTechStack,
                techStackPath: imageUrl
            });
            setTechStack([...techStack, response.data]);
            setNewTechStack('');
            setNewTechStackImage(null);
        } catch (error) {
            console.error('기술 스택 추가 실패:', error);
        }
    };

    const handleDeleteTopCategory = async (topCategoryId) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            try {
                await axiosClient.delete('/categories/deleteUpper', { params: { upperCategoryId: topCategoryId } });
                setTopCategories(topCategories.filter(category => category.id !== topCategoryId));
            } catch (error) {
                console.error('상위 카테고리 삭제 실패:', error);
            }
        }
    };

    const handleDeleteSubCategory = async (subCategoryId) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            try {
                await axiosClient.delete('/categories/deleteSub', { params: { subCategoryId: subCategoryId } });
                setSubCategories(subCategories.filter(category => category.id !== subCategoryId));
            } catch (error) {
                console.error('하위 카테고리 삭제 실패:', error);
            }
        }
    };

    const handleDeleteTechStack = async (techStackId) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            try {
                await axiosClient.delete('/techstacks', { params: { techStackId: techStackId } });
                const updatedTechStack = techStack.filter(stack => stack.techStackId !== techStackId);
                setTechStack(updatedTechStack); // 상태 업데이트
                console.log("Updated techStack:", updatedTechStack);
            } catch (error) {
                console.error('기술 스택 삭제 실패:', error);
            }
        }
    };


    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2 className={styles.title}>[카테고리 관리]</h2>
                <div className={styles.horizontalLine}></div>
                <div className={styles.section}>
                    <h3 className={styles.subtitle}>상위 카테고리</h3>
                    <div className={styles.form}>
                        <input
                            type="text"
                            placeholder="카테고리 명을 입력해주세요."
                            className={styles.input}
                            value={newTopCategory}
                            onChange={(e) => setNewTopCategory(e.target.value)}
                        />
                        <button className={styles.button} onClick={handleAddTopCategory}>+ 추가</button>
                    </div>
                    <div className={styles.tagContainer}>
                        {topCategories.map((category, index) => (
                            <span key={index} className={styles.tag}>
                                {category.name}
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteTopCategory(category.id)}
                                >
                                    x
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
                <div className={styles.horizontalLine}></div>

                <div className={styles.section}>
                    <h3 className={styles.subtitle}>하위 카테고리</h3>
                    <div className={styles.subCategoryForm}>
                        <select
                            value={selectedTopCategory}
                            onChange={(e) => setSelectedTopCategory(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">상위카테고리</option>
                            {topCategories.map((category, index) => (
                                <option key={index} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="카테고리 명을 입력해주세요."
                            value={newSubCategory}
                            onChange={(e) => setNewSubCategory(e.target.value)}
                            className={styles.input}
                        />
                        <button onClick={() => handleAddSubCategory(selectedTopCategory)} className={styles.button}>+
                            추가
                        </button>
                    </div>

                    <table className={styles.subCategoryTable}>
                        <thead>
                        <tr>
                            <th>해당 상위 카테고리</th>
                            <th>하위 카테고리 명</th>

                        </tr>
                        </thead>
                        <tbody>
                        {subCategories.map((subCategory, index) => (
                            <tr key={index}>
                                <td>{subCategory.upperCategory.name}</td>
                                <td>
                                    {subCategory.name}
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDeleteSubCategory(subCategory.id)}
                                    >
                                        🗑️
                                    </button>
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className={styles.horizontalLine}></div>

                <div className={styles.section}>
                <h3 className={styles.subtitle}>기술스택</h3>
                    <div className={styles.form}>
                        <input
                            type="text"
                            placeholder="기술스택 명을 입력해주세요."
                            className={styles.input}
                            value={newTechStack}
                            onChange={(e) => setNewTechStack(e.target.value)}
                        />
                        <input
                            type="file"
                            onChange={(e) => setNewTechStackImage(e.target.files[0])}
                            className={styles.input}
                        />
                        <button className={styles.button} onClick={handleAddTechStack}>+ 추가</button>
                    </div>
                    <div className={styles.tagContainer}>
                        {techStack.map((stack, index) => (
                            <span key={index} className={styles.tag}>
                                <img
                                    src={stack.techStackPath}
                                    alt={stack.techStackName}
                                    className={styles.techStackImage}
                                    width="15" // 원하는 너비로 설정
                                    height="15" // 원하는 높이로 설정
                                />
                                {stack.techStackName}
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteTechStack(stack.techStackId)}
                                >
                                    x
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <Sidebar className={styles.sidebar}/>
        </div>
    );
};
export default CategoryAndTechStackManagement;