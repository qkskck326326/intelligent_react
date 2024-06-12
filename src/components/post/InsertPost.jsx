import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./InsertPost.module.css";
import { axiosClient } from "../../axiosApi/axiosClient";

const InsertPost = () => {
  const [title, setTitle] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [viewCount, setViewCount] = useState(0);
  const router = useRouter();

  const userEmail = "user1@example.com"; // 예시 값
  const provider = "INTELLICLASS"; // 예시 값

  useEffect(() => {
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
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleSubmit = async () => {
    try {
      const postDTO = {
        title,
        content,
        viewCount,
        userEmail,
        provider,
        subCategoryId,
      };

      const postResponse = await axiosClient.post("/posts/insert", postDTO);
      const postId = postResponse.data.id;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        await axiosClient.post(`/posts/${postId}/files`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      router.push("/post");
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const handleCancel = () => {
    router.push("/post");
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
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.textarea}
        ></textarea>
      </div>
      <div
        className={styles.fileDropArea}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
      >
        {file ? <p>{file.name}</p> : <p>파일을 이곳에 드래그 앤 드롭하세요</p>}
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
};

export default InsertPost;
