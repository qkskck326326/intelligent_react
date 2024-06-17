import React, { useState, useRef } from 'react';
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from '../../styles/lecture/addLecture.module.css';
import { useRouter } from 'next/router';

const AddLecture = () => {
    const [lectureName, setLectureName] = useState('');
    const [lectureContent, setLectureContent] = useState('');
    const [lectureThumbnail, setLectureThumbnail] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [videoPath, setVideoPath] = useState('');
    const [streamUrl, setStreamUrl] = useState('');
    const [imgFile, setImgFile] = useState("");
    const imgRef = useRef();
    const router = useRouter();

    // GitHub 정보 (환경 변수 사용)
    const REPO_OWNER = 'rudalsdl'; // GitHub 사용자명
    const REPO_NAME = 'lectureSave'; // 저장소 이름

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const lectureResponse = await axiosClient.post('/lecture/register', {
                lectureName,
                lectureContent,
                lectureThumbnail,
                streamUrl
            });

            alert('Lecture registered successfully');
            // 강의 등록이 완료되면 목록 페이지로 이동
            router.push('/lecture/list');
        } catch (error) {
            console.error('Error registering lecture', error);
            alert('Error registering lecture');
        }
    };

    const handleVideoUpload = async (videoFile) => {
        if (!videoFile) {
            alert('No video file selected');
            return;
        }

        try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(videoFile);
            fileReader.onloadend = async () => {
                const base64File = fileReader.result.split(',')[1];
                const fileName = videoFile.name;

                const response = await axiosClient.put(
                    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/uploads/${fileName}`,
                    {
                        message: `upload video ${fileName}`,
                        content: base64File,
                    },
                    {
                        headers: {
                            Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
                        },
                    }
                );

                const fileUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/uploads/${fileName}`;
                setStreamUrl(fileUrl);
                alert('Video uploaded successfully');
            };
        } catch (error) {
            console.error('Error uploading video:', error);
            alert('Error uploading video: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleVideoFileChange = (file) => {
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
                                src={imgFile}
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
                                onChange={(e) => handleVideoFileChange(e.target.files[0])}
                            />
                            <label htmlFor="videoFile" className={styles.customFileInput}>첨부파일</label>
                        </div>
                        <button
                            type="button"
                            className={styles.uploadButton}
                            onClick={() => handleVideoUpload(videoFile)}
                        >
                            영상 업로드
                        </button>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="streamUrl" className={styles.label}>Stream URL</label>
                        <input
                            type="text"
                            id="streamUrl"
                            value={streamUrl}
                            readOnly
                            className={styles.input}
                        />
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
