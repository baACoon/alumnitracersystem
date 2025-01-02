import React from "react";
import ReactDOM from "react-dom";
import App from "./App"; // Adjust path as needed

ReactDOM.render(
  <React.StrictMode>
    <App admin={true} />
  </React.StrictMode>,
  document.getElementById("root")
);
