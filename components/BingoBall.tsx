import React from 'react';
import { getLetterForNumber, BingoTheme } from '../types';

interface BingoBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant';
  active?: boolean;
  animate?: boolean;
  className?: string;
  theme?: BingoTheme;
}

const CLASSIC_COLORS = {
  'B': 'from-red-500 to-red-700 border-red-400 text-white shadow-red-900/40',
  'I': 'from-blue-500 to-blue-700 border-blue-400 text-white shadow-blue-900/40',
  'N': 'from-green-500 to-green-700 border-green-400 text-white shadow-green-900/40',
  'G': 'from-yellow-400 to-yellow-600 border-yellow-300 text-white shadow-yellow-900/40',
  'O': 'from-purple-500 to-purple-700 border-purple-400 text-white shadow-purple-900/40',
};

const NEON_COLORS = {
  'B': 'bg-slate-900 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]',
  'I': 'bg-slate-900 border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]',
  'N': 'bg-slate-900 border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]',
  'G': 'bg-slate-900 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]',
  'O': 'bg-slate-900 border-purple-500 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]',
};

const MINIMALIST_COLORS = {
  'B': 'bg-red-500 border-transparent text-white',
  'I': 'bg-blue-500 border-transparent text-white',
  'N': 'bg-green-500 border-transparent text-white',
  'G': 'bg-yellow-500 border-transparent text-white',
  'O': 'bg-purple-500 border-transparent text-white',
};

const SIZE_CLASSES = {
  sm: 'w-10 h-10 text-base border-2',
  md: 'w-14 h-14 text-xl border-4',
  lg: 'w-20 h-20 text-3xl border-4',
  xl: 'w-28 h-28 text-5xl border-8',
  giant: 'w-40 h-40 text-7xl sm:w-56 sm:h-56 sm:text-9xl border-[10px] sm:border-[12px]',
};

export const BingoBall: React.FC<BingoBallProps> = ({ 
  number, 
  size = 'md', 
  active = true,
  animate = false,
  className = '',
  theme = 'classic'
}) => {
  const letter = getLetterForNumber(number);
  
  let colorClass = '';
  if (!active) {
    colorClass = 'bg-slate-800 border-slate-700 text-slate-600 grayscale opacity-30 shadow-none';
  } else {
    switch (theme) {
      case 'neon':
        colorClass = NEON_COLORS[letter];
        break;
      case 'minimalist':
        colorClass = MINIMALIST_COLORS[letter];
        break;
      case 'classic':
      default:
        colorClass = `bg-gradient-to-br ${CLASSIC_COLORS[letter]}`;
        break;
    }
  }
    
  const sizeClass = SIZE_CLASSES[size];
  const animationClass = animate ? 'animate-pop-in' : '';

  return (
    <div 
      className={`
        relative rounded-full flex items-center justify-center font-black transition-all duration-500 transform-gpu
        ${colorClass}
        ${sizeClass}
        ${animationClass}
        ${className}
        ${theme === 'classic' && active ? 'shadow-2xl' : ''}
      `}
    >
      {/* Visual flourishes for Classic Theme */}
      {theme === 'classic' && active && (
        <>
          <div className="absolute top-[10%] left-[15%] w-[30%] h-[30%] bg-white/30 rounded-full blur-[2px] pointer-events-none"></div>
          <div className="absolute inset-0 rounded-full shadow-[inset_0_-8px_16px_rgba(0,0,0,0.3)] pointer-events-none"></div>
        </>
      )}
      
      {/* Neon Glow effect inside */}
      {theme === 'neon' && active && (
        <div className={`absolute inset-0 rounded-full blur-[10px] opacity-40 ${NEON_COLORS[letter].split(' ')[1].replace('border-', 'bg-')}`}></div>
      )}
      
      <span className={`relative ${theme === 'neon' && active ? 'drop-shadow-[0_0_8px_currentColor]' : 'drop-shadow-md'}`}>
        {number}
      </span>
    </div>
  );
};