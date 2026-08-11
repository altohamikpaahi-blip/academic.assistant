// src/context/AppContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { colleges, semesters, courses } from '../data/courses';
import { College, Semester, Course } from '../types';

interface AppContextType {
  selectedCollege: College | null;
  setSelectedCollege: (college: College | null) => void;
  availableSemesters: Semester[];
  selectedSemester: Semester | null;
  setSelectedSemester: (semester: Semester | null) => void;
  availableCourses: Course[];
  
  // الخصائص القديمة لمنع أخطاء البناء في الهيدر والتطبيق
  darkMode?: boolean;
  toggleDarkMode?: () => void;
  goBack?: () => void;
  screen?: string;
  setScreen?: (screen: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCollege, setSelectedCollegeState] = useState<College | null>(() => {
    const saved = localStorage.getItem('selected_college');
    if (saved) {
      const found = colleges.find(c => c.id === saved);
      if (found) return found;
    }
    return null; // يبدأ بدون كلية محددة لإظهار شاشة الاختيار
  });

  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [screen, setScreen] = useState<string>('dashboard');

  const setSelectedCollege = (college: College | null) => {
    setSelectedCollegeState(college);
    if (college) {
      localStorage.setItem('selected_college', college.id);
    } else {
      localStorage.removeItem('selected_college');
    }
    setSelectedSemester(null);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const goBack = () => setSelectedSemester(null);

  const availableSemesters = selectedCollege 
    ? semesters.filter(s => s.collegeId === selectedCollege.id)
    : [];

  const availableCourses = selectedSemester
    ? courses.filter(c => c.semesterId === selectedSemester.id)
    : courses;

  return (
    <AppContext.Provider
      value={{
        selectedCollege,
        setSelectedCollege,
        availableSemesters,
        selectedSemester,
        setSelectedSemester,
        availableCourses,
        darkMode,
        toggleDarkMode,
        goBack,
        screen,
        setScreen
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
