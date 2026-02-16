import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GameState, getLetterForNumber, BingoNumber, GameSettings, SavedSession, isValidBingoTheme, DRAW_RANGE_MIN, DRAW_RANGE_MAX } from '../types';

const STORAGE_KEY_CURRENT = 'bingo-master-current';
const STORAGE_KEY_HISTORY = 'bingo-master-history';
const MAX_SAVED_SESSIONS = 50;

export interface BingoGameActions {
  drawNumber: () => void;
  resetGame: () => void;
  toggleAutoPlay: () => void;
  toggleMute: () => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  clearSavedHistory: () => void;
}

const DEFAULT_SETTINGS: GameSettings = {
  autoPlaySpeed: 4000,
  volume: 0.5,
  theme: 'classic',
  minNumber: 1,
  maxNumber: 75,
};

function clampRange(min: number, max: number): { minNumber: number; maxNumber: number } {
  const minNumber = Math.max(DRAW_RANGE_MIN, Math.min(DRAW_RANGE_MAX, Math.floor(min)));
  const maxNumber = Math.max(DRAW_RANGE_MIN, Math.min(DRAW_RANGE_MAX, Math.floor(max)));
  if (minNumber >= maxNumber) return { minNumber, maxNumber: minNumber + 1 };
  return { minNumber, maxNumber };
}

function loadCurrentFromStorage(): { drawnNumbers: number[]; settings: GameSettings } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (!raw) return null;
    const data = JSON.parse(raw) as { drawnNumbers?: unknown; settings?: unknown };
    const drawn = Array.isArray(data.drawnNumbers) ? data.drawnNumbers.filter((n): n is number => typeof n === 'number') : [];
    const rawSettings = data.settings && typeof data.settings === 'object' ? data.settings as Record<string, unknown> : {};
    const theme = isValidBingoTheme(rawSettings.theme) ? rawSettings.theme : DEFAULT_SETTINGS.theme;
    const rawMin = typeof rawSettings.minNumber === 'number' ? rawSettings.minNumber : DEFAULT_SETTINGS.minNumber;
    const rawMax = typeof rawSettings.maxNumber === 'number' ? rawSettings.maxNumber : DEFAULT_SETTINGS.maxNumber;
    const { minNumber, maxNumber } = clampRange(rawMin, rawMax);
    const settings = { ...DEFAULT_SETTINGS, ...rawSettings, theme, minNumber, maxNumber };
    const validDrawn = drawn.filter((n) => n >= minNumber && n <= maxNumber);
    return { drawnNumbers: validDrawn, settings };
  } catch {
    return null;
  }
}

function loadHistoryFromStorage(): SavedSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    const data = JSON.parse(raw) as { sessions?: unknown[] };
    if (!Array.isArray(data.sessions)) return [];
    return data.sessions.filter((s): s is SavedSession => 
      s && typeof s === 'object' && typeof s.id === 'string' && Array.isArray(s.drawnNumbers) && typeof s.createdAt === 'number'
    ).slice(0, MAX_SAVED_SESSIONS);
  } catch {
    return [];
  }
}

