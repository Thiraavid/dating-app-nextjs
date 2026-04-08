export type UserProfile = {
  id: string;
  name: string;
  email: string;
  age: number;
  bio: string;
  location: string;
  distance: number;
  interests: string[];
  matchScore: number;
  suspended?: boolean;
  imageUrl?: string;
  gender?: 'female' | 'male';
};

export type Filters = {
  search: string;
  minAge: number;
  maxAge: number;
  distance: number;
  gender: 'all' | 'female' | 'male';
};

export type Message = {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
};

export type Report = {
  id: string;
  type: string;
  reason: string;
};

export type ContentReviewItem = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
};

// per-user swipe data — isolated per account
export type UserSession = {
  likedUserIds: string[];
  matches: UserProfile[];
  messages: Record<string, Message[]>;
};

export type AppState = {
  users: UserProfile[];
  currentUser: UserProfile | null;
  filteredProfiles: UserProfile[];
  matches: UserProfile[];
  likedUserIds: string[];
  filters: Filters;
  messages: Record<string, Message[]>;
  reports: Report[];
  contentQueue: ContentReviewItem[];
  sessions: Record<string, UserSession>;
};
