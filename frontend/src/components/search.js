import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SearchPosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/posts/');
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setPosts([]);
      }
    };
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPosts = searchTerm.trim() ? posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5) : [];

  return (
    <div>
      <input
        className="form-control me-2"
        type="search"
        placeholder="Search posts by title"
        aria-label="Search posts"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '10px' }}
      />
      {searchTerm.trim() && filteredPosts.length > 0 ? (
        <ul>
          {filteredPosts.map((post, index) => (
            <li key={index}>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      ) : searchTerm.trim() && (
        <p>No matching posts found.</p>
      )}
    </div>
  );
};

export default SearchPosts;
