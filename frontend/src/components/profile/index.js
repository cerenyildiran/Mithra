import React, { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useNavigate } from "react-router-dom";
import MyPosts from "./my-posts";
import MyLikes from "./my-likes";

const Profile = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      verifyUser(accessToken);
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  const verifyUser = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/verifyToken/",
        { token },
        { headers: { "Content-Type": "application/json" } }
      );
      if (!response.data.user) {
        navigate("/");
      }
    } catch (err) {
      console.error("Token verification error:", err);
      navigate("/");
    }
  };
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-pic-container">
          <img
            src="https://picsum.photos/200/200"
            alt="Profile"
            className="profile-pic"
          />
        </div>
        {user ? (
          <h2 className="nickname">{user.username}</h2>
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
      <Tabs>
        <TabList>
          <Tab>Posts</Tab>
          <Tab>Likes</Tab>
        </TabList>
        <TabPanel>
          {user && <MyPosts user={user} />}
        </TabPanel>
        <TabPanel>
          {user && <MyLikes user={user} />}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Profile;
