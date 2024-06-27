import React, { useEffect, useState } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import { getRelativeTime } from "./timeUtils";
import styles from "./PopularPosts.module.css";

const PopularPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axiosClient
      .get("posts/top10")
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
        <h2>인기글 TOP10</h2>
        <img
          src="/images/랭킹.png"
          className={styles.rankImage}
          alt="랭킹 아이콘"
        />
      </div>
      <ul className={styles.popularPostsList}>
        <div className={styles.popularPostColumn}>
          {posts.slice(0, 5).map((post, index) => (
            <li key={post.id} className={styles.popularPostItem}>
              <div className={getRankClass(index)}>{index + 1}</div>
              <a href={`/post/${post.id}`} className={styles.popularPostLink}>
                {post.title}
              </a>
              <span className={styles.popularPostComments}>
                댓글 {post.commentCount}
              </span>
              <div>
                <small className={styles.popularPostTime}>
                  {getRelativeTime(post.postTime)}
                </small>
              </div>
            </li>
          ))}
        </div>
        <div className={styles.popularPostColumn}>
          {posts.slice(5, 10).map((post, index) => (
            <li key={post.id} className={styles.popularPostItem}>
              <div className={getRankClass(index + 5)}>{index + 6}</div>
              <a href={`/post/${post.id}`} className={styles.popularPostLink}>
                {post.title}
              </a>
              <span className={styles.popularPostComments}>
                댓글 {post.commentCount}
              </span>
              <div>
                <small className={styles.popularPostTime}>
                  {getRelativeTime(post.postTime)}
                </small>
              </div>
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
};

export default PopularPosts;
