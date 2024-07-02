import React, { useEffect, useState } from "react";
import { axiosClient } from "../../axiosApi/axiosClient";
import styles from "./WeeklyPopularPosts.module.css";

const WeeklyPopularPosts = () => {
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await axiosClient.get("/posts/weeklyPopular");
        setPopularPosts(response.data);
      } catch (error) {
        console.error("Error fetching popular posts:", error);
      }
    };

    fetchPopularPosts();
  }, []);

  return (
    <div className={styles.container}>
      <h3>주간 인기 글</h3>
      <ul>
        {popularPosts.slice(0, 5).map((post) => (
          <li key={post.id}>
            <a href={`/post/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeeklyPopularPosts;
