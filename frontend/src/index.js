import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 👈 ADD THIS
import App from "./App";
import "./style.css";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>   {/* ✅ THIS FIXES YOUR ERROR */}
      <App />
    </AuthProvider>
  </BrowserRouter>
  </React.StrictMode>
);

// KEEP THIS (your custom feature)
window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  if (splash) {
    splash.style.opacity = "0";
    setTimeout(() => splash.remove(), 500);
  }
});