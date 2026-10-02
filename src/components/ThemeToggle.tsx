import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'compact' | 'full' | 'dropdown-item';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'compact', className = '' }) => {
  const { theme, isMidnight, toggleTheme } = useTheme();

  if (variant === 'full') {
    return (
      <button
        onClick={toggleTheme}
        className={`w-full flex items-center justify-between p-3 rounded-xs border transition-all cursor-pointer ${
          isMidnight
            ? 'bg-[#0A2E22] border-[#C5A059]/40 text-[#FAF9F5] hover:border-[#C5A059]'
            : 'bg-white border-[#E7E2D5] text-stone-800 hover:border-[#064E3B]'
        } ${className}`}
        aria-label="Toggle between Day Atelier and Midnight Emerald theme"
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              isMidnight ? 'bg-[#041812] text-[#34D399]' : 'bg-[#FAF9F5] text-amber-700'
            }`}
          >
            {isMidnight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold uppercase tracking-wider">
              {isMidnight ? 'Midnight Emerald' : 'Atelier Alabaster'}
            </div>
            <div className="text-[10px] text-stone-500 dark:text-[#A7C4B8]">
              {isMidnight ? 'Deep velvet nocturnal styling' : 'Lustrous daylight warm silk'}
            </div>
          </div>
        </div>

        {/* Visual Pill Switch */}
        <div
          className={`w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
            isMidnight ? 'bg-[#064E3B] justify-end' : 'bg-stone-200 justify-start'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full shadow-xs flex items-center justify-center transition-transform ${
              isMidnight ? 'bg-[#C5A059] text-[#041812]' : 'bg-white text-stone-700'
            }`}
          >
            {isMidnight ? <Sparkles className="w-2.5 h-2.5" /> : <Sun className="w-2.5 h-2.5" />}
          </div>
        </div>
      </button>
    );
  }

  // Compact navbar icon button
  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative min-h-[38px] px-2.5 py-1.5 rounded flex items-center gap-1.5 text-xs font-medium border transition-all cursor-pointer group ${
        isMidnight
          ? 'bg-[#0A2E22] border-[#C5A059]/40 text-[#F3E5AB] hover:border-[#C5A059] shadow-[0_0_12px_rgba(16,185,129,0.15)]'
          : 'bg-[#FAF9F5] border-stone-300 text-stone-700 hover:text-[#064E3B] hover:border-[#064E3B]'
      } ${className}`}
      title={isMidnight ? 'Switch to Atelier Alabaster (Light)' : 'Switch to Midnight Emerald (Dark)'}
      aria-label="Toggle theme"
    >
      {isMidnight ? (
        <>
          <Moon className="w-3.5 h-3.5 text-[#34D399] group-hover:rotate-12 transition-transform" />
          <span className="hidden xl:inline text-[11px] font-semibold text-[#F3E5AB]">Midnight</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-700 group-hover:rotate-45 transition-transform" />
          <span className="hidden xl:inline text-[11px] text-stone-600">Daylight</span>
        </>
      )}
    </button>
  );
};
