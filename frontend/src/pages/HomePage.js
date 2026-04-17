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
      {/* If user is logged in, show Welcome Back section */}
      {user && (
        <div className="welcome-section">
          <div className="welcome-card">
            <h2 className="welcome-title">Welcome Back, {user.name}!</h2>
            <p className="welcome-message">
              Ready to make your next move? Share your programming journey and inspire the community!
            </p>
            <div className="welcome-buttons">
              <Link className="btn-primary auth-btn welcome-btn" to="/create-post">
                + Write Your Story
              </Link>
              <Link className="btn-primary auth-btn welcome-btn" to="/profile">
                Edit Profile
              </Link>
              <Link className="btn-primary auth-btn welcome-btn" to="/game">
                Play Game
              </Link>
            </div>
            <p className="welcome-quote">
              Your voice matters. Every story inspires someone!
            </p>
          </div>
        </div>
      )}

      {/* If user is NOT logged in, show Hero section */}
      {!user && (
        <div className="hero-section">
          <div className="hero-card">
            <div className="hero-grid">
              <div className="hero-content">
                <h1 className="hero-title">Programming, Software & Mobile Game Passion</h1>
                <p className="hero-description">
                  I design clean, structured, and user-friendly solutions inspired by my
                  passion for mobile games and interactive digital experiences.
                </p>
                <Link className="btn-primary auth-btn hero-btn" to="/about">
                  Discover My Journey
                </Link>
              </div>
              <div className="hero-image">
                <img 
                  src={macImage}
                  alt="Programming workspace"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Highlights Section - Only for non-logged in users */}
      {!user && (
        <div className="latest-posts-section" style={{ paddingTop: '0' }}>
          <div className="latest-posts-card">
            <h2 className="posts-title">Key Highlights</h2>
            <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: '40px' }}>
              Core skills and strengths I bring to development
            </p>
            <div className="posts-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div className="post-card" style={{ textAlign: 'center' }}>
                Strong foundation in C, Java, and Python
              </div>
              <div className="post-card" style={{ textAlign: 'center' }}>
                Clean and responsive HTML & CSS
              </div>
              <div className="post-card" style={{ textAlign: 'center' }}>
                Logical problem-solving mindset
              </div>
              <div className="post-card" style={{ textAlign: 'center' }}>
                Continuous learner
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Latest from Your Community Section */}
      <div className="latest-posts-section">
        <div className="latest-posts-card">
          <h2 className="posts-title">Latest from Your Community</h2>
          
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
                      className="post-image"
                    />
                  )}
                  <h3 className="post-title">
                    {post.title}
                  </h3>
                  
                  {/* Show short preview or full content based on expanded state */}
                  {expandedPostId === post.id ? (
                    <>
                      {/* Full Post Content */}
                      <div className="post-full-content">
                        <p>{post.body}</p>
                      </div>
                      
                      {/* Like Button */}
                      <div className="post-reactions">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="reaction-btn"
                        >
                          👍 {post.likes || 0} Likes
                        </button>
                      </div>
                      
                      {/* Comments Section */}
                      <div className="post-comments-section">
                        <h4>Comments ({post.comments?.length || 0})</h4>
                        
                        {post.comments && post.comments.length > 0 ? (
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
                        ) : (
                          <p className="no-comments-message">No comments yet. Be the first to comment!</p>
                        )}
                        
                        {/* Add Comment */}
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
                              className="btn-primary auth-btn" 
                              onClick={() => handleAddComment(post.id)}
                              style={{ marginTop: '10px' }}
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
                      
                      {/* Post Meta */}
                      <p className="post-meta" style={{ marginTop: '15px' }}>
                        By {post.author?.name} · {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                      
                      {/* Actions */}
                      <div className="post-actions">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="post-action-btn"
                        >
                          👍 {post.likes || 0}
                        </button>
                        <button 
                          onClick={() => alert('Share feature coming soon!')}
                          className="post-action-btn"
                        >
                          Share
                        </button>
                        <button 
                          onClick={() => toggleExpand(post.id)}
                          className="post-action-btn"
                        >
                          Show less ↑
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Preview Content */}
                      <p className="post-excerpt">
                        {post.body.length > 100 ? post.body.substring(0, 100) + '...' : post.body}
                      </p>
                      <p className="post-meta">
                        By {post.author?.name} · {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                      
                      {/* Actions */}
                      <div className="post-actions">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="post-action-btn"
                        >
                          👍 {post.likes || 0}
                        </button>
                        <button 
                          onClick={() => toggleExpand(post.id)}
                          className="post-action-btn"
                        >
                          💬 {post.comments?.length || 0}
                        </button>
                        <button 
                          onClick={() => alert('Share feature coming soon!')}
                          className="post-action-btn"
                        >
                          Share
                        </button>
                        <button 
                          onClick={() => toggleExpand(post.id)}
                          className="post-action-btn"
                        >
                          View full post →
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;