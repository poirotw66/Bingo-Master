import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, getLetterForNumber, BingoNumber, GameSettings } from '../types';

export interface BingoGameActions {
  drawNumber: () => void;
  resetGame: () => void;
  toggleAutoPlay: () => void;
  toggleMute: () => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
}

const DEFAULT_SETTINGS: GameSettings = {
  autoPlaySpeed: 4000,
  volume: 0.5,
  theme: 'classic',
};

export const useBingoGame = () => {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<BingoNumber | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [rollingValue, setRollingValue] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const rollingIntervalRef = useRef<number | null>(null);

  const drawnSet = new Set<number>(drawnNumbers);
  const isFinished = drawnNumbers.length >= 75;

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

    const available = [];
    for (let i = 1; i <= 75; i++) {
      if (!drawnSet.has(i)) available.push(i);
    }

    if (available.length === 0) return;

    setIsRolling(true);
    
    let ticks = 0;
    const maxTicks = 15;
    const interval = window.setInterval(() => {
      const tempRandom = Math.floor(Math.random() * 75) + 1;
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
  }, [drawnSet, isFinished, isRolling, playSound]);

  useEffect(() => {
    if (drawnNumbers.length > 0 && !isRolling) {
      const latest = drawnNumbers[0];
      setCurrentNumber({
        value: latest,
        letter: getLetterForNumber(latest),
      });
    } else if (drawnNumbers.length === 0) {
      setCurrentNumber(null);
    }
  }, [drawnNumbers, isRolling]);

  const resetGame = useCallback(() => {
    if (rollingIntervalRef.current) window.clearInterval(rollingIntervalRef.current);
    setIsAutoPlaying(false);
    setIsRolling(false);
    setRollingValue(null);
    setDrawnNumbers([]);
    setCurrentNumber(null);
    playSound('reset');
  }, [playSound]);

  const toggleAutoPlay = useCallback(() => {
    if (isFinished && !isAutoPlaying) return;
    playSound('click');
    setIsAutoPlaying(prev => !prev);
  }, [isFinished, isAutoPlaying, playSound]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
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
      settings
    }, 
    actions: { drawNumber, resetGame, toggleAutoPlay, toggleMute, updateSettings } 
  };
};