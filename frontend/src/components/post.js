import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { FaTrashAlt } from "react-icons/fa";
import { useUser } from "../middleware/useUser";

const Post = () => {
  const { user } = useUser();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/posts/${id}/`
      );
      setPost(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const postComment = async () => {
    const token = Cookies.get("accessToken");
    try {
      await axios.post(`http://localhost:8000/api/comment/${post.id}/`, {
        comment_text: comment,
        token: token,
      });
      setComment("");
      fetchPost();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };
  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the comment?"
    );

    if (confirmDelete) {
      const token = Cookies.get("accessToken");
      try {
        await axios.post(
          `http://localhost:8000/api/comment/${commentId}/delete/`,
          {
            token: token,
          }
        );
        fetchPost();
      } catch (error) {
        console.error("An error occurred while deleting the comment.:", error);
      }
    }

    const token = Cookies.get("accessToken");
    try {
      await axios.post(
        `http://localhost:8000/api/comment/${commentId}/delete/`,
        {
          token: token,
        }
      );
      fetchPost();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (!post) {
    return (
      <div className="container mt-4">
        <h1 className="text-center mb-3">Post Not Found</h1>
      </div>
    );
  }
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-3">{post.title}</h1>
      <div className="card">
        <div className="card-body">
          <p className="card-text">{post.content}</p>
          <p>
            <strong>Category:</strong> {post.category}
          </p>
          <p>
            <strong>Author:</strong> {post.author}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="comment-section mt-4">
        <h2>Comments</h2>
        {user && (
          <>
            <textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="Write a comment..."
              className="form-control mb-2"
              rows="3"
            />
            <button onClick={postComment} className="btn btn-primary">
              Post Comment
            </button>
          </>
        )}
        <div className="comments-list mt-3">
          {post.comments.map((comment, index) => (
            <div key={index} className="card mt-2">
              <div className="card-body">
                <p>{comment.comment}</p>
                <p className="text-muted">{comment.username}</p>
                <p className="text-muted">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
                {user &&
                  (user.username === comment.username ||
                    user.username === post.author) && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="btn text-danger"
                      style={{ border: "none", background: "none" }}
                    >
                      <FaTrashAlt />
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
