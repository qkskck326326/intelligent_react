import React, { useState, useRef, useEffect } from 'react';
import { axiosClient } from "../../axiosApi/axiosClient";
import axios from 'axios';
import styles from '../../styles/lecture/addLecture.module.css';
import { useRouter } from 'next/router';
import authStore from '../../stores/authStore';

const AddLecture = () => {
    const [lectureName, setLectureName] = useState('');
    const [lectureContent, setLectureContent] = useState('');
    const [lectureThumbnail, setLectureThumbnail] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [videoPath, setVideoPath] = useState('');
    const [streamUrl, setStreamUrl] = useState('');
    const [imgFile, setImgFile] = useState('');
    const [lecturePackageId, setLecturePackageId] = useState('');
    const [nickname, setNickname] = useState('');
    const [loadingThumbnail, setLoadingThumbnail] = useState(false);
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [hasUploaded, setHasUploaded] = useState(false);
    const imgRef = useRef();
    const router = useRouter();

    useEffect(() => {
        const currentNickname = authStore.getNickname();
        const lecturePackageIdFromQuery = router.query.lecturePackageId || '1';
        setLecturePackageId(lecturePackageIdFromQuery);
        setNickname(currentNickname);
    }, [router.query]);

    const REPO_OWNER = 'rudalsdl';
    const REPO_NAME = 'lectureSave';

    const handleLectureRegister = async (lectureInput) => {
        try {
            console.log("Registering lecture with input:", lectureInput);
            const response = await axiosClient.post(`/lecture/register/${lecturePackageId}?nickname=${nickname}`, lectureInput);
            console.log("Registration response:", response);
            alert('강의가 성공적으로 등록되었습니다.');
            router.push(`/lecture/list?lecturePackageId=${lecturePackageId}`);
        } catch (error) {
            console.error('Error registering lecture:', error);
            alert('강의 등록에 실패했습니다.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const lectureInput = {
            lectureName,
            lectureContent,
            lectureThumbnail,
            streamUrl,
            lecturePackageId,
            nickname
        };
        console.log("Form submitted with input:", lectureInput);
        await handleLectureRegister(lectureInput);
    };

    const handleUpload = async (file, path) => {
        if (!file) {
            throw new Error('파일이 선택되지 않았습니다.');
        }

        const fileReader = new FileReader();
        return new Promise((resolve, reject) => {
            fileReader.readAsDataURL(file);
            fileReader.onloadend = async () => {
                const base64File = fileReader.result.split(',')[1];
                const timestamp = new Date().getTime(); // 타임스탬프 추가
                const fileName = `${timestamp}_${file.name}`;

                try {
                    const response = await axios.put(
                        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}/${fileName}`,
                        {
                            message: `upload ${path.slice(0, -1)} ${fileName}`,
                            content: base64File,
                        },
                        {
                            headers: {
                                Authorization: `token ${process.env.NEXT_PUBLIC_ADD_LECTURE_GITHUB_TOKEN}`,
                            },
                        }
                    );

                    const fileUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${path}/${fileName}`;
                    setHasUploaded(true); // 업로드 성공 시 상태 업데이트
                    resolve(fileUrl);
                } catch (error) {
                    reject(error);
                }
            };
        });
    };

    const handleUploadAll = async () => {
        try {
            setLoadingThumbnail(true);
            setLoadingVideo(true);

            const [thumbnailUrl, videoUrl] = await Promise.all([
                handleUpload(imgFile, 'thumbnails'),
                handleUpload(videoFile, 'uploads')
            ]);

            setLectureThumbnail(thumbnailUrl);
            setStreamUrl(videoUrl);

            alert('썸네일 및 영상이 성공적으로 업로드되었습니다.');

            setLoadingThumbnail(false);
            setLoadingVideo(false);
        } catch (error) {
            console.error('업로드 중 오류 발생:', error);
            alert('업로드 중 오류 발생: ' + (error.response?.data?.error || error.message));
            setLoadingThumbnail(false);
            setLoadingVideo(false);
        }
    };

    const handleVideoFileChange = (file) => {
        setVideoFile(file);
        setVideoPath(file.name);
    };

    const handleThumbnailFileChange = (file) => {
        setImgFile(file);
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
                                src={imgFile ? URL.createObjectURL(imgFile) : ''}
                                alt="썸네일 미리보기"
                                className={styles.thumbnailPreview}
                            />
                            <input
                                type="file"
                                id="thumbnailFile"
                                className={styles.fileInput}
                                onChange={(e) => handleThumbnailFileChange(e.target.files[0])}
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
                            onClick={handleUploadAll}
                            disabled={loadingThumbnail || loadingVideo}
                        >
                            {loadingThumbnail || loadingVideo ? (
                                <div className={styles.loadingContainer}>
                                    <div className={styles.loadingSpinner}></div>
                                </div>
                            ) : (
                                '썸네일 및 영상 업로드'
                            )}
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
