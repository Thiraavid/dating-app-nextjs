"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { AppNav } from "@/components/AppNav";
import { useApp } from "@/context/AppContext";

type AdminTab = "overview" | "users" | "reports" | "content";

import { ClientOnly } from "@/components/ClientOnly";

export default function AdminPage() {
  return <ClientOnly><AdminContent /></ClientOnly>;
}

function AdminContent() {
  const { state, toggleSuspendUser, approveReport, removeReport } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  const overviewCards = [
    { label: "Total Users",     value: state.users.length,                                          icon: "fa-solid fa-users",          color: "rgba(108,92,231,0.15)" },
    { label: "Matches Made",    value: state.matches.length,                                        icon: "fa-solid fa-heart",          color: "rgba(255,77,125,0.15)" },
    { label: "Open Reports",    value: state.reports.length,                                        icon: "fa-solid fa-triangle-exclamation", color: "rgba(255,165,0,0.15)" },
    { label: "Pending Reviews", value: state.contentQueue.filter((i) => i.status === "pending").length, icon: "fa-solid fa-file-pen", color: "rgba(0,200,150,0.15)" },
  ];

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "fa-solid fa-chart-pie" },
    { id: "users",    label: "Users",    icon: "fa-solid fa-users" },
    { id: "reports",  label: "Reports",  icon: "fa-solid fa-triangle-exclamation" },
    { id: "content",  label: "Content",  icon: "fa-solid fa-file-pen" },
  ];

  return (
    <main className="app-page">
      <AppNav />
      <section className="single-column">
        <div className="section-top">
          <div>
            <p className="badge"><i className="fa-solid fa-shield-halved"></i> Admin Dashboard</p>
            <h1 style={{ marginTop: "0.5rem" }}>Platform Control Center</h1>
          </div>
        </div>

        <div className="tab-switch" style={{ marginBottom: "2rem" }}>
          {tabs.map((tab) => (
            <button key={tab.id} className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)}>
              <i className={tab.icon}></i> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            <div className="stats-grid">
              {overviewCards.map((item) => (
                <div className="card" key={item.label} style={{ background: item.color }}>
                  <i className={item.icon} style={{ fontSize: "1.8rem", marginBottom: "0.5rem", display: "block" }}></i>
                  <h3 style={{ color: "var(--muted)", fontSize: "0.9rem", fontWeight: 500 }}>{item.label}</h3>
                  <p className="metric" style={{ fontSize: "2.5rem", fontWeight: 800, marginTop: "0.3rem" }}>{item.value}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "2rem" }}>
              <h2 style={{ marginBottom: "1rem" }}><i className="fa-solid fa-users"></i> Recent Users</h2>
              <div className="list-grid">
                {state.users.slice(0, 4).map((user) => (
                  <div className="card" key={user.id} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundImage: `url(${user.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center", flexShrink: 0, border: "2px solid var(--border)" }} />
                    <div>
                      <strong>{user.name}</strong>
                      <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: "0.2rem 0 0" }}>{user.age} · {user.location}</p>
                    </div>
                    <span style={{ marginLeft: "auto", padding: "0.3rem 0.7rem", borderRadius: "999px", fontSize: "0.8rem", background: user.suspended ? "rgba(255,77,77,0.15)" : "rgba(0,200,100,0.15)", color: user.suspended ? "#ff4d4d" : "#00c864" }}>
                      {user.suspended ? "Suspended" : "Active"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "users" && (
          <section className="card">
            <h2 style={{ marginBottom: "1.5rem" }}><i className="fa-solid fa-users"></i> User Management</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>User</th><th>Email</th><th>Age</th><th>Location</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {state.users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundImage: `url(${user.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center", flexShrink: 0 }} />
                          <strong>{user.name}</strong>
                        </div>
                      </td>
                      <td style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{user.email}</td>
                      <td>{user.age}</td>
                      <td style={{ color: "var(--muted)" }}>{user.location}</td>
                      <td>
                        <span style={{ padding: "0.3rem 0.7rem", borderRadius: "999px", fontSize: "0.8rem", background: user.suspended ? "rgba(255,77,77,0.15)" : "rgba(0,200,100,0.15)", color: user.suspended ? "#ff4d4d" : "#00c864" }}>
                          {user.suspended ? "Suspended" : "Active"}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-small btn-secondary" onClick={() => toggleSuspendUser(user.id)}>
                          <i className={user.suspended ? "fa-solid fa-check" : "fa-solid fa-ban"}></i> {user.suspended ? "Activate" : "Suspend"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "reports" && (
          <section className="card">
            <h2 style={{ marginBottom: "1.5rem" }}><i className="fa-solid fa-triangle-exclamation"></i> Reports and Moderation</h2>
            {state.reports.length === 0 ? (
              <div className="empty-state" style={{ padding: "3rem" }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: "3rem", marginBottom: "0.5rem", display: "block", color: "#00c864" }}></i>
                <h3>All clear!</h3>
                <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>No open reports at this time.</p>
              </div>
            ) : (
              <div className="stack-list">
                {state.reports.map((report) => (
                  <div className="stack-item" key={report.id}>
                    <div>
                      <span style={{ padding: "0.25rem 0.6rem", borderRadius: "999px", fontSize: "0.8rem", background: "rgba(255,165,0,0.15)", color: "#ffa500" }}>{report.type}</span>
                      <p style={{ color: "var(--muted)", margin: "0.4rem 0 0" }}>{report.reason}</p>
                    </div>
                    <div className="action-row">
                      <button className="btn btn-small btn-primary" onClick={() => approveReport(report.id)}>
                        <i className="fa-solid fa-check"></i> Resolve
                      </button>
                      <button className="btn btn-small btn-secondary" onClick={() => removeReport(report.id)}>
                        <i className="fa-solid fa-trash"></i> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "content" && (
          <section className="card">
            <h2 style={{ marginBottom: "1.5rem" }}><i className="fa-solid fa-file-pen"></i> Content Review Panel</h2>
            <div className="review-grid">
              {state.contentQueue.map((item) => (
                <div className="review-card" key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <p style={{ color: "var(--muted)", margin: "0.3rem 0" }}>{item.description}</p>
                  </div>
                  <span style={{ padding: "0.35rem 0.8rem", borderRadius: "999px", fontSize: "0.8rem", whiteSpace: "nowrap",
                    background: item.status === "approved" ? "rgba(0,200,100,0.15)" : item.status === "rejected" ? "rgba(255,77,77,0.15)" : "rgba(255,165,0,0.15)",
                    color: item.status === "approved" ? "#00c864" : item.status === "rejected" ? "#ff4d4d" : "#ffa500" }}>
                    <i className={item.status === "approved" ? "fa-solid fa-check" : item.status === "rejected" ? "fa-solid fa-xmark" : "fa-solid fa-clock"}></i> {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
