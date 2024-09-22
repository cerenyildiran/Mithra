import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaUserCircle } from 'react-icons/fa';
import { timeSince } from '../utils/timeUtils';

const Posts = ({ reload }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/posts/');
                setPosts(response.data.reverse());
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, [reload]);

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-3">Posts</h1>
            {posts.map(post => (
                <div key={post.id} className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">{post.title}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">
                            <FaUserCircle /> {post.author} · {timeSince(post.created_at)}
                        </h6>
                        <p className="card-text">{post.content}</p>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="badge bg-primary">{post.category}</span>
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

export default Posts;
