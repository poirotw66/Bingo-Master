import React from 'react';
import { BingoGameActions } from '../hooks/useBingoGame';
import { GameState } from '../types';

interface ControlPanelProps {
  gameState: GameState;
  actions: BingoGameActions;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ gameState, actions }) => {
  const { isAutoPlaying, isFinished, drawnNumbers, isRolling, isMuted } = gameState;
  const count = drawnNumbers.length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      {/* Stats card and mute toggle */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/60 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Drawn</span>
          <span className="text-white text-2xl font-black">{count} <span className="text-slate-600 text-sm">/ 75</span></span>
        </div>
        <button 
          onClick={actions.toggleMute}
          className="bg-slate-900/60 p-3 rounded-2xl border border-white/5 flex flex-col items-center group transition-colors duration-200 hover:bg-slate-800 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617]"
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
        >
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Quick Mute</span>
          <div className="flex items-center gap-2">
            {isMuted ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-500"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/></svg>
                <span className="text-red-500 text-lg font-black uppercase">Muted</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500"><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                <span className="text-green-500 text-lg font-black uppercase">Active</span>
              </>
            )}
          </div>
        </button>
      </div>

      <div className="flex gap-4 h-16 sm:h-20">
        <button
          onClick={actions.drawNumber}
          disabled={isAutoPlaying || isFinished || isRolling}
          className={`
            flex-[2] rounded-2xl font-black text-2xl sm:text-3xl shadow-2xl transition-colors duration-200 flex items-center justify-center gap-3 tracking-tighter
            ${(isAutoPlaying || isFinished || isRolling) 
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700 opacity-50' 
              : 'bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 text-white shadow-indigo-500/40 border-t border-white/20 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617] active:opacity-95'
            }
          `}
          aria-label={isRolling ? 'Drawing...' : isFinished ? 'Game over' : 'Draw next ball'}
        >
          {isRolling ? '...' : isFinished ? 'GAME OVER' : 'DRAW BALL'}
        </button>

        <button
          onClick={actions.toggleAutoPlay}
          disabled={isFinished || isRolling}
          className={`
            flex-1 rounded-2xl font-bold text-sm shadow-xl transition-colors duration-200 flex flex-col items-center justify-center gap-1
            ${isAutoPlaying 
              ? 'bg-amber-500 text-amber-950 border-t border-white/30 animate-pulse cursor-pointer' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/5 cursor-pointer'
            }
            ${isRolling ? 'opacity-50 cursor-not-allowed' : ''}
            outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617] active:opacity-95
          `}
          aria-label={isAutoPlaying ? 'Pause auto-draw' : 'Start auto-draw'}
        >
          {isAutoPlaying ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              <span className="text-[10px] tracking-widest">PAUSE</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              <span className="text-[10px] tracking-widest">AUTO</span>
            </>
          )}
        </button>
      </div>

      <button
        onClick={() => {
          if (count === 0) {
            actions.resetGame();
          } else if (window.confirm('確定要開始新局嗎？目前進度會存到歷次記錄。')) {
            actions.resetGame();
          }
        }}
        className={`
          w-full py-4 rounded-2xl border transition-colors duration-200 text-sm font-black tracking-widest flex items-center justify-center gap-3 group uppercase
          shadow-lg cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617] active:opacity-95
          ${count === 0 
            ? 'border-white/5 bg-slate-900/40 text-slate-700 hover:text-slate-500 hover:bg-slate-900/60' 
            : 'border-red-900/30 bg-red-950/20 text-red-500 hover:bg-red-900/40 hover:border-red-500/50 hover:text-red-400'
          }
        `}
        aria-label="Start new game"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-700 ${count > 0 ? 'group-hover:-rotate-180' : ''}`}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74-2.74L3 12"/><path d="M3 3v9h9"/></svg>
        New Game
      </button>
    </div>
  );
};