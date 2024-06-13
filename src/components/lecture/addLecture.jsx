import React, { useState, useRef } from 'react';
import axios from 'axios';
import { observer } from 'mobx-react';
import authStore from '../../stores/authStore';

const AddLecture = observer(() => {
    const [lectureName, setLectureName] = useState('');
    const [lectureContent, setLectureContent] = useState('');
    const [lectureThumbnail, setLectureThumbnail] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [streamUrl, setStreamUrl] = useState('');
    const [imgFile, setImgFile] = useState("");
    const imgRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const lecturePackageId = 1;
            const nickname = authStore.getNickname();

            const lectureResponse = await axios.post('http://localhost:8080/lecture/register', {
                lectureName,
                lectureContent,
                lectureThumbnail,
                streamUrl, // placeholder
                lecturePackageId,
                nickname
            });

            if (lectureResponse.data && videoFile) {
                const formData = new FormData();
                formData.append('file', videoFile);

                const videoResponse = await axios.post('http://localhost/upload.php', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (videoResponse.data.filePath) {
                    await axios.put(`http://localhost:8080/lecture/update/${lectureResponse.data.id}`, {
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
        setStreamUrl(file.name);
    };

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLectureThumbnail(file.name);
            saveImgFile(file);
        }
    };

    const saveImgFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImgFile(reader.result);
        };
    };

    return (
        <div>
            <h1>강의 등록</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="lectureName">제목</label>
                    <input
                        type="text"
                        id="lectureName"
                        value={lectureName}
                        onChange={(e) => setLectureName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="lectureContent">설명</label>
                    <textarea
                        id="lectureContent"
                        value={lectureContent}
                        onChange={(e) => setLectureContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="lectureThumbnail">영상 썸네일</label>
                    <input
                        type="text"
                        id="lectureThumbnail"
                        value={lectureThumbnail}
                        readOnly
                    />
                    <input
                        type="file"
                        id="thumbnailFile"
                        onChange={handleThumbnailUpload}
                        ref={imgRef}
                    />
                    <div>
                        <img
                            src={imgFile ? imgFile : `/images/icon/user.png`}
                            alt="썸네일 미리보기"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="videoPath">영상</label>
                    <input
                        type="text"
                        id="streamUrl"
                        value={streamUrl}
                        readOnly
                    />
                    <input
                        type="file"
                        id="videoFile"
                        onChange={(e) => handleVideoUpload(e.target.files[0])}
                    />
                </div>
                <button type="submit">등록하기</button>
            </form>
        </div>
    );
});

export default AddLecture;
