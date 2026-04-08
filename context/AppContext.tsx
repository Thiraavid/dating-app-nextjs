"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initialState, demoUsers } from "@/data/mockData";
import { loadState, saveState } from "@/lib/storage";
import { AppState, Filters, Message, UserProfile, UserSession } from "@/types";

type AppContextType = {
  state: AppState;
  login: (email: string) => void;
  signup: (payload: Pick<UserProfile, "name" | "email" | "age" | "bio">) => void;
  logout: () => void;
  updateCurrentUser: (payload: Partial<UserProfile>) => void;
  updateFilters: (payload: Partial<Filters>) => void;
  likeUser: (id: string) => void;
  dislikeUser: (id: string) => void;
  sendMessage: (matchId: string, text: string) => void;
  toggleSuspendUser: (id: string) => void;
  approveReport: (id: string) => void;
  removeReport: (id: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// get this user's session (liked ids, matches, messages)
function getSession(state: AppState, userId: string): UserSession {
  return state.sessions[userId] ?? { likedUserIds: [], matches: [], messages: {} };
}

// recompute filteredProfiles based on current user's session + filters
function withFilteredProfiles(state: AppState): AppState {
  if (!state.currentUser) return { ...state, filteredProfiles: [] };

  const session = getSession(state, state.currentUser.id);
  const { search, minAge, maxAge, distance, gender } = state.filters;
  const q = search.toLowerCase().trim();

  const filtered = state.users.filter((user) => {
    if (user.id === state.currentUser!.id) return false;
    if (session.likedUserIds.includes(user.id)) return false;
    if (user.suspended) return false;
    if (user.age < minAge) return false;
    if (user.age > maxAge) return false;
    if (user.distance > distance) return false;
    if (gender !== "all" && user.gender !== gender) return false;
    if (q) {
      const hay = `${user.name} ${user.location} ${user.interests.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return {
    ...state,
    likedUserIds: session.likedUserIds,
    matches: session.matches,
    messages: session.messages,
    filteredProfiles: filtered,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  // load from localStorage on mount, but always use fresh demoUsers list
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      const merged: AppState = {
        ...initialState,
        // keep sessions and currentUser from saved state
        sessions: saved.sessions ?? {},
        currentUser: saved.currentUser ?? null,
        filters: saved.filters ?? initialState.filters,
      };
      setState(withFilteredProfiles(merged));
    } else {
      setState(withFilteredProfiles(initialState));
    }
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const api = useMemo<AppContextType>(() => ({
    state,

    login(email) {
      setState((prev) => {
        // check demo users first, then any signed-up users in sessions
        const found = prev.users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (!found) return prev;
        return withFilteredProfiles({ ...prev, currentUser: found });
      });
    },

    signup(payload) {
      setState((prev) => {
        const newUser: UserProfile = {
          id: `user-${Date.now()}`,
          name: payload.name,
          email: payload.email,
          age: payload.age,
          bio: payload.bio,
          location: "Coimbatore",
          distance: 4,
          interests: ["Coding", "Music", "Coffee"],
          matchScore: 88,
          gender: "female",
          imageUrl: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&q=80`,
        };
        return withFilteredProfiles({
          ...prev,
          users: [...prev.users, newUser],
          currentUser: newUser,
        });
      });
    },

    logout() {
      setState((prev) => ({
        ...withFilteredProfiles({ ...prev, currentUser: null }),
        filteredProfiles: [],
        matches: [],
        likedUserIds: [],
        messages: {},
      }));
    },

    updateCurrentUser(payload) {
      setState((prev) => {
        if (!prev.currentUser) return prev;
        const updated = { ...prev.currentUser, ...payload };
        const users = prev.users.map((u) => (u.id === updated.id ? updated : u));
        return withFilteredProfiles({ ...prev, currentUser: updated, users });
      });
    },

    updateFilters(payload) {
      setState((prev) =>
        withFilteredProfiles({
          ...prev,
          filters: { ...prev.filters, ...payload },
        })
      );
    },

    likeUser(id) {
      setState((prev) => {
        if (!prev.currentUser) return prev;
        const uid = prev.currentUser.id;
        const session = getSession(prev, uid);
        const likedProfile = prev.users.find((u) => u.id === id);
        if (!likedProfile) return prev;

        const alreadyMatched = session.matches.some((m) => m.id === id);
        const msgs = { ...session.messages };
        if (!msgs[id]) {
          msgs[id] = [{
            id: `msg-${Date.now()}`,
            sender: "them",
            text: `Hey! Glad we matched 😊 How's your day going?`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }];
        }

        const updatedSession: UserSession = {
          likedUserIds: [...session.likedUserIds, id],
          matches: alreadyMatched ? session.matches : [...session.matches, likedProfile],
          messages: msgs,
        };

        return withFilteredProfiles({
          ...prev,
          sessions: { ...prev.sessions, [uid]: updatedSession },
        });
      });
    },

    dislikeUser(id) {
      setState((prev) => {
        if (!prev.currentUser) return prev;
        const uid = prev.currentUser.id;
        const session = getSession(prev, uid);
        const updatedSession: UserSession = {
          ...session,
          likedUserIds: [...session.likedUserIds, id],
        };
        return withFilteredProfiles({
          ...prev,
          sessions: { ...prev.sessions, [uid]: updatedSession },
        });
      });
    },

    sendMessage(matchId, text) {
      setState((prev) => {
        if (!prev.currentUser) return prev;
        const uid = prev.currentUser.id;
        const session = getSession(prev, uid);
        const isAI = text.startsWith("__ai__");
        const newMsg: Message = {
          id: `msg-${Date.now()}`,
          sender: isAI ? "them" : "me",
          text,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        const updatedSession: UserSession = {
          ...session,
          messages: {
            ...session.messages,
            [matchId]: [...(session.messages[matchId] ?? []), newMsg],
          },
        };
        return {
          ...prev,
          sessions: { ...prev.sessions, [uid]: updatedSession },
          messages: updatedSession.messages,
        };
      });
    },

    toggleSuspendUser(id) {
      setState((prev) =>
        withFilteredProfiles({
          ...prev,
          users: prev.users.map((u) =>
            u.id === id ? { ...u, suspended: !u.suspended } : u
          ),
        })
      );
    },

    approveReport(id) {
      setState((prev) => ({
        ...prev,
        reports: prev.reports.filter((r) => r.id !== id),
      }));
    },

    removeReport(id) {
      setState((prev) => ({
        ...prev,
        reports: prev.reports.filter((r) => r.id !== id),
      }));
    },
  }), [state]);

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
