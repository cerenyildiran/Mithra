import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { FaHeart, FaUserCircle } from "react-icons/fa";
import { timeSince } from "../../utils/timeUtils";

const MyLikes = ({ user }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchLikes();
  }, [user]);

  const fetchLikes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/likes/${user.id}/`
      );
      const sortedData = response.data.sort(
        (a, b) => new Date(b.like_created_at) - new Date(a.like_created_at)
      );
      setPosts(sortedData);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const toggleLike = async (post) => {
    const url = `http://localhost:8000/api/posts/${post.id}/like/`;
    const token = Cookies.get("accessToken");
    const method = post.likes.includes(user.username) ? "DELETE" : "POST";
    try {
      await axios.post(url, { token, method });
      fetchLikes();
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-3">My Liked Posts</h1>
      {posts.map((post) => (
        <div key={post.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">
              <Link to={`/posts/${post.id}`} className="text-primary">
                {post.title}
              </Link>
            </h5>
            <p className="card-text">{post.content}</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex flex-column align-items-start">
                <div className="d-flex align-items-center">
                  <FaUserCircle className="me-2" />
                  <div>{post.author}</div>
                </div>
                <div>
                  <span className="badge bg-primary mt-2">{post.category}</span>
                </div>
              </div>
              <small className="text-muted">
                {timeSince(post.created_at)} ago
              </small>
              {user && (
              <div className="d-flex justify-content-end mt-2">
                <button
                  className="btn btn-outline-danger me-2"
                  onClick={() => toggleLike(post)}
                >
                  <FaHeart className="me-1" />
                  {post.likes.includes(user.username) ? "Unlike" : "Like"}
                </button>
              </div>
            )}
            </div>
            
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyLikes;
