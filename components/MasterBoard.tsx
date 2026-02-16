import React from 'react';
import { BINGO_COLUMNS } from '../types';

interface MasterBoardProps {
  drawnSet: Set<number>;
}

export const MasterBoard: React.FC<MasterBoardProps> = ({ drawnSet }) => {
  return (
    <div className="bg-slate-900/40 p-3 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.3)] backdrop-blur-md overflow-hidden">
      <div className="grid grid-cols-5 gap-1.5 sm:gap-6">
        {BINGO_COLUMNS.map((col) => (
          <div key={col.letter} className="flex flex-col gap-1.5 sm:gap-3">
            {/* Header Letter */}
            <div className={`
              ${col.color} font-black text-xl sm:text-5xl text-center py-1 sm:py-3 
              border-b-2 sm:border-b-4 ${col.border} mb-1 sm:mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]
            `}>
              {col.letter}
            </div>
            
            {/* Numbers in column */}
            <div className="grid grid-cols-1 gap-1 sm:gap-3">
              {Array.from({ length: 15 }, (_, i) => {
                const num = col.range[0] + i;
                const isDrawn = drawnSet.has(num);
                
                return (
                  <div 
                    key={num}
                    className={`
                      relative flex items-center justify-center 
                      h-7 sm:h-12 rounded-md sm:rounded-xl font-bold text-[10px] sm:text-lg transition-all duration-500
                      ${isDrawn 
                        ? `${col.bg} text-white shadow-[0_0_20px_rgba(0,0,0,0.3)] scale-100 z-10 border-t border-white/20` 
                        : 'bg-slate-800/50 text-slate-600 scale-95 border border-white/5'
                      }
                    `}
                  >
                    {num}
                    {isDrawn && (
                      <>
                        <span className="absolute inset-0 rounded-md sm:rounded-xl bg-white opacity-10 animate-pulse"></span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};