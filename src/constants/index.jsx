export const CAT = {
  food: { icon: '🍔', bg: '#fff7ed', color: '#c2410c' },
  stay: { icon: '🏨', bg: '#eef2ff', color: '#4338ca' },
  transport: { icon: '🚗', bg: '#e0f2fe', color: '#0369a1' },
  activity: { icon: '🎯', bg: '#f0fdf4', color: '#15803d' },
  utilities: { icon: '⚡', bg: '#fefce8', color: '#a16207' },
  rent: { icon: '🏠', bg: '#faf5ff', color: '#7c3aed' },
  other: { icon: '📌', bg: '#f3f4f6', color: '#374151' },
};

export const EMOJIS = ['🏖️', '🏠', '🍱', '✈️', '🎉', '🏕️', '🏋️', '🎮', '🚗', '🎶', '🍕', '💼'];

export const AVATAR_COLORS = [
  ['#dbeafe', '#1d4ed8'],
  ['#dcfce7', '#15803d'],
  ['#fce7f3', '#9d174d'],
  ['#fff7ed', '#c2410c'],
  ['#ede9fe', '#6d28d9'],
  ['#fef9c3', '#854d0e'],
];

export const getAC = name => AVATAR_COLORS[(name || '?').charCodeAt(0) % AVATAR_COLORS.length];