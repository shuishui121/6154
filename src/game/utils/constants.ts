export const GAME_CONFIG = {
  WIDTH: 960,
  HEIGHT: 600,
  GROUND_Y: 500,
  GRAVITY: 900,
};

export const DIFFICULTY_CONFIG = {
  easy: {
    initialHeight: 1.0,
    heightStep: 0.05,
    gravity: 800,
    maxRunSpeed: 300,
    jumpForceMultiplier: 1.0,
    runDistance: 400,
    label: '简单',
  },
  normal: {
    initialHeight: 1.2,
    heightStep: 0.08,
    gravity: 900,
    maxRunSpeed: 350,
    jumpForceMultiplier: 1.0,
    runDistance: 350,
    label: '普通',
  },
  hard: {
    initialHeight: 1.5,
    heightStep: 0.1,
    gravity: 1000,
    maxRunSpeed: 400,
    jumpForceMultiplier: 0.95,
    runDistance: 300,
    label: '困难',
  },
};

export type Difficulty = keyof typeof DIFFICULTY_CONFIG;

export const PIXELS_PER_METER = 100;

export const JUMP_ZONE_START = 550;
export const JUMP_ZONE_END = 650;
export const BAR_X = 700;

export const COLORS = {
  sky: '#87CEEB',
  skyBottom: '#E0F7FA',
  grass: '#81C784',
  grassDark: '#66BB6A',
  track: '#D7CCC8',
  trackDark: '#BCAAA4',
  bar: '#FF7043',
  pole: '#78909C',
  player: '#42A5F5',
  playerDark: '#1E88E5',
  accent: '#FF7043',
  text: '#37474F',
  textLight: '#FFFFFF',
};

export const ACHIEVEMENTS = [
  {
    id: 'first_jump',
    name: '初次飞跃',
    description: '完成第一次跳跃尝试',
    icon: '🦘',
    condition: { type: 'special' as const, value: 1 },
  },
  {
    id: 'height_150',
    name: '一米五',
    description: '成功跳过1.5米高度',
    icon: '🎯',
    condition: { type: 'height' as const, value: 1.5 },
  },
  {
    id: 'height_180',
    name: '一米八',
    description: '成功跳过1.8米高度',
    icon: '⭐',
    condition: { type: 'height' as const, value: 1.8 },
  },
  {
    id: 'height_200',
    name: '两米大关',
    description: '成功跳过2.0米高度',
    icon: '🏆',
    condition: { type: 'height' as const, value: 2.0 },
  },
  {
    id: 'height_220',
    name: '飞越巅峰',
    description: '成功跳过2.2米高度',
    icon: '👑',
    condition: { type: 'height' as const, value: 2.2 },
  },
  {
    id: 'combo_5',
    name: '五连跳',
    description: '连续成功跳过5次',
    icon: '🔥',
    condition: { type: 'combo' as const, value: 5 },
  },
  {
    id: 'combo_10',
    name: '十全十美',
    description: '连续成功跳过10次',
    icon: '💯',
    condition: { type: 'combo' as const, value: 10 },
  },
  {
    id: 'perfect_timing',
    name: '完美时机',
    description: '在最佳时机起跳',
    icon: '⚡',
    condition: { type: 'special' as const, value: 2 },
  },
  {
    id: 'speed_demon',
    name: '风驰电掣',
    description: '达到最大助跑速度',
    icon: '💨',
    condition: { type: 'special' as const, value: 3 },
  },
  {
    id: 'all_difficulties',
    name: '全能选手',
    description: '在所有难度下都跳过1.5米',
    icon: '🎖️',
    condition: { type: 'special' as const, value: 4 },
  },
];

export const STORAGE_KEY = 'highJumpGameData';
