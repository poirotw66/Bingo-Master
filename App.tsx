import React, { useState } from 'react';
import { useBingoGame } from './hooks/useBingoGame';
import { BingoBall } from './components/BingoBall';
import { MasterBoard } from './components/MasterBoard';
import { ControlPanel } from './components/ControlPanel';
import { HistoryRail } from './components/HistoryRail';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const { gameState, actions } = useBingoGame();
  const { currentNumber, drawnNumbers, allDrawnSet, isRolling, rollingValue, settings, savedSessions } = gameState;
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30">
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <header className="pt-6 sm:pt-8 pb-2 sm:pb-4 px-6 flex items-start justify-between z-10 relative shrink-0">
        {/* Left spacer for alignment */}
        <div className="w-12 h-12 hidden sm:block"></div>

        <div className="flex flex-col items-center">
          <div className="inline-block px-3 py-0.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-2">
            <span className="text-[8px] sm:text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400">Professional System</span>
          </div>
          <h1 className="text-3xl sm:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 drop-shadow-2xl">
            BINGO MASTER
          </h1>
        </div>

        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617] active:opacity-90"
          title="Settings"
          aria-label="Open settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center gap-6 sm:gap-10 p-4 sm:p-6 w-full max-w-7xl mx-auto z-10 overflow-visible">
        
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-12 lg:gap-20 py-2 sm:py-6 shrink-0">
          
          <div className="relative group">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 bg-indigo-500/20 rounded-full blur-[60px] sm:blur-[80px] transition-all duration-1000 ${(currentNumber || isRolling) ? 'opacity-100 scale-110' : 'opacity-0 scale-50'}`}></div>
            
            <div className="relative">
              {isRolling ? (
                <div className="relative animate-pulse">
                  <BingoBall 
                    number={rollingValue || 0} 
                    size="giant" 
                    animate={false} 
                    theme={settings.theme}
                    className="z-10 blur-[1px]"
                  />
                  <div className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 bg-amber-500 text-amber-950 font-black px-3 py-1 sm:px-5 sm:py-2 rounded-lg sm:rounded-2xl shadow-2xl border-2 border-amber-200 transform -rotate-12 text-[10px] sm:text-sm uppercase tracking-tighter">
                    ROLLING...
                  </div>
                </div>
              ) : currentNumber ? (
                <div className="relative">
                  <BingoBall 
                    number={currentNumber.value} 
                    size="giant" 
                    animate={true} 
                    theme={settings.theme}
                    className="z-10"
                  />
                  <div className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 bg-white text-indigo-950 font-black px-3 py-1 sm:px-5 sm:py-2 rounded-lg sm:rounded-2xl shadow-2xl border-2 border-indigo-200 transform rotate-12 animate-bounce-small text-[10px] sm:text-sm uppercase tracking-tighter">
                    LATEST!
                  </div>
                </div>
              ) : (
                <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full border-[8px] sm:border-[12px] border-slate-800/50 bg-slate-900/30 backdrop-blur-md flex flex-col items-center justify-center text-slate-600 font-black shadow-inner group-hover:border-slate-700/50 transition-colors">
                  <span className="text-3xl sm:text-5xl mb-1">00</span>
                  <span className="text-[8px] tracking-[0.4em] uppercase opacity-50">Standby</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-auto min-w-full sm:min-w-[320px]">
            <ControlPanel gameState={gameState} actions={actions} />
          </div>
        </div>

        <div className="w-full max-w-5xl animate-fade-in-up shrink-0 pb-20 sm:pb-32">
          <div className="flex items-center gap-3 mb-4 sm:mb-6 px-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-800"></div>
            <h2 className="text-slate-500 font-bold text-[10px] sm:text-xs tracking-[0.3em] uppercase">Scoreboard 75</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-800"></div>
          </div>
          <MasterBoard drawnSet={allDrawnSet} />
        </div>

      </main>

      <footer className="z-20 fixed bottom-0 left-0 right-0">
        <HistoryRail drawnNumbers={drawnNumbers} />
      </footer>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings}
        onUpdate={actions.updateSettings}
        savedSessions={savedSessions}
        onClearSavedHistory={actions.clearSavedHistory}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}