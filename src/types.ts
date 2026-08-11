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
  semesterId: string;
  collegeId: string;
  name: string;
  code: string;
  description?: string;
  credits?: number;
}

// الأنواع الحالية الخاصة بالمستخدم، المحاضرات، الامتحانات، والمحادثة...
export interface Lecture {
  id: string;
  courseId: string;
  title: string;
  content: string;
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
 
