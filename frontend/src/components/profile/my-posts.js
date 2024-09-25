import React, { useState, useEffect } from "react";
import { FaHeart, FaUserCircle, FaTrash } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { timeSince } from "../../utils/timeUtils";

const MyPosts = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

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
    await axios.post(url, { token, method });
    fetchPosts();
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDeletePost = async () => {
    const token = Cookies.get("accessToken");
    try {
      await axios.post(
        `http://localhost:8000/api/posts/${selectedPost.id}/delete/`,
        { token }
      );
      fetchPosts();
      closeModal();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-3">User Posts</h1>
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
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => openModal(post)}
                >
                  <FaTrash />
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      ))}

      {showModal && (
        <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  style={{ border: "none", backgroundColor: "transparent" }}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this post?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeletePost}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
