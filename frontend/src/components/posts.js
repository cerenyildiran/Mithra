import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaUserCircle } from 'react-icons/fa';

const Posts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/posts/');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div>
            <h1>Posts</h1>
            {posts.map(post => (
                <div key={post.id} className="post-card">
                    <h2>{post.title}</h2>
                    <div className="post-metadata">
                        <span><FaUserCircle /> {post.author}</span>
                        <span>Category: {post.category}</span>
                    </div>
                    <p>{post.content}</p>
                    <button className="like-button">
                        <FaHeart /> Like
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Posts;
