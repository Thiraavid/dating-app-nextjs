"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { SwipeCard } from "@/components/SwipeCard";
import { useApp } from "@/context/AppContext";

export default function DiscoverPage() {
  const { state, likeUser, dislikeUser, updateFilters } = useApp();
  const router = useRouter();

  const currentCard = useMemo(() => state.filteredProfiles[0], [state.filteredProfiles]);

  useEffect(() => {
    if (!state.currentUser) router.push("/auth");
  }, [state.currentUser, router]);

  if (!state.currentUser) return null;

  return (
    <main className="app-page">
      <AppNav />
      <section className="content-grid">
        <aside className="card sidebar">
          <p className="badge"><i className="fa-solid fa-magnifying-glass"></i> Filters</p>
          <h2 style={{ margin: '1rem 0' }}>Search & Filter</h2>

          <div className="form">
            <label>
              Search by name or interest
              <input
                value={state.filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                placeholder="Search..."
              />
            </label>

            <label>
              Min age: <strong style={{ color: 'var(--accent)' }}>{state.filters.minAge}</strong>
              &nbsp;— Max: <strong style={{ color: 'var(--accent)' }}>{state.filters.maxAge}</strong>
              <input type="range" min={18} max={45}
                value={state.filters.minAge}
                onChange={(e) => updateFilters({ minAge: Number(e.target.value) })}
                style={{ width: '100%', marginTop: '0.5rem', accentColor: 'var(--accent)' }}
              />
              <input type="range" min={18} max={50}
                value={state.filters.maxAge}
                onChange={(e) => updateFilters({ maxAge: Number(e.target.value) })}
                style={{ width: '100%', marginTop: '0.4rem', accentColor: 'var(--accent-2)' }}
              />
            </label>

            <label>
              Max distance: <strong style={{ color: 'var(--accent)' }}>{state.filters.distance} km</strong>
              <input type="range" min={1} max={50}
                value={state.filters.distance}
                onChange={(e) => updateFilters({ distance: Number(e.target.value) })}
                style={{ width: '100%', marginTop: '0.5rem', accentColor: 'var(--accent)' }}
              />
            </label>

            <label>
              Show
              <select
                value={state.filters.gender}
                onChange={(e) => updateFilters({ gender: e.target.value as 'all' | 'female' | 'male' })}
                className="filter-select"
              >
                <option value="all">Everyone</option>
                <option value="female">Women</option>
                <option value="male">Men</option>
              </select>
            </label>
          </div>

          <div style={{
            marginTop: '1.5rem', padding: '1rem', borderRadius: '16px',
            background: 'rgba(255,77,125,0.08)', border: '1px solid rgba(255,77,125,0.15)'
          }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}><i className="fa-solid fa-heart"></i> <strong>{state.matches.length}</strong> matches so far</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '0.3rem' }}><i className="fa-solid fa-users"></i> <strong>{state.filteredProfiles.length}</strong> profiles available</p>
          </div>
        </aside>

        <section className="swipe-area">
          <div className="section-top">
            <div>
              <p className="badge"><i className="fa-solid fa-fire"></i> Swipe Interface</p>
              <h1 style={{ marginTop: '0.5rem' }}>Discover Profiles</h1>
            </div>
          </div>

          {currentCard ? (
            <SwipeCard
              key={currentCard.id}
              profile={currentCard}
              onLike={() => likeUser(currentCard.id)}
              onDislike={() => dislikeUser(currentCard.id)}
            />
          ) : (
            <div className="card empty-state" style={{ padding: '4rem 2rem' }}>
              <i className="fa-solid fa-heart-crack" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block', color: 'var(--accent)' }}></i>
              <h3>You&apos;ve seen everyone!</h3>
              <p style={{ marginTop: '0.5rem' }}>Try adjusting filters or open chats with your matches.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
