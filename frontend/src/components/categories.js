import React from "react";
import { useLocation, Link } from "react-router-dom";
import Category from "./category";
import {categories} from "../utils/categories"

const Categories = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const catIndex = pathSegments.indexOf("cat");
  const categoryName = pathSegments.slice(catIndex + 1).join("/");
  if (location.pathname === "/cat" || location.pathname === "/cat/") {
    return (
      <div className="category-page">
        <h2>Categories</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.name}>
              <Link to={`/cat/${category.path}`}>{category.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  const currentCategory = categories.find(cat => cat.path === categoryName);
  console.log(categoryName)
  if (currentCategory) {
    return (
      <div className="category-page">
        <h2>Welcome to the {currentCategory.name} category!</h2>
        <Category category={currentCategory.name}/>
      </div>
    );
  } else {
    return (
      <div className="category-page">
        <h2>Category not found</h2>
      </div>
    );
  }
};

export default Categories;
