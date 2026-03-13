export const RATINGS = ['love', 'like', 'neutral', 'dislike', 'hate', 'allergy'] as const;
export type Rating = typeof RATINGS[number];

export const MEAL_TYPES = ['breakfast', 'brunch', 'lunch', 'snack', 'dinner', 'picnic', 'bbq', 'other'] as const;
export type MealType = typeof MEAL_TYPES[number];

export const FOOD_CATEGORIES = ['protein', 'vegetable', 'fruit', 'dairy', 'seafood', 'spice', 'carb', 'other'] as const;
export type FoodCategory = typeof FOOD_CATEGORIES[number];

export const RATING_LABELS: Record<Rating, string> = {
  love: 'Love',
  like: 'Like',
  neutral: 'Neutral',
  dislike: 'Dislike',
  hate: 'Hate',
  allergy: 'Allergy',
};

export const RATING_EMOJIS: Record<Rating, string> = {
  love: '❤️',
  like: '👍',
  neutral: '😐',
  dislike: '👎',
  hate: '❌',
  allergy: '⚠️',
};

export const RATING_COLORS: Record<Rating, { color: string; bg: string }> = {
  love:    { color: '#0D735A', bg: '#E8F5F1' },
  like:    { color: '#7a9e00', bg: '#F7FAE8' },
  neutral: { color: '#9B9B9B', bg: '#ECEAE4' },
  dislike: { color: '#FFBB00', bg: '#FFF8E1' },
  hate:    { color: '#FE8F20', bg: '#FEF3E8' },
  allergy: { color: '#D93025', bg: '#FDECEA' },
};

export const CATEGORY_EMOJIS: Record<string, string> = {
  protein:   '🥩',
  vegetable: '🥦',
  fruit:     '🍓',
  dairy:     '🧀',
  seafood:   '🐟',
  spice:     '🌶️',
  carb:      '🍞',
  other:     '🍴',
};

export const ACHIEVEMENT_DEFINITIONS: Record<string, { name: string; description: string; emoji: string }> = {
  first_food:  { name: 'First Bite',      description: 'Add your first food to the list',          emoji: '🍽️' },
  list_10:     { name: 'Getting Picky',   description: 'Add 10 foods to your list',                emoji: '🤔' },
  list_50:     { name: 'Taste Expert',    description: 'Add 50 foods to your list',                emoji: '🏆' },
  list_100:    { name: 'Flavor Master',   description: 'Add 100 foods to your list',               emoji: '👑' },
  first_post:  { name: 'Food Blogger',    description: 'Share your first post',                    emoji: '📸' },
  first_follow:{ name: 'Social Eater',    description: 'Follow your first person',                 emoji: '👋' },
  first_host:  { name: 'Dinner Host',     description: 'Host your first meal event',               emoji: '🍴' },
  group_5:     { name: 'Meal Planner',    description: 'Participate in 5 group meals',             emoji: '👥' },
  streak_4:    { name: 'Consistent',      description: 'Complete weekly challenge 4 weeks in a row',emoji: '🔥' },
  explorer_5:  { name: 'Adventurous',     description: 'Try 5 different cuisine categories',       emoji: '🌍' },
};
