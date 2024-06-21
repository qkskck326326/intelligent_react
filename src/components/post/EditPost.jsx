import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./EditPost.module.css";
import { axiosClient } from "../../axiosApi/axiosClient";
import authStore from "../../stores/authStore";
import { observer } from "mobx-react";
import dynamic from "next/dynamic";
import PostDetail from "./postDetail";

const CKEditorComponent = dynamic(() => import("./CKEditorComponent"), {
  ssr: false,
});

const EditPost = observer(({ postId, setIsEditing }) => {
  const [title, setTitle] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]); // files 상태 변수 선언
  const [existingFiles, setExistingFiles] = useState([]); // 기존 파일 상태 변수 선언
  const router = useRouter();

  const userEmail = authStore.getUserEmail();
  const provider = authStore.getProvider();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const userEmail = authStore.getUserEmail();
        const provider = authStore.getProvider();
        const nickname = authStore.getNickname();
        const response = await axiosClient.get(`/posts/detail/${postId}`, {
          params: { userEmail, provider, nickname },
          withCredentials: true,
        });
        const post = response.data;
        setTitle(post.title);
        setSubCategoryId(post.subCategoryId);
        setContent(post.content);
        setExistingFiles(post.files);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    const fetchSubCategories = async () => {
      try {
        const response = await axiosClient.get("/categories/sub");
        setSubCategories(response.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchPost();
    fetchSubCategories();
  }, [postId]);

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

      await axiosClient.put(`/posts/update/${postId}`, postDTO, {
        withCredentials: true,
      });

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });
        await axiosClient.post(`/posts/${postId}/files`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const renderFilePreview = (file) => {
    if (file.type && file.type.startsWith("image/")) {
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

  const renderExistingFilePreview = (file) => {
    if (file.fileUrl.match(/\.(jpeg|jpg|gif|png)$/i)) {
      return (
        <img
          src={`http://localhost:8080${file.fileUrl}`}
          alt={file.fileUrl.split("/").pop()}
          className={styles.filePreview}
        />
      );
    } else {
      return (
        <a
          href={`http://localhost:8080${file.fileUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {file.fileUrl.split("/").pop()}
        </a>
      );
    }
  };

  return (
    <div className={styles.postEditContainer}>
      <h1>게시물 수정</h1>
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
          {existingFiles.map((file, index) => (
            <div key={index} className={styles.filePreviewItem}>
              {renderExistingFilePreview(file)}
            </div>
          ))}
          {files.map((file, index) => (
            <div key={index} className={styles.filePreviewItem}>
              {renderFilePreview(file)}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <button onClick={handleSubmit} className={styles.submitButton}>
          수정하기
        </button>
        <button onClick={handleCancel} className={styles.cancelButton}>
          취소
        </button>
      </div>
    </div>
  );
});

export default EditPost;
