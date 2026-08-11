import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_SEMESTERS } from '../data/courses';

export function LoginScreen() {
  const { navigate } = useApp();
  const [selected, setSelected] = useState<number | null>(null);

  const handleLogin = () => {
    if (!selected) return;
    navigate({ name: 'courses', semester: selected });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-blue-600 to-blue-800 dark:from-slate-900 dark:to-slate-950 text-white">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎓</div>
          <h1 className="text-2xl font-bold">المساعد الدراسي الجامعي</h1>
          <p className="text-blue-100 dark:text-slate-400 mt-2">اختر السمستر عشان تبدأ المراجعة</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 text-slate-900 dark:text-slate-100 shadow-xl">
          <label className="block mb-2 font-semibold">رقم السمستر</label>
          <div className="grid grid-cols-5 gap-2 mb-5">
            {ALL_SEMESTERS.map((sem) => (
              <button
                key={sem}
                onClick={() => setSelected(sem)}
                className={`h-12 rounded-xl font-bold text-lg transition ${
                  selected === sem
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {sem}
              </button>
            ))}
          </div>

          <button
            onClick={handleLogin}
            disabled={!selected}
            className="w-full h-12 rounded-xl bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold text-lg hover:bg-blue-700 transition"
          >
            دخول
          </button>
        </div>
      </div>
    </div>
  );
}
