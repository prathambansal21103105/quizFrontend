import React, { useState } from "react";
import styles from "./Login.module.css";
import imageSrc from '../login.gif';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    setError("");
    
    const userData = { email, password };
    console.log(userData);
    console.log("http://localhost:8080/auth/login?" + "email=" + email + "&password=" + password);
    try {
        const res = await fetch("http://localhost:8080/auth/login?" + "email=" + email + "&password=" + password, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        const resBody = await res.json();
        if (!res.ok) {
            setError(resBody.message|| "Login failed");
        }
        else{
            const token = await resBody.message;
            const flag = await resBody.flag;
            console.log(resBody);
            console.log(token);
            console.log(flag);
            login(token,flag,email,password);
            navigate("/profile");
        }
    } catch (error) {
      setError("Something went wrong. Please try again." + error.message());
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div className={styles.container}>
    <div className={styles.formWrapper}>
      <h2 className={styles.title}>Login</h2>
      {error && <p className={styles.error}>{error}</p>}
      <img src={imageSrc} className={styles.gif} alt="how to use"/>
      <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
    </div>
  );
};

export default Login;