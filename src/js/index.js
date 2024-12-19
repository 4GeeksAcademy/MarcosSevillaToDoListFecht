//import react into the bundle
import React from "react";
import ReactDOM from "react-dom/client";

// Include your styles into the webpack bundle
import "../styles/index.css";

// Import your main component
import Home from "./component/home.jsx";

// Render your React application
ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);


