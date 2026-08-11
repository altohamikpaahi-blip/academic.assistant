// أنواع البيانات الأساسية في التطبيق

export interface Course {
  id: string;
  semester: number; // 1 إلى 10
  name: string;
  code?: string;
}

export interface Lecture {
  id: string;
  courseId: string;
  fileName: string;
  addedAt: number;
  text: string; // النص المستخرج من الملف (PDF/Word/TXT)
}

export interface ChatMessage {
  id: string;
  courseId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  sourceLectureNames?: string[]; // أسماء المحاضرات اللي اتسحب منها الرد
}

export type QuestionType = 'mcq' | 'true_false' | 'fill_blank';

export interface ExamQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // للـ mcq فقط
  correctAnswer: string;
  sourceLectureId: string;
}

export interface ExamConfig {
  questionCount: number;
  questionTypes: QuestionType[];
  lectureIds: string[]; // المحاضرات المختارة لتوليد الامتحان منها
}

export interface ExamResult {
  id: string;
  courseId: string;
  takenAt: number;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  config: ExamConfig;
}

export interface StudyReminder {
  id: string;
  courseId: string;
  hour: number; // 0-23
  minute: number; // 0-59
  daysOfWeek: number[]; // 1(أحد) إلى 7(سبت)
  enabled: boolean;
  label: string;
}
