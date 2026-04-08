import { AppState, UserProfile } from "@/types";

// 20 female Unsplash photo IDs
const femalePhotos = [
  'photo-1494790108377-be9c29b29330',
  'photo-1534528741775-53994a69daeb',
  'photo-1517841905240-472988babdf9',
  'photo-1524504388940-b1c1722653e1',
  'photo-1529626455594-4ff0802cfb7e',
  'photo-1488426862026-3ee34a7d66df',
  'photo-1531746020798-e6953c6e8e04',
  'photo-1438761681033-6461ffad8d80',
  'photo-1544005313-94ddf0286df2',
  'photo-1502823403499-6ccfcf4fb453',
  'photo-1520813792240-56fc4a3765a7',
  'photo-1508214751196-bcfd4ca60f91',
  'photo-1487412720507-e7ab37603c6f',
  'photo-1489424731084-a5d8b219a5bb',
  'photo-1479936343636-73cdc5aae0c3',
  'photo-1463453091185-61582044d556',
  'photo-1500917293891-ef795e70e1f6',
  'photo-1521146764736-56c929d59c83',
  'photo-1541823709867-1b206113eafd',
  'photo-1526510747491-58f928ec870f',
];

// 10 male Unsplash photo IDs
const malePhotos = [
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1500648767791-00dcc994a43e',
  'photo-1506794778202-cad84cf45f1d',
  'photo-1492562080023-ab3db95bfbce',
  'photo-1519085360753-af0119f7cbe7',
  'photo-1463453091185-61582044d556',
  'photo-1472099645785-5658abf4ff4e',
  'photo-1560250097-0b93528c311a',
  'photo-1548372290-8d01b6c8e78c',
  'photo-1547425260-76bcadfb4f2c',
];

function img(id: string) {
  return `https://images.unsplash.com/${id}?w=600&h=800&fit=crop&q=80`;
}

const cities = [
  'Chennai', 'Coimbatore', 'Bengaluru', 'Mumbai', 'Delhi',
  'Hyderabad', 'Pune', 'Jaipur', 'Kolkata', 'Kochi',
  'Madurai', 'Trichy', 'Salem', 'Vellore', 'Tirunelveli',
];

const allInterests = [
  'Travel', 'Coffee', 'Books', 'Yoga', 'Music', 'Photography',
  'Food', 'Podcasts', 'Road Trips', 'Painting', 'Movies', 'Art',
  'Fashion', 'Fitness', 'Dance', 'Cooking', 'Gaming', 'Hiking',
  'Cycling', 'Swimming', 'Cricket', 'Badminton', 'Singing', 'Writing',
  'Meditation', 'Gardening', 'Coding', 'Anime', 'Chai', 'Brunch',
];

const femaleNames = [
  'Ananya','Meera','Diya','Sara','Priya','Riya','Kavya','Aisha',
  'Nisha','Pooja','Sneha','Divya','Lakshmi','Keerthi','Harini',
  'Sruthi','Varsha','Deepika','Amrita','Swathi','Janani','Revathi',
  'Pavithra','Nithya','Sangeetha','Lavanya','Mythili','Geetha',
  'Bhavana','Saranya','Kiruthika','Nandhini','Vaishnavi','Abinaya',
  'Dharshini','Ezhilarasi','Fathima','Gayathri','Hema','Indhu',
  'Jayanthi','Kamala','Latha','Malathi','Nalini','Oviya','Padma',
  'Radha','Shanthi','Thenmozhi','Uma','Vijaya','Yamuna','Zara',
  'Akshaya','Brindha','Chitra','Devika','Elakkiya','Gomathi',
  'Haripriya','Iswarya','Jothika','Kalpana','Logambal','Malar',
  'Narmadha','Oviyaa','Parvathi','Ragini','Shalini','Tamilarasi',
];

