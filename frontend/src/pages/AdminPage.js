// pages/AdminPage.js
import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState('users');

  const { user } = useAuth();
  const navigate = useNavigate();

  // LOAD DATA FROM LOCALSTORAGE
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    setUsers(storedUsers);

    const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    setPosts(storedPosts);
  }, [user]);

  // TOGGLE USER STATUS
  const toggleStatus = (userId) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          status: u.status === 'active' ? 'inactive' : 'active'
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
  };

  // REMOVE POST
  const removePost = (postId) => {
    const updatedPosts = posts.filter(p => p.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  // NOT LOGGED IN
  if (!user) {
    return (
      <div className="admin-container">
        <div className="admin-card" style={{ textAlign: 'center' }}>
          <h2 className="admin-title">⚠️ Not Logged In</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '25px' }}>
            You must log in to access the admin dashboard.
          </p>
          <button className="btn-primary auth-btn" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // NOT ADMIN
  if (user.role !== "admin") {
    return (
      <div className="admin-container">
        <div className="admin-card" style={{ textAlign: 'center' }}>
          <h2 className="admin-title">🚫 Access Denied</h2>
          <p style={{ color: 'var(--muted)' }}>
            You are not authorized to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h1 className="admin-title">Admin Dashboard ⚙️</h1>

        {/* Tab Buttons */}
        <div className="admin-tabs">
          <button 
            onClick={() => setTab('users')} 
            className={`admin-tab-btn ${tab === 'users' ? 'active' : ''}`}
          >
            👥 Members ({users.length})
          </button>
          <button 
            onClick={() => setTab('posts')} 
            className={`admin-tab-btn ${tab === 'posts' ? 'active' : ''}`}
          >
            📝 Posts ({posts.length})
          </button>
        </div>

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="admin-empty-state">No users found</td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role === 'admin' ? 'admin' : 'user'}`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${u.status || 'active'}`}>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => toggleStatus(u.id)} 
                          className={`admin-action-btn ${(u.status || 'active') === 'active' ? 'deactivate' : 'activate'}`}
                        >
                          {(u.status || 'active') === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Posts Tab */}
        {tab === 'posts' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Likes</th>
                  <th>Comments</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="admin-empty-state">No posts found</td>
                  </tr>
                ) : (
                  posts.map(p => (
                    <tr key={p.id}>
                      <td>{p.title}</td>
                      <td>{p.author?.name}</td>
                      <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td>👍 {p.likes || 0}</td>
                      <td>💬 {p.comments?.length || 0}</td>
                      <td>
                        <button 
                          onClick={() => removePost(p.id)} 
                          className="admin-action-btn remove"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;