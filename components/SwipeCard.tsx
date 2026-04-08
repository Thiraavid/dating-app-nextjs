"use client";

import { useEffect, useRef, useState } from "react";
import { UserProfile } from "@/types";

type Props = { profile: UserProfile; onLike: () => void; onDislike: () => void };

const THRESHOLD = 100;

export function SwipeCard({ profile, onLike, onDislike }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const dragging = useRef(false);

  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [flyOut, setFlyOut] = useState<"left" | "right" | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const imageUrl = profile.imageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&q=80";

  useEffect(() => {
    if (!sessionStorage.getItem("swipe-guide-seen")) {
      setShowGuide(true);
      sessionStorage.setItem("swipe-guide-seen", "1");
    }
  }, []);

  useEffect(() => {
    if (!showGuide) return;
    const t = setTimeout(() => setShowGuide(false), 3200);
    return () => clearTimeout(t);
  }, [showGuide]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
    cardRef.current?.setPointerCapture(e.pointerId);
    setShowGuide(false);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setDragX(e.clientX - startX.current);
    setDragY(e.clientY - startY.current);
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (dragX > THRESHOLD) triggerFly("right");
    else if (dragX < -THRESHOLD) triggerFly("left");
    else { setDragX(0); setDragY(0); }
  };

  const triggerFly = (dir: "left" | "right") => {
    setFlyOut(dir);
    setTimeout(() => { if (dir === "right") onLike(); else onDislike(); }, 350);
  };

  const rotate = dragX / 10;
  const likeOpacity = Math.min(Math.max(dragX / THRESHOLD, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragX / THRESHOLD, 0), 1);

  const cardStyle: React.CSSProperties = flyOut
    ? { transform: `translateX(${flyOut === "right" ? "120vw" : "-120vw"}) rotate(${flyOut === "right" ? 30 : -30}deg)`, transition: "transform 0.35s ease" }
    : dragX !== 0 || dragY !== 0
    ? { transform: `translate(${dragX}px,${dragY}px) rotate(${rotate}deg)`, transition: "none", cursor: "grabbing" }
    : { transform: "translate(0,0) rotate(0deg)", transition: "transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275)", cursor: "grab" };

  return (
    <div style={{ position: "relative", userSelect: "none" }}>
      {showGuide && (
        <div className="swipe-guide">
          <div className="swipe-guide-inner">
            <span className="guide-nope"><i className="fa-solid fa-xmark"></i> NOPE</span>
            <div className="guide-hand"><i className="fa-solid fa-hand-pointer"></i></div>
            <span className="guide-like">LIKE <i className="fa-solid fa-heart"></i></span>
          </div>
          <p className="guide-hint">Swipe left or right to decide</p>
        </div>
      )}

      <div ref={cardRef} className="swipe-card" style={cardStyle}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>

        <div className="stamp stamp-nope" style={{ opacity: nopeOpacity }}>NOPE</div>
        <div className="stamp stamp-like" style={{ opacity: likeOpacity }}>LIKE</div>

        <div className="swipe-photo" style={{ backgroundImage: `url(${imageUrl})` }}>
          <div className="swipe-photo-overlay">
            <h2>{profile.name}, {profile.age}</h2>
            <p><i className="fa-solid fa-location-dot"></i> {profile.location} · {profile.distance} km away</p>
          </div>
        </div>

        <div className="swipe-info">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              <i className="fa-solid fa-circle-info"></i> About
            </p>
            <span className="match-score">
              <i className="fa-solid fa-star"></i> {profile.matchScore}% Match
            </span>
          </div>
          <p style={{ marginTop: "0.5rem", lineHeight: 1.6 }}>{profile.bio}</p>
          <div className="tag-row" style={{ marginTop: "0.75rem" }}>
            {profile.interests.map((i) => (
              <span key={i}><i className="fa-solid fa-tag"></i> {i}</span>
            ))}
          </div>
        </div>

        <div className="swipe-btns">
          <button className="circle-btn nope-btn" onClick={() => triggerFly("left")} title="Pass">
            <i className="fa-solid fa-xmark"></i>
          </button>
          <button className="circle-btn primary like-btn" onClick={() => triggerFly("right")} title="Like">
            <i className="fa-solid fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