const maleBios = [
  'Software engineer who loves cricket, biryani, and long drives.',
  'Fitness freak and foodie. Looking for someone to explore new restaurants.',
  'Music producer by night, coder by day. Big fan of indie bands.',
  'Traveller at heart. Been to 15 states. Next stop: Northeast India.',
  'Chef who loves cooking for others. Speciality: Chettinad cuisine.',
  'Startup founder. Love deep conversations over filter coffee.',
  'Photographer capturing everyday moments. Nature lover.',
  'Teacher who believes in kindness. Weekend trekker.',
  'Doctor who unwinds with gaming and anime on weekends.',
  'Architect obsessed with minimalism and good design.',
];

const femaleBios = [
  'Product designer who loves beach walks, journaling, and coffee dates.',
  'Yoga enthusiast and photographer with a soft spot for music nights.',
  'Software engineer who enjoys road trips, podcasts, and trying new food.',
  'Marketing lead who enjoys painting, movies, and long conversations.',
  'Content creator passionate about fashion, fitness, and exploring new places.',
  'Architect with a love for minimalist design, indie music, and weekend hikes.',
  'Dancer and choreographer who loves teaching, performing, and chai.',
  'Entrepreneur building sustainable brands. Love dogs, books, and brunch.',
  'Doctor who reads fiction between shifts. Chai over coffee always.',
  'Teacher who paints on weekends. Believer in slow living.',
  'Journalist chasing stories and sunsets. Bookworm at heart.',
  'Nutritionist who loves cooking healthy meals and morning runs.',
  'UX designer obsessed with good typography and filter coffee.',
  'Lawyer who unwinds with Carnatic music and long walks.',
  'Startup founder. Love building things and meeting interesting people.',
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function pickN<T>(arr: T[], n: number, seed: number): T[] {
  const result: T[] = [];
  for (let i = 0; i < n; i++) {
    result.push(arr[(seed + i * 7) % arr.length]);
  }
  return [...new Set(result)].slice(0, n);
}

// Generate 100 users: 80 female + 20 male
export const demoUsers: UserProfile[] = Array.from({ length: 100 }, (_, i) => {
  const isMale = i >= 80;
  const gender: 'female' | 'male' = isMale ? 'male' : 'female';
  const idx = isMale ? i - 80 : i;

  const name = isMale
    ? ['Arjun','Karthik','Rahul','Vikram','Suresh','Dinesh','Manoj','Ravi','Arun','Siva',
       'Prasad','Ganesh','Murugan','Senthil','Bala','Rajesh','Vijay','Kumar','Deepak','Ashwin'][idx % 20]
    : femaleNames[idx % femaleNames.length];

  const age = 20 + (i * 3 % 15); // 20–34
  const distance = 2 + (i * 7 % 48); // 2–49 km
  const matchScore = 70 + (i * 3 % 29); // 70–98
  const city = pick(cities, i + 3);
  const interests = pickN(allInterests, 3, i + 1);
  const bio = isMale
    ? pick(maleBios, idx)
    : pick(femaleBios, idx);

  const photo = isMale
    ? img(pick(malePhotos, idx))
    : img(pick(femalePhotos, idx));

  return {
    id: `u${i + 1}`,
    name,
    email: `${name.toLowerCase()}${i + 1}@example.com`,
    age,
    bio,
    location: city,
    distance,
    interests,
    matchScore,
    gender,
    imageUrl: photo,
  };
});

export const initialState: AppState = {
  users: demoUsers,
  currentUser: null,
  filteredProfiles: demoUsers,
  matches: [],
  likedUserIds: [],
  filters: {
    search: '',
    minAge: 18,
    maxAge: 40,
    distance: 50,
    gender: 'all',
  },
  messages: {},
  sessions: {},
  reports: [
    { id: 'r1', type: 'Spam', reason: 'Repeated promotional links in chat.' },
    { id: 'r2', type: 'Abuse', reason: 'Offensive language reported by multiple users.' },
    { id: 'r3', type: 'Fake Profile', reason: 'Suspicious profile with stolen photos.' },
  ],
  contentQueue: [
    { id: 'c1', title: 'Profile Photo Update', description: 'New photo submitted for review.', status: 'pending' },
    { id: 'c2', title: 'Bio Change', description: 'User updated profile bio content.', status: 'pending' },
    { id: 'c3', title: 'Interest Tags', description: 'User added new interest tags.', status: 'approved' },
  ],
};
