import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App.jsx";

/* =========================================
   SERAPH APPLICATION ROOT
========================================= */

const rootElement = document.getElementById("root");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(circle at top left, #2b004d 0%, #12001f 45%, #07000f 100%)",
        color: "#ffffff",
        overflowX: "hidden",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <App />
    </div>
  </React.StrictMode>
);