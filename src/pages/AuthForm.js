import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database"; // for Realtime Database
import { app } from "../firebase"; // adjust path if needed

import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate(); // for redirecting to another page

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const auth = getAuth(app);
  const database = getDatabase(app);

  function handleSubmit(e) {
  e.preventDefault();

  if (isLogin) {
    // 🔐 Login logic
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        alert("Login successful!");
        navigate("/landing");
      })
      .catch((error) => {
        alert(error.message);
      });
  } else {
    // ✅ Signup logic
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Store extra user data like username in Firebase Realtime Database
        set(ref(database, 'users/' + user.uid), {
          username: formData.username,
          email: formData.email,
        });

        alert("Signup successful!");
        navigate("/landing");
      })
      .catch((error) => {
        alert(error.message);
      });
  }
}

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        {!isLogin && (
          <>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </>
        )}

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {!isLogin && (
          <>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit" className="submit-btn">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
}
