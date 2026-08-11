// src/data/courses.ts
import { College, Semester, Course } from '../types';

export const colleges: College[] = [
  {
    id: 'cs_it',
    name: 'كلية علوم الحاسوب وتقانة المعلومات',
    code: 'CSIT',
    description: 'علوم الحاسوب، تقانة المعلومات، ونظم المعلومات',
    icon: 'Cpu'
  },
  {
    id: 'engineering',
    name: 'كلية الهندسة',
    code: 'ENG',
    description: 'الهندسة بkافة تخصصاتها',
    icon: 'Wrench'
  }
];

export const semesters: Semester[] = [
  // سمسترات كلية علوم الحاسوب
  { id: 'cs_sem_1', collegeId: 'cs_it', name: 'السمستر الأول', number: 1 },
  { id: 'cs_sem_2', collegeId: 'cs_it', name: 'السمستر الثاني', number: 2 },
  { id: 'cs_sem_3', collegeId: 'cs_it', name: 'السمستر الثالث', number: 3 },
  { id: 'cs_sem_4', collegeId: 'cs_it', name: 'السمستر الرابع', number: 4 },
  
  // سمسترات كلية الهندسة (مثال)
  { id: 'eng_sem_1', collegeId: 'engineering', name: 'السمستر الأول', number: 1 },
];

export const courses: Course[] = [
  {
    id: 'c_intro_cs',
    semesterId: 'cs_sem_1',
    collegeId: 'cs_it',
    name: 'مقدمة في علوم الحاسوب',
    code: 'CS101',
    credits: 3,
    description: 'أساسيات الحوسبة، البرمجيات، والمكونات المادية.'
  },
  {
    id: 'c_prog_1',
    semesterId: 'cs_sem_1',
    collegeId: 'cs_it',
    name: 'برمجة هيكلية (1)',
    code: 'CS102',
    credits: 3,
    description: 'أساسيات البرمجة بلغة C أو Python.'
  }
];
