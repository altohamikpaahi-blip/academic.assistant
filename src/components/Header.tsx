import React from 'react';
import { useApp } from '../context/AppContext';

export function Header({ title, showBack = false }: { title: string; showBack?: boolean }) {
  const { goBack, darkMode, toggleDarkMode } = useApp();
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={goBack}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="رجوع"
          >
            ←
          </button>
        )}
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
      <button
        onClick={toggleDarkMode}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="تبديل الوضع الليلي"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
