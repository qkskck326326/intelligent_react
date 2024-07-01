// src/components/post/PopularPosts.js

import React, { useEffect, useState } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import { getRelativeTime } from "./timeUtils";
import styles from "./PopularPosts.module.css";

const PopularPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axiosClient
      .get("posts/top5")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the popular posts!", error);
      });
  }, []);

  const getRankClass = (index) => {
    switch (index) {
      case 0:
        return `${styles.rankIcon} ${styles.rankIcon1}`;
      case 1:
        return `${styles.rankIcon} ${styles.rankIcon2}`;
      case 2:
        return `${styles.rankIcon} ${styles.rankIcon3}`;
      default:
        return styles.rankIcon;
    }
  };

  return (
    <div className={styles.popularPostsContainer}>
      <div className={styles.header}>
        <h4>주간 인기글</h4>
      </div>
      <ul className={styles.popularPostsList}>
        {posts.map((post, index) => (
          <li key={post.id} className={styles.popularPostItem}>
            <div className={getRankClass(index)}>{index + 1}</div>
            <a href={`/post/${post.id}`} className={styles.popularPostLink}>
              {post.title}
            </a>
            <div className={styles.popularPostMeta}>
              <span className={styles.popularPostComments}>
                {post.commentCount}
              </span>
              <small className={styles.popularPostTime}>
                {getRelativeTime(post.postTime)}
              </small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularPosts;
