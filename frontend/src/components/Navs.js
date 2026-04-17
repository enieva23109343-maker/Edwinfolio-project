import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';  // Add useLocation

function Navs() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const location = useLocation();  // Get current location

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Function to get title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/about')) return 'About';
    if (path.includes('/contact')) return 'Contact';
    if (path.includes('/register')) return 'Register';
    if (path.includes('/game')) return 'Game';
    return 'My Portfolio';  // Default for home
  };

  return (
    <>
      <button 
        onClick={toggleTheme} 
        className="theme-btn"
        style={{position: 'fixed', top: '20px', right: '20px', zIndex: 999}}
      >
        {theme === 'light' ? '🌙' : '☀'}
      </button>

      <header className="header">
        <div className="container nav">
          <h1 className="logo">{getPageTitle()}</h1>  {/* Dynamic title */}
          <ul className="menu">
            <li><NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink></li>
            <li><NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''}>Register</NavLink></li>
            <li><NavLink to="/create-post" className={({ isActive }) => isActive ? 'active' : ''}>Create Post</NavLink></li>
            <li><NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>Profile</NavLink></li>
            <li><NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>Admin</NavLink></li>
            <li><NavLink to="/game" className={({ isActive }) => isActive ? 'active' : ''}>Game</NavLink></li>
          </ul>
        </div>
      </header>
    </>
  );
}

export default Navs;