import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Post = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/posts/${id}/`);
      console.log(response.data)
      setPost(response.data)
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  if (!post) {
    return (<div className="container mt-4">
        <h1 className="text-center mb-3">Post Not Found</h1>
      </div>);
  }
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-3">{post.title}</h1>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{post.title}</h5>
          <p className="card-text">{post.content}</p>
          <p><strong>Category:</strong> {post.category}</p>
          <p><strong>Author:</strong> {post.author}</p>
          <p><strong>Created At:</strong> {new Date(post.created_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
