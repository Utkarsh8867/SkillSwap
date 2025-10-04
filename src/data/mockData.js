// src/data/mockData.js

export const mockPosts = [
  {
    id: 'post_1',
    title: "Looking for a Backend Dev for a Cool Social App",
    description: "I'm a seasoned frontend developer with expertise in React & Next.js. I've designed a stunning UI for a new social media platform and need a Node.js expert to build the backend. Let's create something amazing together!",
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070'
    ],
    author: {
      id: 'user_1',
      name: "Jane Doe",
      avatar: "https://i.pravatar.cc/150?u=jane_doe",
      rating: 4.9,
      totalReviews: 23,
    },
    postType: 'exchange', // offering, seeking, exchange
    category: 'Web Development',
    skillLevel: 'Advanced',
    skillsOffered: ["React", "Next.js", "UI Animation", "Framer Motion"],
    skillsNeeded: ["Node.js", "Express", "MongoDB", "Socket.IO"],
    location: 'Remote',
    createdAt: "2025-09-24T10:00:00Z",
    likesCount: 125,
    commentsCount: 12,
    viewsCount: 1200,
  },
  {
    id: 'post_2',
    title: "Can Design Your App's UI/UX in Figma!",
    description: "I am a UI/UX designer with a passion for creating intuitive and beautiful user experiences. I can provide high-fidelity mockups, prototypes, and a complete design system in Figma. I'm looking for a Webflow developer to build my portfolio.",
    images: [],
    author: {
      id: 'user_2',
      name: "Arun Kumar",
      avatar: "https://i.pravatar.cc/150?u=arun_kumar",
      rating: 4.7,
      totalReviews: 15,
    },
    postType: 'offering',
    category: 'Design',
    skillLevel: 'Expert',
    skillsOffered: ["Figma", "UI/UX Design", "Prototyping"],
    skillsNeeded: ["Webflow", "Frontend Dev"],
    location: 'Hybrid',
    createdAt: "2025-09-23T14:30:00Z",
    likesCount: 98,
    commentsCount: 7,
    viewsCount: 850,
  },
  {
    id: 'post_3',
    title: "Need a Python Expert for a Data Science Project",
    description: "I'm working on a machine learning project for sentiment analysis but I'm stuck on the data preprocessing part. I'm offering my skills in content writing and SEO in exchange for help from a Python developer.",
    images: [],
    author: {
      id: 'user_3',
      name: "Sara Khan",
      avatar: "https://i.pravatar.cc/150?u=sara_khan",
      rating: 4.8,
      totalReviews: 19,
    },
    postType: 'seeking',
    category: 'Data Science',
    skillLevel: 'Intermediate',
    skillsOffered: ["Content Writing", "SEO"],
    skillsNeeded: ["Python", "Pandas", "Scikit-learn"],
    location: 'Local',
    createdAt: "2025-09-22T09:00:00Z",
    likesCount: 75,
    commentsCount: 5,
    viewsCount: 600,
  },
];

export const mockUser = {
  id: 'user_4',
  name: "John Wick",
  email: 'john@skillswap.com',
  bio: "Full-Stack Developer | Swapping Skills to Build Great Things",
  avatar: "https://i.pravatar.cc/150?u=john_wick",
  skillsToTeach: ["React", "Node.js", "TailwindCSS", "MongoDB", "Next.js"],
  skillsToLearn: ["Python", "Machine Learning", "Solidity"],
  location: {
    city: 'New York',
    country: 'USA'
  },
  rating: 4.9,
  totalReviews: 42,
  completedExchanges: 15,
  createdAt: "2024-01-15T12:00:00Z",
};