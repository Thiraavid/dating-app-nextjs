import { UserProfile } from "@/types";

// reply templates keyed by topic
const replies: Record<string, string[]> = {
  greeting: [
    "Hey! So happy we matched.",
    "Hi there! Finally got the courage to say hello.",
    "Hey! I was hoping you'd message first haha.",
    "Hi! This is exciting, I don't usually match with someone this interesting!",
  ],
  travel: [
    "Oh I love travelling! Where's the best place you've been so far?",
    "Travel is literally my therapy. Have you been to any hill stations recently?",
    "I've been wanting to do a solo trip to Coorg. Have you tried that?",
    "Road trips or flights — which do you prefer for travel?",
  ],
  coffee: [
    "Filter coffee or espresso? This is important.",
    "There's this amazing little cafe near my place, we should check it out sometime!",
    "I literally cannot function without my morning coffee. Same for you?",
    "Coffee dates are the best kind of dates honestly.",
  ],
  food: [
    "Okay serious question — biryani or pizza?",
    "I've been trying so many new restaurants lately. Any recommendations?",
    "I love trying new cuisines! What's your favourite dish?",
    "Street food or fine dining? I'm a street food person myself.",
  ],
  music: [
    "What kind of music are you into? I'm obsessed with indie right now.",
    "Have you been to any live concerts recently? I went to one last month!",
    "Music is such a vibe. Do you play any instruments?",
    "I make playlists for every mood. Want me to share one?",
  ],
  fitness: [
    "Gym or outdoor workouts? I prefer running in the morning.",
    "Do you follow any specific workout routine? I'm trying to be more consistent.",
    "Fitness goals are so motivating! What's yours right now?",
    "I just started yoga and it's been life-changing honestly.",
  ],
  books: [
    "I'm currently reading Atomic Habits. What's on your reading list?",
    "Fiction or non-fiction? I love both but fiction hits different.",
    "There's something magical about a good book and a rainy day.",
    "What's the last book that genuinely changed how you think?",
  ],
  movies: [
    "What's the last movie that made you cry? No judgment 😄",
    "Netflix or theatre? I love the theatre experience.",
    "I'm always looking for good movie recommendations. What's your favourite genre?",
    "Have you watched anything really good lately? I need suggestions!",
  ],
  work: [
    "That sounds like such interesting work! Do you enjoy it?",
    "Work-life balance is so important. How do you unwind after a long day?",
    "I love meeting people who are passionate about what they do.",
    "What made you choose your field? I'm always curious about people's journeys.",
  ],
  location: [
    "Oh nice! I've heard great things about that place. What's the best part about living there?",
    "I've always wanted to visit! What's a hidden gem in your city?",
    "The food scene there must be amazing. Any local spots you love?",
    "How long have you been living there? Do you like it?",
  ],
  default: [
    "That's really interesting! Tell me more.",
    "Haha I totally get that! What else do you like doing?",
    "You seem like such a fun person. What do you do on weekends?",
    "I love that! We have so much in common.",
    "Now I'm curious — what's your idea of a perfect day?",
    "That made me smile! You're easy to talk to.",
    "Honestly same! I feel like we'd get along really well.",
    "I was just thinking about that the other day! Great minds think alike.",
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectTopic(userMessage: string, profile: UserProfile): string {
  const msg = userMessage.toLowerCase();
  const profileText = `${profile.bio} ${profile.interests.join(" ")}`.toLowerCase();

  // check user message first
  if (/hi|hello|hey|sup|hola/.test(msg)) return "greeting";
  if (/travel|trip|vacation|tour|visit/.test(msg)) return "travel";
  if (/coffee|café|cafe|latte|espresso/.test(msg)) return "coffee";
  if (/food|eat|restaurant|biryani|pizza|cook/.test(msg)) return "food";
  if (/music|song|playlist|concert|band/.test(msg)) return "music";
  if (/gym|workout|fitness|yoga|run|exercise/.test(msg)) return "fitness";
  if (/book|read|novel|fiction/.test(msg)) return "books";
  if (/movie|film|netflix|watch|cinema/.test(msg)) return "movies";
  if (/work|job|career|office|startup/.test(msg)) return "work";
  if (/city|place|live|location|where/.test(msg)) return "location";

  // fall back to profile interests
  const interests = profile.interests.map((i) => i.toLowerCase());
  if (interests.some((i) => /travel/.test(i))) return "travel";
  if (interests.some((i) => /coffee|chai/.test(i))) return "coffee";
  if (interests.some((i) => /food|cook|brunch/.test(i))) return "food";
  if (interests.some((i) => /music|sing/.test(i))) return "music";
  if (interests.some((i) => /fitness|gym|yoga|hik|cycl|swim/.test(i))) return "fitness";
  if (interests.some((i) => /book|read|writ/.test(i))) return "books";
  if (interests.some((i) => /movie|film|anime/.test(i))) return "movies";

  // profile bio keywords
  if (/travel/.test(profileText)) return "travel";
  if (/coffee|chai/.test(profileText)) return "coffee";
  if (/food|cook/.test(profileText)) return "food";
  if (/music/.test(profileText)) return "music";

  return "default";
}

export function generateAIReply(userMessage: string, profile: UserProfile): string {
  const topic = detectTopic(userMessage, profile);
  const pool = replies[topic] ?? replies.default;

  let reply = pickRandom(pool);

  // only add personalisation for non-greeting topics
  if (topic !== "greeting" && Math.random() > 0.6) {
    const personalised = [
      `I'm really into ${profile.interests[0]} myself!`,
      `${profile.location} has such a great vibe honestly.`,
      `You seem really genuine, I like that.`,
    ];
    reply += " " + pickRandom(personalised);
  }

  return reply;
}
