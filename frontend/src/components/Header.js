// components/Header.js
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import SplashPage from "./SplashPage";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [pageTitle, setPageTitle] = useState("Home");
  const [showSplash, setShowSplash] = useState(false);

  // Check and apply theme on load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.body.classList.add("light");
    } else {
      setIsDarkMode(true);
      document.body.classList.remove("light");
    }
  }, []);

  // Update page title based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setPageTitle("Home");
    else if (path === "/about") setPageTitle("About");
    else if (path === "/contact") setPageTitle("Contact");
    else if (path === "/login") setPageTitle("Login");
    else if (path === "/register") setPageTitle("Register");
    else if (path === "/game") setPageTitle("Game");
    else if (path === "/profile") setPageTitle("Profile");
    else if (path === "/create-post") setPageTitle("Create Post");
    else if (path === "/admin") setPageTitle("Admin");
    else setPageTitle("My Portfolio");
  }, [location.pathname]);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.add("light");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowSplash(true);
      setTimeout(() => {
        setShowSplash(false);
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Show your existing splash screen while logging out
  if (showSplash) {
    return <SplashPage />;
  }

  return (
    <header className="header">
      <nav className="nav container">
        <div className="logo">{pageTitle}</div>
        <ul className="menu">
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>
              Contact
            </Link>
          </li>
          
          {/* Show Login and Register when NOT logged in */}
          {!user && (
            <>
              <li>
                <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className={location.pathname === "/register" ? "active" : ""}>
                  Register
                </Link>
              </li>
            </>
          )}
          
          {/* Show Game for everyone */}
          <li>
            <Link to="/game" className={location.pathname === "/game" ? "active" : ""}>
              Game
            </Link>
          </li>
          
          {/* Show when logged in */}
          {user && (
            <>
              <li>
                <Link to="/create-post" className={location.pathname === "/create-post" ? "active" : ""}>
                  Create Post
                </Link>
              </li>
              <li>
                <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
                  Profile
                </Link>
              </li>
            </>
          )}
          
          {/* Admin link - shows only for admin users */}
          {user?.role === "admin" && (
            <li>
              <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
                Admin
              </Link>
            </li>
          )}
          
          {/* Logout button - shows only when logged in */}
          {user && (
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          )}

          {/* Theme Toggle Button */}
          <li>
            <button onClick={toggleTheme} className="theme-btn">
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;