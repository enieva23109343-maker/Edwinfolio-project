// context/AuthContext.js
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load users on mount
  useEffect(() => {
    // Check if mockUsers exists in localStorage
    let savedUsers = localStorage.getItem("mockUsers");
    
    if (!savedUsers) {
      // Create default admin user
      const defaultUsers = [
        {
          id: 1,
          name: "Admin User",
          email: "admin@thefolio.com",
          password: "Admin@1234",
          role: "admin",
          bio: "Site Administrator",
          profilePic: null
        }
      ];
      localStorage.setItem("mockUsers", JSON.stringify(defaultUsers));
      console.log("Default admin user created:", defaultUsers);
    } else {
      console.log("Existing users found:", JSON.parse(savedUsers));
    }

    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log("Restored logged in user:", JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // Login function - FIXED: Always get fresh users from localStorage
  const login = async (email, password) => {
    try {
      console.log("=== LOGIN ATTEMPT ===");
      console.log("Email:", email);
      console.log("Password:", password);
      
      // Always get the latest users from localStorage, not from state
      const currentUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]");
      console.log("Current users in system:", currentUsers);
      
      const foundUser = currentUsers.find(u => u.email === email && u.password === password);
      
      console.log("Found user:", foundUser);
      
      if (!foundUser) {
        console.log("No user found with these credentials");
        throw new Error("Invalid email or password");
      }
      
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role || "user",
        bio: foundUser.bio || "",
        profilePic: foundUser.profilePic || null
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("LOGIN SUCCESSFUL! User data saved:", userData);
      return userData;
    } catch (error) {
      console.error("Login error:", error.message);
      throw new Error(error.message);
    }
  };

  // Register function - FIXED: Always get fresh users from localStorage
  const register = async (name, email, password) => {
    try {
      console.log("=== REGISTER ATTEMPT ===");
      console.log("Name:", name, "Email:", email);
      
      // Always get the latest users from localStorage
      const currentUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]");
      
      const existingUser = currentUsers.find(u => u.email === email);
      if (existingUser) {
        throw new Error("Email already registered");
      }
      
      // Check if this is an admin email
      const isAdmin = email === "admin@gmail.com" || email === "admin@thefolio.com";
      
      const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        role: isAdmin ? "admin" : "user",
        bio: "",
        profilePic: null
      };
      
      const updatedUsers = [...currentUsers, newUser];
      localStorage.setItem("mockUsers", JSON.stringify(updatedUsers));
      console.log("New user registered:", newUser);
      console.log("All users now:", updatedUsers);
      
      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        bio: newUser.bio,
        profilePic: newUser.profilePic
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("REGISTER SUCCESSFUL! User logged in:", userData);
      return userData;
    } catch (error) {
      console.error("Register error:", error.message);
      throw new Error(error.message);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log("Logging out...");
      setUser(null);
      localStorage.removeItem("user");
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error.message);
      throw new Error("Logout failed");
    }
  };

  // Update user function - FIXED
  const updateUser = (updatedUserData) => {
    console.log("Updating user:", updatedUserData);
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    
    const currentUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]");
    const updatedUsers = currentUsers.map(u => {
      if (u.id === updatedUserData.id) {
        return {
          ...u,
          name: updatedUserData.name,
          bio: updatedUserData.bio,
          profilePic: updatedUserData.profilePic
        };
      }
      return u;
    });
    
    localStorage.setItem("mockUsers", JSON.stringify(updatedUsers));
    console.log("User updated in storage");
  };

  const value = {
    user,
    setUser: updateUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}