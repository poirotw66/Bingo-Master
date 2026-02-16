import React, { useState } from 'react';
import { BingoBall } from './BingoBall';

interface HistoryRailProps {
  drawnNumbers: number[];
}

export const HistoryRail: React.FC<HistoryRailProps> = ({ drawnNumbers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => drawnNumbers.length > 0 && setIsModalOpen(true)}
        className={`w-full bg-slate-900/90 border-t border-white/5 backdrop-blur-xl transition-all cursor-pointer group active:bg-slate-800/90 ${drawnNumbers.length > 0 ? 'hover:bg-slate-800/80' : 'cursor-default'}`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 text-slate-400 text-xs sm:text-sm font-black uppercase tracking-widest">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              HISTORY (Recent First)
            </div>
            {drawnNumbers.length > 0 && (
              <div className="text-[10px] font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 uppercase tracking-tighter">
                Click for details
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            )}
          </div>
          
          {drawnNumbers.length === 0 ? (
            <div className="h-12 flex items-center text-slate-600 font-medium italic text-sm">
              Waiting for the first draw...
            </div>
          ) : (
            <div className="flex gap-2.5 sm:gap-4 overflow-x-auto pb-2 no-scrollbar snap-x">
              {drawnNumbers.map((num, idx) => (
                <div key={`${num}-${idx}`} className="snap-start flex-shrink-0 animate-pop-in">
                  <BingoBall number={num} size="sm" active={true} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detailed History Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl bg-slate-900 border-t sm:border border-white/10 rounded-t-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[80vh] animate-slide-up">
            
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-slate-900/80 backdrop-blur-md z-10">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                  Full History
                  <span className="text-sm font-bold bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
                    {drawnNumbers.length}
                  </span>
                </h3>
                <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest">Draw sequence from newest to oldest</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 rounded-2xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Modal Body - Grid of drawn numbers */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 no-scrollbar">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 sm:gap-6">
                {drawnNumbers.map((num, idx) => {
                  const order = drawnNumbers.length - idx;
                  return (
                    <div 
                      key={`modal-${num}-${idx}`} 
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className="relative">
                        <BingoBall number={num} size="md" active={true} className="group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-700 shadow-lg">
                          #{order}
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
                        Draw {order}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950/50 border-t border-white/5 text-center">
               <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white text-slate-950 font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95"
               >
                 Close History
               </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </>
  );
};