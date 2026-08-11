import React, { useState } from 'react';
import { COURSES } from '../data/courses';
import { Header } from '../components/Header';
import { LecturesTab } from './tabs/LecturesTab';
import { ChatTab } from './tabs/ChatTab';
import { ExamTab } from './tabs/ExamTab';

type TabKey = 'lectures' | 'chat' | 'exam';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'lectures', label: 'المحاضرات', icon: '📚' },
  { key: 'chat', label: 'الشات', icon: '💬' },
  { key: 'exam', label: 'الامتحان', icon: '📝' },
];

export function CourseReviewScreen({ courseId }: { courseId: string }) {
  const course = COURSES.find((c) => c.id === courseId);
  const [tab, setTab] = useState<TabKey>('lectures');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Header title={course?.name ?? 'مراجعة المقرر'} showBack />

      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-1 border-b-2 transition ${
              tab === t.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 dark:text-slate-400'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1">
        {tab === 'lectures' && <LecturesTab courseId={courseId} />}
        {tab === 'chat' && <ChatTab courseId={courseId} />}
        {tab === 'exam' && <ExamTab courseId={courseId} />}
      </div>
    </div>
  );
}
