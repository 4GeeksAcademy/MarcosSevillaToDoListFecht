import React from "react";
import ToDoListWithFetch from "./TodoListwithFetch.jsx"; // Import the ToDoListWithFetch component

// Create your first component
const Home = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-primary"></h1>
      <ToDoListWithFetch />
    </div>
  );
};

export default Home;

