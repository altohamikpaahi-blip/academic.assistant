import React, { createContext, useContext, useEffect, useState } from 'react';
import { getLastSemester, setLastSemester } from '../lib/db';

export type Screen =
  | { name: 'login' }
  | { name: 'courses'; semester: number }
  | { name: 'course'; courseId: string; semester: number }
  | { name: 'dashboard' };

interface AppContextValue {
  screen: Screen;
  navigate: (screen: Screen) => void;
  goBack: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const lastSemester = getLastSemester();
  const [history, setHistory] = useState<Screen[]>([
    lastSemester ? { name: 'courses', semester: lastSemester } : { name: 'login' },
  ]);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('aa_dark_mode') === '1';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('aa_dark_mode', darkMode ? '1' : '0');
  }, [darkMode]);

  const navigate = (screen: Screen) => {
    if (screen.name === 'courses') setLastSemester(screen.semester);
    setHistory((h) => [...h, screen]);
  };

  const goBack = () => {
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  };

  const value: AppContextValue = {
    screen: history[history.length - 1],
    navigate,
    goBack,
    darkMode,
    toggleDarkMode: () => setDarkMode((d) => !d),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp لازم يتستخدم جوه AppProvider');
  return ctx;
}
