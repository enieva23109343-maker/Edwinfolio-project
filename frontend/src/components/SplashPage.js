import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.jpg';

function SplashPage() {
  const navigate = useNavigate();
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '.';
      });
    }, 500);

    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  const styles = {
    container: {
      fontFamily: "'Poppins', sans-serif",
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg,#050b2e,#0a1b4f)',
      overflow: 'hidden'
    },
    loader: {
      width: '380px',
      textAlign: 'center',
      padding: '50px 40px 45px',
      borderRadius: '24px',
      background: 'rgba(10,30,80,0.45)',
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(15px)',
      boxShadow: '0 0 45px rgba(0,255,255,0.18)'
    },
    logo: {
      width: '90px',
      height: '90px',
      margin: '0 auto 22px',
      borderRadius: '50%',
      padding: '6px',
      background: 'rgba(0,246,255,0.15)',
      boxShadow: '0 0 25px rgba(0,246,255,0.35)'
    },
    logoImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '50%',
      animation: 'float 3s ease-in-out infinite'
    },
    title: {
      fontSize: '28px',
      fontWeight: 700,
      color: '#00f6ff',
      marginBottom: '18px',
      textShadow: '0 0 15px rgba(0,246,255,0.6)'
    },
    divider: {
      width: '60px',
      height: '2px',
      margin: '0 auto 26px',
      background: '#00f6ff',
      boxShadow: '0 0 12px rgba(0,246,255,0.7)',
      borderRadius: '2px'
    },
    spinner: {
      width: '64px',
      height: '64px',
      border: '6px solid rgba(0,246,255,0.25)',
      borderTopColor: '#00f6ff',
      borderRadius: '50%',
      margin: '0 auto 18px',
      animation: 'spin 1s linear infinite'
    },
    loadingText: {
      fontSize: '15px',
      color: '#b8faff',
      letterSpacing: '1px'
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes float {
            0%,100%{transform:translateY(0);}
            50%{transform:translateY(-10px);}
          }
          @keyframes spin {
            to{transform:rotate(360deg);}
          }
        `}
      </style>
      <div style={styles.loader}>
        <div style={styles.logo}>
          <img 
            style={styles.logoImg}
            src={heroImage}
            alt="logo"
          />
        </div>
        <h1 style={styles.title}>My Portfolio</h1>
        <div style={styles.divider}></div>
        <div style={styles.spinner}></div>
        <div style={styles.loadingText}>
          Loading<span>{dots}</span>
        </div>
      </div>
    </div>
  );
}

export default SplashPage;