export const useBingoGame = () => {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>(() => loadCurrentFromStorage()?.drawnNumbers ?? []);
  const [currentNumber, setCurrentNumber] = useState<BingoNumber | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [rollingValue, setRollingValue] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [settings, setSettings] = useState<GameSettings>(() => loadCurrentFromStorage()?.settings ?? DEFAULT_SETTINGS);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>(() => loadHistoryFromStorage());
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const rollingIntervalRef = useRef<number | null>(null);
  const storageTimeoutRef = useRef<number | null>(null);
  const latestForStorageRef = useRef({ drawnNumbers, settings });
  const latestDrawnNumbersRef = useRef<number[]>(drawnNumbers);
  latestDrawnNumbersRef.current = drawnNumbers;

  const drawnSet = useMemo(() => new Set<number>(drawnNumbers), [drawnNumbers]);
  const totalNumbers = settings.maxNumber - settings.minNumber + 1;
  const isFinished = drawnNumbers.length >= totalNumbers;

  const playSound = useCallback((type: 'draw' | 'reset' | 'roll' | 'click' | 'bingo') => {
    if (isMuted) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      // Apply global volume from settings
      masterGain.gain.setValueAtTime(settings.volume, ctx.currentTime);

      const createOsc = (freq: number, type: OscillatorType, startTime: number, duration: number, gainValue: number) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        osc.connect(g);
        g.connect(masterGain);
        
        g.gain.setValueAtTime(0, startTime);
        g.gain.linearRampToValueAtTime(gainValue, startTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      if (type === 'draw') {
        createOsc(880, 'sine', ctx.currentTime, 0.4, 0.3);
        createOsc(1320, 'sine', ctx.currentTime + 0.05, 0.5, 0.15);
      } else if (type === 'roll') {
        createOsc(600, 'square', ctx.currentTime, 0.03, 0.05);
      } else if (type === 'reset') {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
        g.gain.setValueAtTime(0.2, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        osc.connect(g);
        g.connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'click') {
        createOsc(1200, 'sine', ctx.currentTime, 0.05, 0.1);
      } else if (type === 'bingo') {
        [440, 554, 659, 880].forEach((f, i) => {
          createOsc(f, 'triangle', ctx.currentTime + i * 0.1, 0.6, 0.1);
        });
      }
    } catch (e) {
      console.warn("Audio failed", e);
    }
  }, [isMuted, settings.volume]);

  const drawNumber = useCallback(() => {
    if (isFinished || isRolling) return;

    const { minNumber: min, maxNumber: max } = settings;
    const available: number[] = [];
    for (let i = min; i <= max; i++) {
      if (!drawnSet.has(i)) available.push(i);
    }

    if (available.length === 0) return;

    setIsRolling(true);
    const span = max - min + 1;
    let ticks = 0;
    const maxTicks = 15;
    const interval = window.setInterval(() => {
      const tempRandom = min + Math.floor(Math.random() * span);
      setRollingValue(tempRandom);
      playSound('roll');
      ticks++;

      if (ticks >= maxTicks) {
        window.clearInterval(interval);
        
        const randomBuffer = new Uint32Array(1);
        window.crypto.getRandomValues(randomBuffer);
        const randomIndex = randomBuffer[0] % available.length;
        const nextVal = available[randomIndex];

        setDrawnNumbers(prev => [nextVal, ...prev]);
        setIsRolling(false);
        setRollingValue(null);
        playSound('draw');
      }
    }, 60);
    
    rollingIntervalRef.current = interval;
  }, [drawnSet, isFinished, isRolling, playSound, settings.minNumber, settings.maxNumber]);

  useEffect(() => {
    if (drawnNumbers.length > 0 && !isRolling) {
      const latest = drawnNumbers[0];
      setCurrentNumber({
        value: latest,
        letter: getLetterForNumber(latest, settings.minNumber, settings.maxNumber),
      });
    } else if (drawnNumbers.length === 0) {
      setCurrentNumber(null);
    }
  }, [drawnNumbers, isRolling, settings.minNumber, settings.maxNumber]);

  const resetGame = useCallback(() => {
    if (rollingIntervalRef.current) window.clearInterval(rollingIntervalRef.current);
    setIsAutoPlaying(false);
    setIsRolling(false);
    setRollingValue(null);
    const current = latestDrawnNumbersRef.current;
    if (current.length > 0) {
      const session: SavedSession = { id: `session-${Date.now()}`, drawnNumbers: [...current], createdAt: Date.now() };
      setSavedSessions(s => {
        const next = [session, ...s].slice(0, MAX_SAVED_SESSIONS);
        try {
          localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify({ sessions: next }));
        } catch { /* ignore */ }
        return next;
      });
    }
    setDrawnNumbers([]);
    setCurrentNumber(null);
    playSound('reset');
  }, [playSound]);

  latestForStorageRef.current = { drawnNumbers, settings };
  useEffect(() => {
    if (storageTimeoutRef.current) window.clearTimeout(storageTimeoutRef.current);
    storageTimeoutRef.current = window.setTimeout(() => {
      try {
        const { drawnNumbers: dn, settings: s } = latestForStorageRef.current;
        localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify({ drawnNumbers: dn, settings: s }));
      } catch { /* ignore */ }
      storageTimeoutRef.current = null;
    }, 400);
    return () => {
      if (storageTimeoutRef.current) window.clearTimeout(storageTimeoutRef.current);
    };
  }, [drawnNumbers, settings]);

  const clearSavedHistory = useCallback(() => {
    setSavedSessions([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch { /* ignore */ }
  }, []);

  const toggleAutoPlay = useCallback(() => {
    if (isFinished && !isAutoPlaying) return;
    playSound('click');
    setIsAutoPlaying(prev => !prev);
  }, [isFinished, isAutoPlaying, playSound]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    const newMin = newSettings.minNumber;
    const newMax = newSettings.maxNumber;
    if (typeof newMin === 'number' || typeof newMax === 'number') {
      setSettings(prev => {
        const merged = { ...prev, ...newSettings };
        const min = typeof newMin === 'number' ? newMin : prev.minNumber;
        const max = typeof newMax === 'number' ? newMax : prev.maxNumber;
        const { minNumber, maxNumber } = clampRange(min, max);
        const final = { ...merged, minNumber, maxNumber };
        setDrawnNumbers(prevDrawn => prevDrawn.filter(n => n >= final.minNumber && n <= final.maxNumber));
        return final;
      });
    } else {
      setSettings(prev => ({ ...prev, ...newSettings }));
    }
  }, []);

  useEffect(() => {
    let intervalId: number | undefined;
    if (isAutoPlaying && !isFinished && !isRolling) {
      intervalId = window.setInterval(() => {
        drawNumber();
      }, settings.autoPlaySpeed);
    }
    return () => { if (intervalId) window.clearInterval(intervalId); };
  }, [isAutoPlaying, isFinished, isRolling, drawNumber, settings.autoPlaySpeed]);

  return { 
    gameState: {
      currentNumber,
      drawnNumbers,
      allDrawnSet: drawnSet,
      isAutoPlaying,
      isFinished,
      isRolling,
      rollingValue,
      isMuted,
      settings,
      savedSessions
    }, 
    actions: { drawNumber, resetGame, toggleAutoPlay, toggleMute, updateSettings, clearSavedHistory } 
  };
};