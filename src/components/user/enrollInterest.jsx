import React, { useState, useEffect } from 'react';
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from '../../styles/user/enroll/enrollInterest.module.css';
import { useRouter } from "next/router";
import AWS from "aws-sdk";

AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID_TAESEOK,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY_TAESEOK,
    region: process.env.NEXT_PUBLIC_AWS_REGION_TAESEOK,
});

const s3 = new AWS.S3();

const EnrollInterest = ({ nextPage, prevPage, basicInfo, setBasicInfo, educationExperience, careerExperience }) => {
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosClient.get('/categories/sub'); // Spring Boot 엔드포인트 호출
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (category) => {
        let updatedSelected;
        if (selected.some(cat => cat.id === category.id)) {
            updatedSelected = selected.filter(cat => cat.id !== category.id);
        } else {
            updatedSelected = [...selected, category];
        }
        setSelected(updatedSelected);
        setBasicInfo(prevState => ({ ...prevState, interests: updatedSelected }));
    };

    const uploadImageToS3 = async (file) => {
        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_TAESEOK,
            Key: `ProfileImages/${Date.now()}_${file.name}`,
            Body: file,
            ContentType: file.type,
        };

        try {
            const { Location } = await s3.upload(params).promise();
            return Location;
        } catch (err) {
            console.error("Error uploading file:", err);
            throw err;
        }
    };

    const handleRegister = async () => {
        const defaultWidth = 128;
        const defaultHeight = 128;
        let file;

        if (basicInfo.profileImageUrl) {
            file = basicInfo.profileImageUrl;
        } else {
            const defaultImageBlob = await fetchDefaultImage();
            file = new File([defaultImageBlob], "defaultProfile.png", { type: "image/png" });
        }

        try {
            const resizedImage = await resizeImage(file, defaultWidth, defaultHeight);
            const profileImageUrl = await uploadImageToS3(resizedImage);
            handleUserRegistration(profileImageUrl);
        } catch (err) {
            console.error("Error during registration process:", err);
            alert("회원가입 과정 중 오류가 발생했습니다.");
        }
    };

    const resizeImage = (file, width, height) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, { type: file.type }));
                    }, file.type);
                };
                img.onerror = (error) => {
                    console.error("Error loading image:", error);
                    reject(new Error("Failed to load the image."));
                };
                img.src = event.target.result;
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
                reject(new Error("Failed to read the file."));
            };
            reader.readAsDataURL(file);
        });
    };

    const fetchDefaultImage = async () => {
        try {
            const response = await fetch("/images/defaultProfile.png");
            const blob = await response.blob();
            return blob;
        } catch (error) {
            console.error("Error fetching default image:", error);
            throw new Error("Failed to fetch the default image.");
        }
    };

    const handleUserRegistration = (profileImageUrl) => {
        const enrollForm = {
            ...basicInfo,
            provider: "intelliclass",
            registerTime: "",
            profileImageUrl,
            reportCount: 0,
            loginOk: "Y",
            faceLoginYn: "N",
            snsAccessToken: "",
            interests: basicInfo.interests.map((interest) => interest.id),
            educations: educationExperience,
            careers: careerExperience,
        };

        axiosClient
            .post("/users/insertuser", enrollForm)
            .then((response) => {
                router.push("/user/login");
                alert("회원가입이 성공적으로 완료되었습니다!");
            })
            .catch((error) => {
                alert("회원가입에 실패했습니다.");
            });
    };

    return (
        <div className={styles.enrollInterestBigContainer}>
            <div className={styles.enrollInterestContainer}>
                <h2>{basicInfo.nickname} 님의 관심 분야를 골라주세요!</h2>
                <div className={styles.categoryContainer}>
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                            className={`${styles.categoryButton} ${selected.some(cat => cat.id === category.id) ? styles.selected : ''}`}
                        >
                            {category.name}
                        </div>
                    ))}
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.prevButton} onClick={prevPage}>이전</button>
                    <button className={styles.navigationButton} onClick={nextPage}>얼굴 등록</button>
                    <button className={styles.navigationButton} onClick={handleRegister}>계정 생성</button>
                </div>
            </div>
        </div>
    );
};

export default EnrollInterest;
