import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaHeart, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { timeSince } from "../utils/timeUtils";
import { useUser } from "../middleware/useUser";

const Category = ({ reload, category }) => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, [reload]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/posts/");
      console.log(response.data)
      const filteredPosts = response.data.filter(post => post.category.toLowerCase() === category.toLowerCase());
      setPosts(filteredPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const toggleLike = async (post) => {
    const url = `http://localhost:8000/api/posts/${post.id}/like/`;
    const token = Cookies.get("accessToken");
    const method = post.likes.includes(user.username) ? "DELETE" : "POST";
    try {
      await axios.post(url, { token, method });
      fetchPosts();
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-3">Category: {category}</h1>
      {posts.map((post) => (
        <div key={post.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">
              <FaUserCircle /> {post.author} · {timeSince(post.created_at)}
            </h6>
            <p className="card-text">{post.content}</p>
            <div className="d-flex justify-content-between align-items-center">
              <span className="badge bg-primary">{post.category}</span>
              {user && (
                <div>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => toggleLike(post)}
                  >
                    <FaHeart />
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

export default Category;