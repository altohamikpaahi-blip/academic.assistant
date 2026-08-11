import React, { useState } from 'react';
import { Header } from '../components/Header';
import { getExamResults, getReminders, saveReminders } from '../lib/db';
import { syncAllReminders } from '../lib/notifications';
import { COURSES } from '../data/courses';
import type { StudyReminder } from '../types';

function levelFromAverage(avg: number): { label: string; color: string } {
  if (avg >= 85) return { label: 'ممتاز', color: 'text-green-600' };
  if (avg >= 70) return { label: 'جيد جداً', color: 'text-blue-600' };
  if (avg >= 50) return { label: 'متوسط', color: 'text-amber-600' };
  return { label: 'محتاج مذاكرة أكتر', color: 'text-red-600' };
}

export function DashboardScreen() {
  const results = getExamResults();
  const [reminders, setReminders] = useState<StudyReminder[]>(() => getReminders());

  const avg =
    results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.scorePercent, 0) / results.length)
      : 0;
  const level = levelFromAverage(avg);

  const byCourse = COURSES.map((c) => {
    const courseResults = results.filter((r) => r.courseId === c.id);
    const courseAvg =
      courseResults.length > 0
        ? Math.round(courseResults.reduce((s, r) => s + r.scorePercent, 0) / courseResults.length)
        : null;
    return { course: c, avg: courseAvg, attempts: courseResults.length };
  }).filter((c) => c.attempts > 0);

  const addReminder = () => {
    const newReminder: StudyReminder = {
      id: crypto.randomUUID(),
      courseId: COURSES[0]?.id ?? '',
      hour: 18,
      minute: 0,
      daysOfWeek: [1, 2, 3, 4, 5],
      enabled: true,
      label: 'وقت مراجعة المحاضرات',
    };
    const updated = [...reminders, newReminder];
    setReminders(updated);
    saveReminders(updated);
    syncAllReminders(updated);
  };

  const toggleReminder = (id: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    setReminders(updated);
    saveReminders(updated);
    syncAllReminders(updated);
  };

  const updateReminderTime = (id: string, hour: number, minute: number) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, hour, minute } : r));
    setReminders(updated);
    saveReminders(updated);
    syncAllReminders(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title="لوحة التحكم" showBack />

      <div className="p-4 space-y-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center">
          <div className="text-sm text-slate-500 dark:text-slate-400">متوسط الأداء العام</div>
          <div className="text-4xl font-extrabold mt-1">{avg}%</div>
          <div className={`font-bold mt-1 ${level.color}`}>{level.label}</div>
          <div className="text-xs text-slate-400 mt-2">
            بناءً على {results.length} امتحان تم حله
          </div>
        </div>

        {byCourse.length > 0 && (
          <div>
            <h2 className="font-bold mb-2">الأداء حسب المقرر</h2>
            <div className="space-y-2">
              {byCourse.map(({ course, avg: cAvg, attempts }) => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-sm">{course.name}</div>
                    <div className="text-xs text-slate-500">{attempts} محاولة</div>
                  </div>
                  <div className="font-bold text-blue-600">{cAvg}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold">تنبيهات المذاكرة</h2>
            <button onClick={addReminder} className="text-blue-600 text-sm font-semibold">
              + إضافة تذكير
            </button>
          </div>

          {reminders.length === 0 && (
            <p className="text-sm text-slate-500">مفيش تذكيرات مضافة لسه.</p>
          )}

          <div className="space-y-2">
            {reminders.map((r) => (
              <div
                key={r.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={`${String(r.hour).padStart(2, '0')}:${String(r.minute).padStart(2, '0')}`}
                    onChange={(e) => {
                      const [h, m] = e.target.value.split(':').map(Number);
                      updateReminderTime(r.id, h, m);
                    }}
                    className="bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 text-sm"
                  />
                  <span className="text-sm">{r.label}</span>
                </div>
                <button
                  onClick={() => toggleReminder(r.id)}
                  className={`w-11 h-6 rounded-full relative transition ${
                    r.enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${
                      r.enabled ? 'right-0.5' : 'right-5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
