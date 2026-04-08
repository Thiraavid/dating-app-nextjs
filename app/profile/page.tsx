"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { useApp } from "@/context/AppContext";

export default function ProfilePage() {
  const { state, updateCurrentUser, logout } = useApp();
  const router = useRouter();
  const user = state.currentUser;
  const [saved, setSaved] = useState(false);

  if (!user) { router.push("/auth"); return null; }

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const imageUrl = user.imageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&q=80";

  return (
    <main className="app-page">
      <AppNav />
      <section className="single-column">
        <div className="card">

          {/* Header */}
          <div className="profile-page-header">
            <div>
              <p className="badge"><i className="fa-solid fa-user"></i> Profile</p>
              <h1 style={{ marginTop: "0.5rem" }}>Edit Your Profile</h1>
            </div>
            {saved && (
              <div className="saved-toast">
                <i className="fa-solid fa-check"></i> Saved!
              </div>
            )}
          </div>

          {/* Photo + Form grid */}
          <div className="profile-edit-grid">

            {/* Photo column */}
            <div className="profile-photo-col">
              <div className="profile-photo-box" style={{ backgroundImage: `url(${imageUrl})` }} />
              <p className="profile-photo-hint">
                <i className="fa-solid fa-camera"></i> Photo from Unsplash
              </p>
            </div>

            {/* Form column */}
            <div className="form two-col">
              <label>
                <span><i className="fa-solid fa-user" style={{ marginRight: "0.4rem" }}></i>Name</span>
                <input value={user.name} onChange={(e) => { updateCurrentUser({ name: e.target.value }); handleSave(); }} placeholder="Your name" />
              </label>
              <label>
                <span><i className="fa-solid fa-cake-candles" style={{ marginRight: "0.4rem" }}></i>Age</span>
                <input type="number" value={user.age} onChange={(e) => { updateCurrentUser({ age: Number(e.target.value) }); handleSave(); }} min={18} max={60} />
              </label>
              <label>
                <span><i className="fa-solid fa-location-dot" style={{ marginRight: "0.4rem" }}></i>Location</span>
                <input value={user.location} onChange={(e) => { updateCurrentUser({ location: e.target.value }); handleSave(); }} placeholder="Your city" />
              </label>
              <label>
                <span><i className="fa-solid fa-route" style={{ marginRight: "0.4rem" }}></i>Distance (km)</span>
                <input type="number" value={user.distance} onChange={(e) => { updateCurrentUser({ distance: Number(e.target.value) }); handleSave(); }} min={1} max={100} />
              </label>
              <label className="full-width">
                <span><i className="fa-solid fa-pen-to-square" style={{ marginRight: "0.4rem" }}></i>Bio</span>
                <textarea rows={4} value={user.bio} onChange={(e) => { updateCurrentUser({ bio: e.target.value }); handleSave(); }} placeholder="Tell others about yourself..." />
              </label>
              <label className="full-width">
                <span><i className="fa-solid fa-tags" style={{ marginRight: "0.4rem" }}></i>Interests (comma separated)</span>
                <input value={user.interests.join(", ")} onChange={(e) => { updateCurrentUser({ interests: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }); handleSave(); }} placeholder="Travel, Music, Coffee..." />
              </label>
            </div>
          </div>

          {/* Stats */}
          <div className="profile-stats-box">
            <h3 style={{ margin: "0 0 1rem" }}><i className="fa-solid fa-chart-bar"></i> Profile Stats</h3>
            <div className="profile-stats-grid">
              <div className="profile-stat">
                <p className="stat-label">Match Score</p>
                <p className="stat-value">{user.matchScore}%</p>
              </div>
              <div className="profile-stat">
                <p className="stat-label">Total Matches</p>
                <p className="stat-value">{state.matches.length}</p>
              </div>
              <div className="profile-stat">
                <p className="stat-label">Interests</p>
                <p className="stat-value">{user.interests.length}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="profile-actions">
            <button className="btn btn-secondary" onClick={() => router.push("/discover")}>
              <i className="fa-solid fa-arrow-left"></i> Back
            </button>
            <button className="btn btn-primary" onClick={() => { if (confirm("Are you sure you want to logout?")) { logout(); router.push("/auth"); } }}>
              <i className="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>

        </div>
      </section>
    </main>
  );
}
