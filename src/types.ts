// src/types.ts

export interface College {
  id: string;
  name: string;
  code: string;
  description?: string;
  icon?: string;
}

export interface Semester {
  id: string;
  collegeId: string;
  name: string;
  number: number;
}

export interface Course {
  id: string;
  semesterId?: string;
  collegeId?: string;
  name: string;
  code: string;
  description?: string;
  credits?: number;
}

export interface Lecture {
  id: string;
  courseId: string;
  title: string;
  content?: string;
  text?: string; // لدعم خاصية text في توليد الامتحانات
  fileUrl?: string;
}

export interface ExamQuestion {
  id: string;
  courseId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}
