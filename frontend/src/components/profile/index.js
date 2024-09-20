import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const Profile = () => {
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
        <h2>username</h2>
      </div>
      <Tabs>
        <TabList>
          <Tab>Posts</Tab>
          <Tab>Likes</Tab>
          <Tab>Saved</Tab>
        </TabList>
        <TabPanel>
          <h2>Posts</h2>
        </TabPanel>
        <TabPanel>
          <h2>Likes</h2>
        </TabPanel>
        <TabPanel>
          <h2>Saved</h2>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Profile;
