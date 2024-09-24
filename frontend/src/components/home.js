import React, {useState} from "react";
import { Link } from "react-router-dom";
import { useUser } from "../middleware/useUser";
import CreatePost from "./profile/create-post";
import Posts from "./posts";
import {categories} from "../utils/categories"
import SearchPosts from "./search";

const Home = () => {
  const {user} = useUser();
  const [reloadPosts, setReloadPosts] = useState(false); 
  const handlePostCreated = () => {
    setReloadPosts(!reloadPosts);
  };

  return (
    <div className="home-page">
      <aside className="sidebar">
        <h2>Categories</h2>
        <ul>
          {categories.map((category, index) => (
            <li key={index}>
              <Link to={`/cat/`+category.path}>{category.name}</Link>
            </li>
          ))}
        </ul>
        <SearchPosts />
      </aside>
      <main className="main-content">
        {user && <CreatePost onPostCreated={handlePostCreated} />}
        <Posts reload={reloadPosts} />
      </main>
    </div>
  );
};

export default Home;
