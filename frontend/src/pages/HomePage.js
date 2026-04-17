// pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import macImage from '../assets/mac.jpg';

function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    setPosts(storedPosts.slice(0, 3));
  };

  const toggleExpand = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
    }
  };

  const handleLike = (postId) => {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: (post.likes || 0) + 1
        };
      }
      return post;
    });
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    loadPosts();
  };

  const handleAddComment = (postId) => {
    if (commentText[postId]?.trim() && user) {
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), {
              id: Date.now(),
              text: commentText[postId],
              author: user?.name,
              date: new Date().toISOString()
            }]
          };
        }
        return post;
      });
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      loadPosts();
      setCommentText({ ...commentText, [postId]: '' });
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentText({ ...commentText, [postId]: value });
  };

  return (
    <>
      {/* Hero Section - For Non-Logged In Users */}
      {!user && (
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-text glass-text">
              <h2>Programming, Software & Mobile Game Passion</h2>
              <p>
                I design clean, structured, and user-friendly solutions inspired by my
                passion for mobile games and interactive digital experiences.
              </p>
              <Link className="btn btn-primary" to="/login">Join The Community</Link>
            </div>
            <div className="hero-image">
              <img 
                src={macImage}
                alt="Programming workspace"
              />
            </div>
          </div>
        </section>
      )}

      {/* Welcome Back Section - For Logged In Users */}
      {user && (
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-text glass-text">
              <h2>Welcome Back, {user.name}!</h2>
              <p>
                Ready to make your next move? Share your programming journey and inspire the community!
              </p>
              <div className="welcome-buttons" style={{ 
                display: 'flex', 
                gap: '20px', 
                justifyContent: 'center', 
                marginTop: '25px',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}>
                <Link className="btn btn-primary" to="/create-post" style={{ padding: '12px 28px' }}>
                  + Write Your Story
                </Link>
                <Link className="btn btn-primary" to="/profile" style={{ padding: '12px 28px' }}>
                  Edit Profile
                </Link>
                <Link className="btn btn-primary" to="/game" style={{ padding: '12px 28px' }}>
                  Play Game
                </Link>
              </div>
              <p className="welcome-quote" style={{ 
                marginTop: '20px', 
                fontStyle: 'italic', 
                color: '#00f0ff',
                fontSize: '0.9rem'
              }}>
                Your voice matters. Every story inspires someone!
              </p>
            </div>
            <div className="hero-image">
              <img 
                src={macImage}
                alt="Programming workspace"
              />
            </div>
          </div>
        </section>
      )}

      {/* Latest from Your Community Section - Shows for BOTH */}
      <section className="container section">
        <h3 className="section-title">Latest from Your Community</h3>
        <p className="section-subtitle">Discover stories shared by fellow developers</p>
        
        <div className="posts-grid">
          {posts.length === 0 ? (
            <p className="no-posts-message">
              No posts yet. Be the first to share your story!
            </p>
          ) : (
            posts.map(post => (
              <div key={post.id} className="post-card">
                {post.image && (
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="post-card-image"
                  />
                )}
                <h3 className="post-card-title">
                  {post.title}
                </h3>
                
                {expandedPostId === post.id ? (
                  <>
                    <p className="post-card-body">
                      {post.body}
                    </p>
                    
                    <div className="post-like-section">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="like-btn"
                      >
                        👍 {post.likes || 0} Likes
                      </button>
                    </div>
                    
                    <div className="post-comments-section">
                      <h4>Comments ({post.comments?.length || 0})</h4>
                      
                      {post.comments && post.comments.length > 0 && (
                        <div className="comments-list">
                          {post.comments.map(comment => (
                            <div key={comment.id} className="comment-item">
                              <div className="comment-header">
                                <strong className="comment-author">{comment.author}</strong>
                                <span className="comment-date">{new Date(comment.date).toLocaleDateString()}</span>
                              </div>
                              <p className="comment-text">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {user ? (
                        <div className="add-comment">
                          <textarea 
                            placeholder="Write a comment..."
                            className="comment-textarea"
                            rows="2"
                            value={commentText[post.id] || ''}
                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                          />
                          <button 
                            onClick={() => handleAddComment(post.id)}
                            className="post-comment-btn"
                          >
                            Post Comment
                          </button>
                        </div>
                      ) : (
                        <p className="login-to-comment">
                          <Link to="/login">Login</Link> to leave a comment
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="post-card-excerpt">
                    {post.body.length > 100 ? post.body.substring(0, 100) + '...' : post.body}
                  </p>
                )}
                
                <p className="post-card-meta">
                  By {post.author?.name} · {new Date(post.createdAt).toLocaleDateString()}
                </p>
                
                <div className="post-card-actions">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="post-action-like"
                  >
                    👍 {post.likes || 0}
                  </button>
                  <button 
                    onClick={() => toggleExpand(post.id)}
                    className="post-action-comment"
                  >
                    💬 {post.comments?.length || 0}
                  </button>
                  <button 
                    onClick={() => alert('Share feature coming soon!')}
                    className="post-action-share"
                  >
                    Share
                  </button>
                  {expandedPostId !== post.id && (
                    <button 
                      onClick={() => toggleExpand(post.id)}
                      className="post-action-view"
                    >
                      View full post →
                    </button>
                  )}
                  {expandedPostId === post.id && (
                    <button 
                      onClick={() => toggleExpand(post.id)}
                      className="post-action-showless"
                    >
                      Show less ↑
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}

export default HomePage;