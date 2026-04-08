"use client";

import { useRouter } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { useApp } from "@/context/AppContext";

export default function MatchesPage() {
  const { state } = useApp();
  const router = useRouter();

  if (!state.currentUser) { router.push("/auth"); return null; }

  return (
    <main className="app-page">
      <AppNav />
      <section className="single-column">
        <div className="section-top">
          <div>
            <p className="badge"><i className="fa-solid fa-heart"></i> Match System</p>
            <h1 style={{ marginTop: "0.5rem" }}>Your Matches</h1>
            <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
              {state.matches.length} {state.matches.length === 1 ? "match" : "matches"} found
            </p>
          </div>
        </div>

        <div className="list-grid">
          {state.matches.length > 0 ? (
            state.matches.map((match) => {
              const imageUrl = match.imageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&q=80";
              return (
                <div className="card" key={match.id} style={{ overflow: "hidden" }}>
                  <div style={{ width: "100%", height: "280px", backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: "16px", marginBottom: "1rem", position: "relative" }}>
                    <div className="image-overlay">
                      <h3 style={{ margin: 0 }}>{match.name}, {match.age}</h3>
                      <p style={{ margin: "0.3rem 0 0", opacity: 0.9 }}>
                        <i className="fa-solid fa-location-dot"></i> {match.location}
                      </p>
                    </div>
                  </div>
                  <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>{match.bio}</p>
                  <div className="tag-row" style={{ marginBottom: "1rem" }}>
                    {match.interests.map((i) => <span key={i}><i className="fa-solid fa-tag"></i> {i}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <span className="match-score"><i className="fa-solid fa-star"></i> {match.matchScore}% Match</span>
                    <span style={{ padding: "0.45rem 0.8rem", borderRadius: "999px", background: "rgba(108,92,231,0.15)", fontSize: "0.9rem", color: "var(--accent-2)" }}>
                      <i className="fa-solid fa-location-dot"></i> {match.distance} km away
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="card empty-state" style={{ padding: "4rem 2rem", gridColumn: "1 / -1" }}>
              <i className="fa-solid fa-heart-crack" style={{ fontSize: "3rem", marginBottom: "1rem", display: "block", color: "var(--accent)" }}></i>
              <h3>No matches yet</h3>
              <p style={{ marginTop: "0.5rem" }}>Start swiping to create new connections.</p>
              <button className="btn btn-primary" onClick={() => router.push("/discover")} style={{ marginTop: "1.5rem" }}>
                <i className="fa-solid fa-fire"></i> Start Swiping
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
