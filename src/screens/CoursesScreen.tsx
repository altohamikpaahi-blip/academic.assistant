// src/screens/CoursesScreen.tsx
import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, FileText } from 'lucide-react';

export const CoursesScreen: React.FC = () => {
  const { selectedSemester, availableCourses } = useApp();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">المقررات الدراسية</h2>
          <p className="text-sm text-gray-500 mt-0.5">السمستر الحالي: {selectedSemester?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableCourses.map((course) => (
          <div 
            key={course.id}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                  {course.code}
                </span>
                {course.credits && (
                  <span className="text-xs text-gray-400 font-medium">
                    {course.credits} ساعات
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{course.name}</h3>
              {course.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{course.description}</p>
              )}
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-indigo-600 font-medium">
              <span className="flex items-center">
                <BookOpen className="w-4 h-4 ml-1.5" />
                استعراض المحاضرات
              </span>
            </div>
          </div>
        ))}

        {availableCourses.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">لا توجد مقررات دراسية مضافة لهذا السمستر حالياً.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesScreen;
