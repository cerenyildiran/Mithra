import React, { useState, useEffect } from "react";
import { FaHeart, FaUserCircle, FaTrash } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { timeSince } from "../../utils/timeUtils";

const MyPosts = ({ user }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/userposts/${user.id}/`
      );
      setPosts(response.data.reverse());
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
  const toggleDeletePost = async (post) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (confirmDelete) {
      const token = Cookies.get("accessToken");
      try {
        await axios.post(`http://localhost:8000/api/posts/${post.id}/delete/`, {
          token,
        });
        fetchPosts();
      } catch (error) {
        console.error("Error delete post:", error);
      }
    }

    const token = Cookies.get("accessToken");
    try {
      await axios.post(`http://localhost:8000/api/posts/${post.id}/delete/`, {
        token,
      });
      fetchPosts();
    } catch (error) {
      console.error("Error delete post:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-3">User Posts</h1>
      {posts.map((post) => (
        <div key={post.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h5>
            <p className="card-text">{post.content}</p>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <FaUserCircle /> {post.author}
                <span className="badge bg-primary ml-2">{post.category}</span>
              </div>
              <small className="text-muted">
                {timeSince(post.created_at)} ago
              </small>
              {user && (
                <div>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => toggleLike(post)}
                  >
                    <FaHeart />{" "}
                    {post.likes.includes(user.username) ? "Unlike" : "Like"}
                  </button>
                  <FaTrash
                    className="text-muted"
                    onClick={() => toggleDeletePost(post)}
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyPosts;
