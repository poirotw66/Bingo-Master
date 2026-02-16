export type BingoLetter = 'B' | 'I' | 'N' | 'G' | 'O';
export type BingoTheme = 'classic' | 'neon' | 'minimalist';

export interface BingoNumber {
  value: number;
  letter: BingoLetter;
}

export interface GameSettings {
  autoPlaySpeed: number; // in ms
  volume: number; // 0 to 1
  theme: BingoTheme;
}

export interface GameState {
  currentNumber: BingoNumber | null;
  drawnNumbers: number[]; 
  allDrawnSet: Set<number>; 
  isAutoPlaying: boolean;
  isFinished: boolean;
  isRolling: boolean;
  rollingValue: number | null;
  isMuted: boolean;
  settings: GameSettings;
  /** Past sessions saved to localStorage (newest first) */
  savedSessions: SavedSession[];
}

export interface SavedSession {
  id: string;
  drawnNumbers: number[];
  createdAt: number;
}

export const BINGO_COLUMNS = [
  { letter: 'B', range: [1, 15], color: 'text-bingo-b', bg: 'bg-bingo-b', border: 'border-bingo-b' },
  { letter: 'I', range: [16, 30], color: 'text-bingo-i', bg: 'bg-bingo-i', border: 'border-bingo-i' },
  { letter: 'N', range: [31, 45], color: 'text-bingo-n', bg: 'bg-bingo-n', border: 'border-bingo-n' },
  { letter: 'G', range: [46, 60], color: 'text-bingo-g', bg: 'bg-bingo-g', border: 'border-bingo-g' },
  { letter: 'O', range: [61, 75], color: 'text-bingo-o', bg: 'bg-bingo-o', border: 'border-bingo-o' },
] as const;

export const getLetterForNumber = (num: number): BingoLetter => {
  if (num <= 15) return 'B';
  if (num <= 30) return 'I';
  if (num <= 45) return 'N';
  if (num <= 60) return 'G';
  return 'O';
};