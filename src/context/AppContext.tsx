// src/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { colleges, semesters, courses } from '../data/courses';
import { College, Semester, Course } from '../types';

interface AppContextType {
  selectedCollege: College | null;
  setSelectedCollege: (college: College | null) => void;
  availableSemesters: Semester[];
  selectedSemester: Semester | null;
  setSelectedSemester: (semester: Semester | null) => void;
  availableCourses: Course[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCollege, setSelectedCollegeState] = useState<College | null>(() => {
    const saved = localStorage.getItem('selected_college');
    if (saved) {
      const found = colleges.find(c => c.id === saved);
      if (found) return found;
    }
    return colleges[0]; // الكلية الافتراضية
  });

  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);

  const setSelectedCollege = (college: College | null) => {
    setSelectedCollegeState(college);
    if (college) {
      localStorage.setItem('selected_college', college.id);
    } else {
      localStorage.removeItem('selected_college');
    }
    setSelectedSemester(null); // إعادة تعيين السمستر عند تغير الكلية
  };

  const availableSemesters = selectedCollege 
    ? semesters.filter(s => s.collegeId === selectedCollege.id)
    : [];

  const availableCourses = selectedSemester
    ? courses.filter(c => c.semesterId === selectedSemester.id)
    : [];

  return (
    <AppContext.Provider
      value={{
        selectedCollege,
        setSelectedCollege,
        availableSemesters,
        selectedSemester,
        setSelectedSemester,
        availableCourses
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
