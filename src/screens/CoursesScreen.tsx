import React from 'react';
import { useApp } from '../context/AppContext';
import { coursesForSemester } from '../data/courses';
import { Header } from '../components/Header';

export function CoursesScreen({ semester }: { semester: number }) {
  const { navigate } = useApp();
  const courses = coursesForSemester(semester);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title={`مقررات السمستر ${semester}`} showBack />

      <div className="p-4">
        <button
          onClick={() => navigate({ name: 'dashboard' })}
          className="w-full mb-4 h-11 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-semibold flex items-center justify-center gap-2"
        >
          📊 لوحة التحكم والإحصائيات
        </button>

        {courses.length === 0 ? (
          <p className="text-center text-slate-500 mt-10">لا توجد مقررات مضافة لهذا السمستر بعد.</p>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => navigate({ name: 'course', courseId: course.id, semester })}
                className="w-full text-right bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-blue-400 transition"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{course.name}</div>
                  {course.code && (
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{course.code}</div>
                  )}
                </div>
                <span className="text-slate-400">←</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
