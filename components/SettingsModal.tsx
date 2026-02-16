import React, { useState, useEffect } from 'react';
import { GameSettings, BingoTheme, SavedSession } from '../types';
import { BingoBall } from './BingoBall';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdate: (newSettings: Partial<GameSettings>) => void;
  savedSessions: SavedSession[];
  onClearSavedHistory: () => void;
}

function formatSessionDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return `Today ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return d.toLocaleDateString([], { dateStyle: 'short' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdate, savedSessions, onClearSavedHistory }) => {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const themes: { id: BingoTheme; name: string }[] = [
    { id: 'classic', name: 'Classic 3D' },
    { id: 'neon', name: 'Neon Glow' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'festival', name: 'New Year Festival' },
    { id: 'ocean', name: 'Ocean' },
    { id: 'snow', name: 'Snow' },
    { id: 'forest', name: 'Forest' },
  ];

  const speeds = [
    { value: 6000, label: 'Slow' },
    { value: 4000, label: 'Normal' },
    { value: 2000, label: 'Fast' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-up" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 id="settings-title" className="text-xl font-black text-white uppercase tracking-tight">Game Settings</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-xl" aria-label="Close settings">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Volume Setting */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Master Volume</label>
              <span className="text-xs font-bold text-indigo-400">{Math.round(settings.volume * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="1" step="0.01" 
              value={settings.volume} 
              onChange={(e) => onUpdate({ volume: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(settings.volume * 100)}
              aria-label="Master volume"
            />
          </div>

          {/* Auto-play Speed */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Auto-Draw Speed</label>
            <div className="grid grid-cols-3 gap-2">
              {speeds.map((s) => (
                <button
                  key={s.value}
                  onClick={() => onUpdate({ autoPlaySpeed: s.value })}
                  className={`py-2 rounded-xl text-xs font-bold transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${settings.autoPlaySpeed === s.value ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ball Theme */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Visual Theme</label>
            <div className="flex flex-col gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onUpdate({ theme: t.id })}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 border ${settings.theme === t.id ? 'bg-indigo-500/10 border-indigo-500/50 text-white' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:border-white/10'}`}
                >
                  <span className="font-bold">{t.name}</span>
                  {settings.theme === t.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Saved sessions (localStorage history) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Saved Sessions</label>
              {savedSessions.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('確定要清除所有歷次記錄嗎？此操作無法復原。')) {
                      onClearSavedHistory();
                    }
                  }}
                  className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded"
                aria-label="Clear all saved sessions"
                >
                  Clear all
                </button>
              )}
            </div>
            {savedSessions.length === 0 ? (
              <p className="text-slate-500 text-sm py-2">No past sessions. Reset a game to save it here.</p>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {savedSessions.map((session) => (
                  <div key={session.id} className="bg-slate-800/50 border border-white/5 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedSessionId(expandedSessionId === session.id ? null : session.id)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-800/80 transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-inset rounded-xl"
                    >
                      <span className="text-sm font-bold text-slate-200">{formatSessionDate(session.createdAt)}</span>
                      <span className="text-xs font-black text-indigo-400">{session.drawnNumbers.length} balls</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`text-slate-500 transition-transform ${expandedSessionId === session.id ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                    </button>
                    {expandedSessionId === session.id && (
                      <div className="p-3 pt-0 border-t border-white/5">
                        <div className="flex flex-wrap gap-2">
                          {session.drawnNumbers.map((num, idx) => (
                            <BingoBall key={`${session.id}-${idx}`} number={num} size="sm" active={true} theme={settings.theme} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-950/30 border-t border-white/5">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-white text-slate-950 font-black rounded-2xl uppercase tracking-widest text-sm hover:bg-slate-200 transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 active:opacity-95"
            aria-label="Close settings"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};