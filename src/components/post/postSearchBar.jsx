import React, { useState } from "react";
import axios from "axios";
import postAxios from "../../axiosApi/postAxios";

function PostSearch() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await postAxios.getPostTitleOrContent(keyword);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={keyword}
        onChange={handleInputChange}
        placeholder="검색어를 입력하세요..."
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default PostSearch;
