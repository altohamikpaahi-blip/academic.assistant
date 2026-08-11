            <// src/screens/DashboardScreen.tsx
import React from 'react';
import { useApp } from '../context/AppContext';
import { SemestersScreen } from './SemestersScreen';
import CoursesScreen from './CoursesScreen'; // أو الشاشة التي تعرض المواد
import { Header } from '../components/Header';

const DashboardScreen: React.FC = () => {
  const { selectedSemester } = useApp();

  // 1. إذا لم يتم اختيار سمستر، نعرض شاشة اختيار السمسترات
  if (!selectedSemester) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <SemestersScreen />
      </div>
    );
  }

  // 2. إذا تم اختيار سمستر، نعرض لوحة التحكم الرئيسية (أو شاشة المواد)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {/* يمكنك هنا وضع محتوى اللوحة الرئيسية أو التنقل بين التبويبات */}
        <CoursesScreen />
      </main>
    </div>
  );
};

export default DashboardScreen;
