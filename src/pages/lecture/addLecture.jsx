import React, { useState, useRef } from 'react';
import axios from 'axios';
import styles from '../../styles/lecture/addLecture.module.css';

const AddLecture = () => {
    const [lectureName, setLectureName] = useState('');
    const [lectureContent, setLectureContent] = useState('');
    const [lectureThumbnail, setLectureThumbnail] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [videoPath, setVideoPath] = useState('');
    const [imgFile, setImgFile] = useState("");
    const imgRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 강의 정보를 먼저 등록
            const lectureResponse = await axios.post('/lecture/register', {
                lectureName,
                lectureContent,
                lectureThumbnail,
                streamUrl: '' // placeholder, will be updated after video upload
            });

            // 강의 정보가 성공적으로 등록되면, 영상 업로드
            if (lectureResponse.data && videoFile) {
                const formData = new FormData();
                formData.append('file', videoFile);

                const videoResponse = await axios.post('/upload.php', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // 강의 정보 업데이트 (streamUrl 업데이트)
                if (videoResponse.data.filePath) {
                    await axios.put(`/lecture/update/${lectureResponse.data.id}`, {
                        streamUrl: videoResponse.data.filePath
                    });
                }
            }

            alert('Lecture registered successfully');
        } catch (error) {
            console.error('Error registering lecture', error);
            alert('Error registering lecture');
        }
    };

    const handleVideoUpload = (file) => {
        setVideoFile(file);
        setVideoPath(file.name);
    };

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLectureThumbnail(file.name);
        }
    };

    const saveImgFile = () => {
        const file = imgRef.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImgFile(reader.result);
        };
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>강의 등록</h1>
            <h4 className={styles.h2}>강의영상과 강의에 대한 상세 등록을 해주세요!</h4>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.leftColumn}>
                    <div className={styles.formGroup}>
                        <label htmlFor="lectureName" className={styles.label}>제목</label>
                        <input
                            type="text"
                            id="lectureName"
                            value={lectureName}
                            onChange={(e) => setLectureName(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="lectureContent" className={styles.label}>설명</label>
                        <textarea
                            id="lectureContent"
                            value={lectureContent}
                            onChange={(e) => setLectureContent(e.target.value)}
                            required
                            className={styles.textarea}
                        ></textarea>
                    </div>
                </div>
                <div className={styles.rightColumn}>
                    <div className={styles.formGroup}>
                        <label htmlFor="lectureThumbnail" className={styles.label}>영상 썸네일</label>
                        <div className={styles.thumbnailInputContainer}>
                            <img
                                src={imgFile ? imgFile : `/images/icon/user.png`}
                                alt="썸네일 미리보기"
                                className={styles.thumbnailPreview}
                            />
                            <input
                                type="file"
                                id="thumbnailFile"
                                className={styles.fileInput}
                                onChange={(e) => {
                                    handleThumbnailUpload(e);
                                    saveImgFile();
                                }}
                                ref={imgRef}
                            />
                            <label htmlFor="thumbnailFile" className={styles.customFileInput}>첨부파일</label>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="videoPath" className={styles.label}>영상</label>
                        <div className={styles.videoInputContainer}>
                            <input
                                type="text"
                                id="videoPath"
                                value={videoPath}
                                readOnly
                                className={styles.input}
                            />
                            <input
                                type="file"
                                id="videoFile"
                                className={styles.fileInput}
                                onChange={(e) => handleVideoUpload(e.target.files[0])}
                            />
                            <label htmlFor="videoFile" className={styles.customFileInput}>첨부파일</label>
                        </div>
                    </div>
                </div>
                <div className={styles.underColumn}>
                    <button type="submit" className={styles.submitButton}>등록하기</button>
                </div>
            </form>
        </div>
    );
};

export default AddLecture;
