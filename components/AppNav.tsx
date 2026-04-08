"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

const links = [
  { href: "/discover", label: "Discover",  icon: "fa-solid fa-fire" },
  { href: "/matches",  label: "Matches",   icon: "fa-solid fa-heart" },
  { href: "/chat",     label: "Chat",      icon: "fa-solid fa-message" },
  { href: "/profile",  label: "Profile",   icon: "fa-solid fa-user" },
  { href: "/admin",    label: "Admin",     icon: "fa-solid fa-shield-halved" },
];

export function AppNav() {
  const pathname = usePathname();
  const { state, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="topbar">
        <Link href="/" className="brand">GlowUp</Link>

        <div className="topbar-links desktop-nav">
          {links.map((link) => (
            <Link href={link.href} key={link.href} className={pathname === link.href ? "active" : ""}>
              <i className={link.icon}></i> {link.label}
            </Link>
          ))}
        </div>

        <div className="topbar-user">
          <span className="topbar-username">
            <i className="fa-solid fa-circle-user"></i> {state.currentUser?.name ?? "Guest"}
          </span>
          <button className="btn btn-small btn-secondary desktop-only" onClick={logout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <i className={menuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          {links.map((link) => (
            <Link
              href={link.href} key={link.href}
              className={`mobile-menu-link ${pathname === link.href ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              <i className={link.icon}></i> {link.label}
            </Link>
          ))}
          <button className="btn btn-secondary" style={{ marginTop: "0.5rem" }}
            onClick={() => { logout(); setMenuOpen(false); }}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      )}

      <div className="bottom-nav">
        {links.map((link) => (
          <Link href={link.href} key={link.href}
            className={`bottom-nav-item ${pathname === link.href ? "active" : ""}`}>
            <i className={`${link.icon} bottom-nav-icon`}></i>
            <span className="bottom-nav-label">{link.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
