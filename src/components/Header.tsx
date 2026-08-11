// src/components/Header.tsx
import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, RotateCcw } from 'lucide-react';

export const Header: React.FC = () => {
  const { selectedCollege, setSelectedCollege, selectedSemester, setSelectedSemester } = useApp();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex justify-between items-center" dir="rtl">
      <div className="flex items-center space-x-3 space-x-reverse">
        <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900">{selectedCollege?.name}</h1>
          {selectedSemester && (
            <p className="text-xs text-gray-500">{selectedSemester.name}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 space-x-reverse">
        {selectedSemester && (
          <button
            onClick={() => setSelectedSemester(null)}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition-colors"
          >
            تغيير السمستر
          </button>
        )}
        <button
          onClick={() => setSelectedCollege(null)}
          className="flex items-center text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3.5 py-1.5 rounded-md transition-colors font-medium"
          title="تغيير الكلية"
        >
          <RotateCcw className="w-3.5 h-3.5 ml-1.5" />
          تغيير الكلية
        </button>
      </div>
    </header>
  );
};
