import React, {useState} from "react";
import { Link } from "react-router-dom";
import { useUser } from "../middleware/useUser";
import CreatePost from "./profile/create-post";
import Posts from "./posts";

const Home = () => {
  const {user} = useUser();
  const [reloadPosts, setReloadPosts] = useState(false); 
  const categories = [
    { name: "Animals", path: "/animals" },
    { name: "Foods", path: "/foods" },
    { name: "Celebrities", path: "/celebrities" },
    { name: "Politics", path: "/politics" },
    { name: "Art", path: "/art" },
  ];
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
              <Link to={category.path}>{category.name}</Link>
            </li>
          ))}
        </ul>
      </aside>
      <main className="main-content">
        <h1>Welcome!</h1>
        {user && <CreatePost onPostCreated={handlePostCreated} />}
        <Posts reload={reloadPosts} />
      </main>
    </div>
  );
};

export default Home;
