import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const CreatePost = ({onPostCreated}) => {
  const categories = [
    { name: "Animals", value: "animals" },
    { name: "Foods", value: "foods" },
    { name: "Celebrities", value: "celebrities" },
    { name: "Politics", value: "politics" },
    { name: "Art", value: "art" },
  ];

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    try {
      const response = await axios.post(
        "http://localhost:8000/api/createPost/",
        {
          title,
          content,
          category,
          token,
        }
      );
      setMessage(response.data.message);
      setError(null);
      setTitle("");
      setContent("");
      setCategory("");
      onPostCreated();
    } catch (err) {
      setError(
        err.response
          ? err.response.data.error
          : "An error occurred while sending the data."
      );
      setMessage("");
    }
  };

  return (
    <div className="post-container">
      <h1 className="post-heading">Create a Post</h1>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label className="form-label">Title:</label>
          <input
            type="text"
            className="post-input"
            placeholder="Enter post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Content:</label>
          <textarea
            className="post-textarea"
            placeholder="Write your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Category:</label>
          <select
            className="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category.value}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">
          Post
        </button>
      </form>
      {message && <div className="success-msg">{message}</div>}
      {error && <div className="error-msg">{error}</div>}
    </div>
  );
};

export default CreatePost;
