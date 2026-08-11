// طبقة تخزين محلية بسيطة مبنية على localStorage
// (تشتغل جوه WebView الأندرويد بدون أي إنترنت أو سيرفر خارجي)
// كل بيانات المستخدم (محاضرات، شات، نتائج) بتفضل محفوظة على الجهاز بس.

import type { ChatMessage, ExamResult, Lecture, StudyReminder } from '../types';

const KEYS = {
  lectures: 'aa_lectures',
  chat: 'aa_chat',
  results: 'aa_exam_results',
  reminders: 'aa_reminders',
  lastSemester: 'aa_last_semester',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- المحاضرات ----------
export function getLectures(courseId: string): Lecture[] {
  return read<Lecture[]>(KEYS.lectures, []).filter((l) => l.courseId === courseId);
}

export function addLecture(lecture: Lecture) {
  const all = read<Lecture[]>(KEYS.lectures, []);
  all.push(lecture);
  write(KEYS.lectures, all);
}

export function deleteLecture(lectureId: string) {
  const all = read<Lecture[]>(KEYS.lectures, []).filter((l) => l.id !== lectureId);
  write(KEYS.lectures, all);
}

// ---------- الشات ----------
export function getChatHistory(courseId: string): ChatMessage[] {
  return read<ChatMessage[]>(KEYS.chat, []).filter((m) => m.courseId === courseId);
}

export function addChatMessage(message: ChatMessage) {
  const all = read<ChatMessage[]>(KEYS.chat, []);
  all.push(message);
  write(KEYS.chat, all);
}

// ---------- نتائج الامتحانات والتقدم ----------
export function getExamResults(courseId?: string): ExamResult[] {
  const all = read<ExamResult[]>(KEYS.results, []);
  return courseId ? all.filter((r) => r.courseId === courseId) : all;
}

export function addExamResult(result: ExamResult) {
  const all = read<ExamResult[]>(KEYS.results, []);
  all.push(result);
  write(KEYS.results, all);
}

// ---------- تذكيرات المذاكرة ----------
export function getReminders(): StudyReminder[] {
  return read<StudyReminder[]>(KEYS.reminders, []);
}

export function saveReminders(reminders: StudyReminder[]) {
  write(KEYS.reminders, reminders);
}

// ---------- آخر سمستر تم اختياره ----------
export function getLastSemester(): number | null {
  return read<number | null>(KEYS.lastSemester, null);
}

export function setLastSemester(semester: number) {
  write(KEYS.lastSemester, semester);
}
