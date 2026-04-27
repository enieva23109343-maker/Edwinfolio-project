// context/AuthContext.js
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]); // Move to state

  useEffect(() => {
  let savedUsers = JSON.parse(localStorage.getItem("mockUsers"));

  // FIX: check if null OR empty array
  if (!savedUsers || savedUsers.length === 0) {
    const defaultUsers = [
      {
        id: 1,
        name: "Admin User",
        email: "admin@thefolio.com",
        password: "Admin@1234",
        role: "admin",
        bio: "",
        profilePic: null
      }
    ];

    localStorage.setItem("mockUsers", JSON.stringify(defaultUsers));
    setUsers(defaultUsers);
    console.log("✅ Default admin created");
  } else {
    setUsers(savedUsers);
    console.log("✅ Users loaded:", savedUsers);
  }

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  setLoading(false);
}, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log("Login attempt:", email, password);
      console.log("Available users:", users);
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      console.log("Found user:", foundUser);
      
      if (!foundUser) {
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
      console.log("Login successful, redirecting...");
      return userData;
    } catch (error) {
      console.error("Login error:", error.message);
      throw new Error(error.message);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        throw new Error("Email already registered");
      }
      
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
      
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem("mockUsers", JSON.stringify(updatedUsers));
      
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
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      throw new Error("Logout failed");
    }
  };

  // Update user function
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    
    const updatedUsers = users.map(u => {
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
    
    setUsers(updatedUsers);
    localStorage.setItem("mockUsers", JSON.stringify(updatedUsers));
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