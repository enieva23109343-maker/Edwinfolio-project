// App.js
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Splash from "./components/SplashPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/HomePage";
import About from "./pages/AboutPage";
import Contact from "./pages/ContactPage";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import Profile from "./pages/ProfilePage";
import Admin from "./pages/AdminPage";
import CreatePost from "./pages/CreatePostPage";
import Game from "./pages/GamePage";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Splash />;
  }

  return (
    <div className="app-wrapper">
      <Header />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;