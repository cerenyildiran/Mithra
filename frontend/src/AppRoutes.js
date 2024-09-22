// AppRoutes.js
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import Profile from "./components/profile";
import Posts from "./components/posts";
import Post from "./components/post";

export default function AppRoutes({ user }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile user={user} />} />
      <Route path="posts" element={<Posts />} />
      <Route path="/posts/:id" element={<Post />} />
    </Routes>
  );
}
