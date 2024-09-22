import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaUserCircle } from "react-icons/fa";
import { timeSince } from "../../utils/timeUtils";

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
    <div className="container mt-4">
      <h1 className="text-center mb-3">My Likes Post</h1>
      {posts.map((post) => (
        <div key={post.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{post.title}</h5>
            <p className="card-text">{post.content}</p>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <FaUserCircle /> {post.author}
                <span className="badge bg-primary ml-2">{post.category}</span>
              </div>
              <small className="text-muted">
                {timeSince(post.created_at)} ago
              </small>
              <button className="btn btn-outline-danger">
                <FaHeart /> Like
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyLikes;
