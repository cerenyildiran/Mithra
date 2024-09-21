import React, { useState, useEffect } from "react";
import axios from "axios";

const MyPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/posts/${userId}/`
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [userId]);

  
  return (
    <div>
      <h1>User Posts</h1>
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <h2>{post.title}</h2>
          <p>
            <strong>Content:</strong> {post.content}
          </p>
          <p>
            <strong>Author:</strong> {post.author}
          </p>
          <p>
            <strong>Category:</strong> {post.category}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyPosts;
