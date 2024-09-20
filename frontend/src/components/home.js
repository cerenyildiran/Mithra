import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const categories = [
    { name: "Animals", path: "/animals" },
    { name: "Foods", path: "/foods" },
    { name: "Celebrities", path: "/celebrities" },
    { name: "Politics", path: "/politics" },
    { name: "Art", path: "/art" },
  ];

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
      </main>
    </div>
  );
};

export default Home;
