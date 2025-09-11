export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'History',
  'Biography',
  'Technology',
  'Art',
  'Philosophy',
  'Religion',
  'Health',
  'Business',
  'Education',
  'Travel',
  'Cooking',
  'Sports',
  'Other',
] as const;

export type Category = typeof CATEGORIES[number];