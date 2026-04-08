"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { useApp } from "@/context/AppContext";
import { generateAIReply } from "@/lib/aiReply";

export default function ChatPage() {
  const { state, sendMessage } = useApp();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(state.matches[0]?.id ?? null);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedMatch = state.matches.find((m) => m.id === selectedId) ?? null;
  const chatMessages = useMemo(() => {
    if (!selectedId) return [];
    return state.messages[selectedId] ?? [];
  }, [selectedId, state.messages]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, isTyping]);
  useEffect(() => { if (!state.currentUser) router.push("/auth"); }, [state.currentUser, router]);

  if (!state.currentUser) return null;

  const onSend = () => {
    if (!selectedId || !message.trim() || !selectedMatch) return;

    const userText = message.trim();
    sendMessage(selectedId, userText);
    setMessage("");

    // show typing indicator then send AI reply
    setIsTyping(true);
    const delay = 1000 + Math.random() * 1500; // 1–2.5s feels natural
    setTimeout(() => {
      const reply = generateAIReply(userText, selectedMatch);
      sendMessage(selectedId, `__ai__${reply}`); // prefix so context knows it's "them"
      setIsTyping(false);
    }, delay);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
  };

  return (
    <main className="app-page">
      <AppNav />
      <section className="chat-layout">
        <aside className="card chat-sidebar">
          <p className="badge"><i className="fa-solid fa-message"></i> Chats</p>
          <h2 style={{ margin: "1rem 0" }}>Conversations</h2>

          {state.matches.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--muted)" }}>
              <i className="fa-solid fa-heart-crack" style={{ fontSize: "2rem", marginBottom: "0.5rem", display: "block" }}></i>
              <p>No matches yet</p>
            </div>
          ) : (
            <div className="chat-user-list">
              {state.matches.map((match) => {
                const imageUrl = match.imageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80";
                const lastMsg = state.messages[match.id]?.slice(-1)[0];
                const lastText = lastMsg?.text?.replace("__ai__", "") ?? match.location;
                return (
                  <button key={match.id} className={`chat-user ${selectedId === match.id ? "active" : ""}`} onClick={() => setSelectedId(match.id)}>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center", flexShrink: 0, border: "2px solid var(--border)" }} />
                      <div style={{ textAlign: "left", overflow: "hidden" }}>
                        <strong style={{ display: "block" }}>{match.name}</strong>
                        <span style={{ fontSize: "0.85rem", color: "var(--muted)", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>
                          {lastText}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <section className="card chat-panel" style={{ display: "flex", flexDirection: "column" }}>
          {selectedMatch ? (
            <>
              {/* Chat header */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundImage: `url(${selectedMatch.imageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80"})`, backgroundSize: "cover", backgroundPosition: "center", border: "2px solid var(--accent)", flexShrink: 0 }} />
                  <span style={{ position: "absolute", bottom: 2, right: 2, width: 10, height: 10, borderRadius: "50%", background: "#00c864", border: "2px solid var(--surface)" }}></span>
                </div>
                <div>
                  <h2 style={{ margin: 0 }}>{selectedMatch.name}</h2>
                  <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: 0 }}>
                    {isTyping && selectedId === selectedId
                      ? <span style={{ color: "var(--accent)" }}>typing...</span>
                      : <><i className="fa-solid fa-location-dot"></i> {selectedMatch.location} · {selectedMatch.distance} km</>
                    }
                  </p>
                </div>
                <span className="match-score" style={{ marginLeft: "auto" }}>
                  <i className="fa-solid fa-star"></i> {selectedMatch.matchScore}%
                </span>
              </div>

              {/* Messages */}
              <div className="message-list" style={{ flex: 1, overflowY: "auto", maxHeight: "420px" }}>
                {chatMessages.length > 0 ? (
                  chatMessages.map((item) => {
                    const isAI = item.text.startsWith("__ai__");
                    const displayText = item.text.replace("__ai__", "");
                    const side = isAI ? "theirs" : item.sender === "me" ? "mine" : "theirs";
                    return (
                      <div key={item.id} className={`message ${side}`}>
                        <p>{displayText}</p>
                        <span>{item.time}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state" style={{ padding: "3rem 0" }}>
                    <i className="fa-solid fa-hand-wave" style={{ fontSize: "2rem", marginBottom: "0.5rem", display: "block" }}></i>
                    <p>Say hi to {selectedMatch.name}!</p>
                  </div>
                )}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="message theirs typing-bubble">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="message-box" style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={`Message ${selectedMatch.name}...`}
                  style={{ margin: 0 }}
                  disabled={isTyping}
                />
                <button className="btn btn-primary" onClick={onSend} style={{ whiteSpace: "nowrap" }} disabled={isTyping}>
                  <i className="fa-solid fa-paper-plane"></i> Send
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ padding: "4rem 2rem" }}>
              <i className="fa-solid fa-message" style={{ fontSize: "3rem", marginBottom: "1rem", display: "block", color: "var(--accent)" }}></i>
              <h3>Select a match to chat</h3>
              <p style={{ marginTop: "0.5rem", color: "var(--muted)" }}>Your conversations will appear here.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
