import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryToggle from './CategoryToggle'; // CategoryToggle 컴포넌트를 가져옵니다

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState('postTime');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    axios.get(`/api/posts/details?page=${page}&size=${size}&sortBy=${sortOrder}`)
        .then(response => {
          setPosts(response.data.content);
        })
        .catch(error => {
          console.error('There was an error fetching the posts!', error);
        });
  }, [page, size, sortOrder]);

  const filteredPosts = selectedCategory ? posts.filter(post =>
      post.subCategoryName === selectedCategory.name
  ) : posts;

  return (
      <div className="post-list">
        <CategoryToggle
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
        />
        <div className="sort-order">
          <label>
            Sort by:
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
              <option value="postTime">Latest</option>
              <option value="viewCount">Most Viewed</option>
              <option value="likeCount">Most Liked</option>
            </select>
          </label>
        </div>
        <div>
          {filteredPosts.map((post, index) => (
              <div key={index} className="post">
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <div className="post-details">
                  <span className="author">{post.nickname}</span>
                  <span className="category">{post.subCategoryName}</span>
                  <span className="date">{new Date(post.postTime).toLocaleString()}</span>
                  <span className="likes">{post.likeCount} Likes</span>
                  <span className="comments">{post.commentCount} Comments</span>
                  <span className="views">{post.postViewCount} Views</span>
                </div>
              </div>
          ))}
        </div>
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 0}>Previous</button>
          <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
  );
};

export default PostList;