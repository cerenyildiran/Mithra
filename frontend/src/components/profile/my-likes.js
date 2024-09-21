import React, { useState, useEffect } from "react";
import axios from "axios";

const MyLikes = ({ userId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/likes/${userId}/`
        );
        console.log(response.data)
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  }, [userId]);

  
  return (
    <div>
      <h1>My Likes Post</h1>
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <h2>{post.post_title}</h2>
          <p>
            <strong>Content:</strong> {post.post_content}
          </p>
          <p>
            <strong>Author:</strong> {post.author_username}
          </p>
          <p>
            <strong>Category:</strong> {post.post_category}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyLikes;
