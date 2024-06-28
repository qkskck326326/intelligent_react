import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./InsertPost.module.css";
import { axiosClient } from "../../axiosApi/axiosClient";
import authStore from "../../stores/authStore";
import { observer } from "mobx-react";
import dynamic from "next/dynamic";
const CKEditorComponent = dynamic(() => import("./CKEditorComponent"), {
  ssr: false,
});

const InsertPost = observer(() => {
  const [title, setTitle] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]); // files 상태 변수 선언
  const router = useRouter();

  const userEmail = authStore.getUserEmail();
  const provider = authStore.getProvider();

  useEffect(() => {
    const isLoggedIn = authStore.checkIsLoggedIn();

    if (!isLoggedIn) {
      const userConfirmed = window.confirm(
        "로그인이 필요한 콘텐츠입니다. 로그인하시겠습니까?"
      );

      if (userConfirmed) {
        router.push("/user/login");
      } else {
        router.push("/post");
      }
    }
    axiosClient
      .get("/categories/sub")
      .then((response) => {
        setSubCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subcategories:", error);
      });
  }, []);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleSubmit = async () => {
    try {
      const postDTO = {
        title,
        content,
        userEmail,
        provider,
        subCategoryId,
      };

      const postResponse = await axiosClient.post("/posts/insert", postDTO);
      const newPostId = postResponse.data.id;

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });
        await axiosClient.post(`/posts/${newPostId}/files`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      router.push(`/post/${newPostId}`);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const handleCancel = () => {
    router.push("/post");
  };

  const renderFilePreview = (file) => {
    if (file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className={styles.filePreview}
        />
      );
    } else {
      return <p>{file.name}</p>;
    }
  };

  return (
    <div className={styles.postInsertContainer}>
      <h1>글을 작성해보세요</h1>
      <br />
      <div className={styles.formGroup}>
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="subCategoryId">카테고리</label>
        <select
          id="subCategoryId"
          value={subCategoryId}
          onChange={(e) => setSubCategoryId(e.target.value)}
          className={styles.select}
        >
          <option value="">카테고리를 선택하세요</option>
          {subCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="content">내용</label>
        <CKEditorComponent data={content} onChange={setContent} />
      </div>
      <div
        className={styles.fileDropArea}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
      >
        <input
          type="file"
          id="fileInput"
          multiple
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        <label htmlFor="fileInput" className={styles.fileInputLabel}>
          공유하고 싶은 파일을 선택하거나 드래그 앤 드롭하세요
        </label>
        <div className={styles.filePreviewContainer}>
          {files.map((file, index) => (
            <div key={index} className={styles.filePreviewItem}>
              {renderFilePreview(file)}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button onClick={handleSubmit} className={styles.submitButton}>
          작성하기
        </button>
        <button onClick={handleCancel} className={styles.cancelButton}>
          취소
        </button>
      </div>
    </div>
  );
});

export default InsertPost;
