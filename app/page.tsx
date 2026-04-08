"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";

const features = [
  {
    icon: "fa-solid fa-heart",
    title: "Swipe with confidence",
    text: "Fast card-based profile discovery with smart preferences, age range, distance, and interest filters.",
  },
  {
    icon: "fa-solid fa-message",
    title: "Real-time style chat experience",
    text: "Mock chat interface for matches with message history stored in local storage for easy testing.",
  },
  {
    icon: "fa-solid fa-shield-halved",
    title: "Admin dashboard included",
    text: "Manage users, reports, moderation, approvals, and analytics from one responsive control panel.",
  },
];

export default function HomePage() {
  const { state } = useApp();
  const currentUser = state.currentUser;

  return (
    <main className="page-shell">
      <header className="hero">
        <nav className="nav">
          <div className="brand">GlowUp</div>
          <div className="nav-links">
            <Link href="#features">Features</Link>
            <Link href="#how-it-works">How it works</Link>
            <Link href="/auth" className="btn btn-primary" style={{ padding: "0.7rem 1.2rem" }}>
              {currentUser ? "Continue" : "Get Started"}
            </Link>
          </div>
        </nav>

        <section className="hero-grid">
          <div>
            <p className="badge"><i className="fa-solid fa-star"></i> Modern Dating App UI</p>
            <h1>Find your perfect match with style and confidence</h1>
            <p className="hero-text">
              A complete dating app demo featuring authentication, profile management, swipe interface,
              real-time chat, advanced filters, and a powerful admin dashboard. Built with Next.js and TypeScript.
            </p>
            <div className="hero-actions">
              <Link href={currentUser ? "/discover" : "/auth"} className="btn btn-primary">
                <i className={currentUser ? "fa-solid fa-rocket" : "fa-solid fa-heart"}></i>{" "}
                {currentUser ? "Open App" : "Get Started"}
              </Link>
              <Link href="/admin" className="btn btn-secondary">
                <i className="fa-solid fa-shield-halved"></i> Admin Dashboard
              </Link>
            </div>
            <div className="stats">
              <div>
                <strong>{state.users.length}+</strong>
                <span>Active Users</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Responsive</span>
              </div>
              <div>
                <strong>Local</strong>
                <span>Mock Data</span>
              </div>
            </div>
          </div>

          <div className="phone-preview">
            <div className="phone-card">
              <div className="preview-top">
                <span><i className="fa-solid fa-location-dot"></i> Nearby · 8 km</span>
                <span className="match-score">98% Match</span>
              </div>
              <div
                className="preview-image"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&q=80)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <h3>Ananya, 24</h3>
              <p>Designer · Loves travel, books, coffee, and beach sunsets.</p>
              <div className="preview-tags">
                <span><i className="fa-solid fa-plane"></i> Travel</span>
                <span><i className="fa-solid fa-music"></i> Music</span>
                <span><i className="fa-solid fa-mug-hot"></i> Coffee</span>
              </div>
              <div className="preview-actions">
                <button className="circle-btn"><i className="fa-solid fa-xmark"></i></button>
                <button className="circle-btn primary"><i className="fa-solid fa-heart"></i></button>
              </div>
            </div>
          </div>
        </section>
      </header>

      <section id="features" className="section">
        <div className="section-heading">
          <p className="badge"><i className="fa-solid fa-bullseye"></i> Core Features</p>
          <h2>Everything needed to demo a modern dating product</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="card">
              <div className="feature-icon">
                <i className={feature.icon}></i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="section">
        <div className="section-heading">
          <p className="badge"><i className="fa-solid fa-list-check"></i> Flow</p>
          <h2>How this app works</h2>
        </div>
        <div className="steps-grid">
          <div className="card">
            <div className="step-num">1</div>
            <p>Create account and set profile preferences.</p>
          </div>
          <div className="card">
            <div className="step-num">2</div>
            <p>Browse profiles in the swipe interface.</p>
          </div>
          <div className="card">
            <div className="step-num">3</div>
            <p>Like users, create matches, and open chats.</p>
          </div>
          <div className="card">
            <div className="step-num">4</div>
            <p>Admin reviews users, reports, and content submissions.</p>
          </div>
        </div>
      </section>

      <footer style={{
        textAlign: "center", padding: "3rem 1.5rem",
        borderTop: "1px solid var(--border)", color: "var(--muted)",
      }}>
        <p>Built with Next.js, TypeScript, and React Context API</p>
        <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>© 2024 GlowUp Dating. Demo project.</p>
      </footer>
    </main>
  );
}
