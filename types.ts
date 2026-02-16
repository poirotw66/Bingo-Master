export type BingoLetter = 'B' | 'I' | 'N' | 'G' | 'O';
export type BingoTheme = 'classic' | 'neon' | 'minimalist' | 'festival' | 'ocean' | 'snow' | 'forest';

export const BINGO_THEME_IDS: BingoTheme[] = ['classic', 'neon', 'minimalist', 'festival', 'ocean', 'snow', 'forest'];

export function isValidBingoTheme(v: unknown): v is BingoTheme {
  return typeof v === 'string' && BINGO_THEME_IDS.includes(v as BingoTheme);
}

export interface BingoNumber {
  value: number;
  letter: BingoLetter;
}

export interface GameSettings {
  autoPlaySpeed: number; // in ms
  volume: number; // 0 to 1
  theme: BingoTheme;
  minNumber: number;
  maxNumber: number;
}

export const DRAW_RANGE_MIN = 1;
export const DRAW_RANGE_MAX = 200;

export interface ColumnConfig {
  letter: BingoLetter;
  range: [number, number];
  color: string;
  bg: string;
  border: string;
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

const BINGO_LETTERS: BingoLetter[] = ['B', 'I', 'N', 'G', 'O'];
const BINGO_STYLES = [
  { color: 'text-bingo-b', bg: 'bg-bingo-b', border: 'border-bingo-b' },
  { color: 'text-bingo-i', bg: 'bg-bingo-i', border: 'border-bingo-i' },
  { color: 'text-bingo-n', bg: 'bg-bingo-n', border: 'border-bingo-n' },
  { color: 'text-bingo-g', bg: 'bg-bingo-g', border: 'border-bingo-g' },
  { color: 'text-bingo-o', bg: 'bg-bingo-o', border: 'border-bingo-o' },
] as const;

/** Get column letter for a number in the given range (default 1–75). */
export function getLetterForNumber(num: number, min: number = 1, max: number = 75): BingoLetter {
  const total = max - min + 1;
  const colSize = Math.ceil(total / 5);
  const colIndex = Math.min(4, Math.floor((num - min) / colSize));
  return BINGO_LETTERS[colIndex];
}

/** Build 5-column config for scoreboard for the given range. */
export function getColumnsForRange(min: number, max: number): ColumnConfig[] {
  const total = max - min + 1;
  const colSize = Math.ceil(total / 5);
  return BINGO_LETTERS.map((letter, i) => {
    const start = min + i * colSize;
    const end = Math.min(min + (i + 1) * colSize - 1, max);
    return {
      letter,
      range: [start, end],
      ...BINGO_STYLES[i],
    };
  });
}