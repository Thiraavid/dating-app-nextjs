"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState(18);
  const { login, signup, state } = useApp();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") login(email);
    else signup({ name, email, age, bio });
    router.push("/discover");
  };

  return (
    <main className="center-page auth-page">
      <div className="auth-layout">
        <section className="card auth-copy">
          <p className="badge"><i className="fa-solid fa-lock"></i> Authentication UI</p>
          <h1>{mode === "login" ? "Welcome back!" : "Create your account"}</h1>
        </section>

        <section className="card">
          <div className="tab-switch">
            <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
              <i className="fa-solid fa-key"></i> Login
            </button>
            <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>
              <i className="fa-solid fa-user-plus"></i> Signup
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form">
            {mode === "signup" && (
              <>
                <label>
                  <span><i className="fa-solid fa-user" style={{ marginRight: "0.4rem" }}></i>Full Name</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter your name" />
                </label>
                <label>
                  <span><i className="fa-solid fa-cake-candles" style={{ marginRight: "0.4rem" }}></i>Age</span>
                  <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} min={18} max={60} required />
                </label>
                <label>
                  <span><i className="fa-solid fa-pen-to-square" style={{ marginRight: "0.4rem" }}></i>Bio</span>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} required placeholder="Tell us about yourself..." />
                </label>
              </>
            )}
            <label>
              <span><i className="fa-solid fa-envelope" style={{ marginRight: "0.4rem" }}></i>Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" />
            </label>
            <button className="btn btn-primary" type="submit" style={{ marginTop: "0.5rem" }}>
              <i className={mode === "login" ? "fa-solid fa-arrow-right-to-bracket" : "fa-solid fa-user-plus"}></i>{" "}
              {mode === "login" ? "Login" : "Create account"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
