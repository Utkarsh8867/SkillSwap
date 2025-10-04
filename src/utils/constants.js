// This file centralizes constants used across the application.

export const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Design',
  'Marketing',
  'Business',
  'Languages',
  'Music',
  'Photography',
  'Writing',
  'Other'
];

export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const POST_TYPES = [
  { value: 'offering', label: 'Offering', description: 'I want to teach or provide this skill' },
  { value: 'seeking', label: 'Seeking', description: 'I want to learn or find this skill' },
  { value: 'exchange', label: 'Exchange', description: 'I want to exchange skills with others' }
];

export const LOCATIONS = ['Remote', 'Local', 'Hybrid'];

export const DEMO_USERS = {
  JOHN: { email: 'john@skillswap.com', password: 'demo123' },
  SARAH: { email: 'sarah@skillswap.com', password: 'demo123' },
  MIKE: { email: 'mike@skillswap.com', password: 'demo123' }
};

export const MAX_IMAGE_UPLOAD = 5;
export const MAX_IMAGE_SIZE_MB = 5;