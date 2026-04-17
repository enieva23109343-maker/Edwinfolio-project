// pages/ProfilePage.js
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [pic, setPic] = useState(null);
  const [picPreview, setPicPreview] = useState(null);
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Password visibility states
  const [showCurPw, setShowCurPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Convert image to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setMsg("");
    setIsError(false);
    setLoading(true);

    try {
      console.log("Starting profile update...");
      
      // Convert image to Base64 if exists
      let imageBase64 = null;
      if (pic) {
        console.log("Converting image to Base64...");
        imageBase64 = await convertToBase64(pic);
        console.log("Image converted successfully");
      }
      
      // Get existing users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      console.log("Current users:", storedUsers);
      
      // Update user info
      const updatedUsers = storedUsers.map(u => {
        if (u.id === user.id) {
          return {
            ...u,
            name: name,
            bio: bio,
            profilePic: imageBase64 || (u.profilePic || null)
          };
        }
        return u;
      });
      
      localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
      console.log("Updated users saved to localStorage");

      // Update current user in state and localStorage
      const updatedUser = {
        ...user,
        name: name,
        bio: bio,
        profilePic: imageBase64 || (user.profilePic || null)
      };
      
      // Use setUser to update
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      console.log("Profile updated successfully:", updatedUser);

      setMsg("Profile updated successfully!");
      setIsError(false);
      setPicPreview(null);
      setPic(null);
      
      // Clear file input
      const fileInput = document.getElementById('profilePic');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error("Profile update error:", err);
      setMsg("Error updating profile: " + err.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setMsg("");
    setIsError(false);
    setLoading(true);

    try {
      // Get existing users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const currentUser = storedUsers.find(u => u.id === user.id);
      
      // Verify current password
      if (currentUser.password !== curPw) {
        setMsg("Current password is incorrect");
        setIsError(true);
        setLoading(false);
        return;
      }

      if (newPw.length < 6) {
        setMsg("New password must be at least 6 characters");
        setIsError(true);
        setLoading(false);
        return;
      }

      // Update password
      const updatedUsers = storedUsers.map(u => {
        if (u.id === user.id) {
          return { ...u, password: newPw };
        }
        return u;
      });
      
      localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));

      setMsg("Password changed successfully!");
      setIsError(false);
      setCurPw("");
      setNewPw("");
      setShowCurPw(false);
      setShowNewPw(false);
      
    } catch (err) {
      console.error("Password change error:", err);
      setMsg("Error changing password");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Image selected:", file.name, file.type, file.size);
      setPic(file);
      setPicPreview(URL.createObjectURL(file));
    }
  };

  // Use profilePic from user (Base64) or preview or placeholder
  const picSrc = picPreview || (user?.profilePic
    ? user.profilePic
    : "https://via.placeholder.com/120?text=No+Image");

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">My Profile</h2>

        <div className="profile-pic-container">
          <img src={picSrc} alt="Profile" className="profile-pic" />
        </div>

        {msg && (
          <div className={isError ? "profile-error" : "profile-message"}>
            {msg}
          </div>
        )}

        {/* PROFILE FORM */}
        <form onSubmit={handleProfile} className="profile-form-section">
          <h3 className="profile-form-title">Edit Profile</h3>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Display name"
            className="profile-input"
            required
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Short bio..."
            className="profile-textarea"
            rows="3"
          />

          <input
            id="profilePic"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="profile-file-input"
          />

          <button 
            type="submit" 
            className="profile-save-btn"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>

        {/* PASSWORD FORM */}
        <form onSubmit={handlePassword} className="profile-form-section">
          <h3 className="profile-form-title">Change Password</h3>

          {/* Current Password Field with Eye Icon */}
          <div className="profile-password-wrapper">
            <input
              type={showCurPw ? "text" : "password"}
              placeholder="Current password"
              value={curPw}
              onChange={(e) => setCurPw(e.target.value)}
              required
              className="profile-input"
            />
            <button
              type="button"
              className="profile-eye-button"
              onClick={() => setShowCurPw(!showCurPw)}
            >
              {showCurPw ? "◉" : "⚬"}
            </button>
          </div>

          {/* New Password Field with Eye Icon */}
          <div className="profile-password-wrapper">
            <input
              type={showNewPw ? "text" : "password"}
              placeholder="New password (min. 6 characters)"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              required
              minLength={6}
              className="profile-input"
            />
            <button
              type="button"
              className="profile-eye-button"
              onClick={() => setShowNewPw(!showNewPw)}
            >
              {showNewPw ? "◉" : "⚬"}
            </button>
          </div>

          <button 
            type="submit" 
            className="profile-save-btn"
            disabled={loading}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;