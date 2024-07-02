import React, { useEffect, useState } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "./PopularTags.module.css";

const PopularTags = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    axiosClient
      .get("/posts/tags/popular")
      .then((response) => {
        setTags(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the popular tags!", error);
      });
  }, []);

  return (
    <div className={styles.popularTagsContainer}>
      <div className={styles.header}>
        <h4>인기 태그</h4>
      </div>
      <ul className={styles.popularTagsList}>
        {tags.map((tag, index) => (
          <li key={index} className={styles.popularTagItem}>
            <a href={`/tags/${tag}`} className={styles.popularTagLink}>
              #{tag}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularTags;