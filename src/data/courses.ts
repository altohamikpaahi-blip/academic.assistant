import type { Course } from '../types';

// عدّل القائمة دي بمقررات كليتك الفعلية.
// كل مقرر لازم يكون ليه id فريد ورقم semester من 1 إلى 10.
export const COURSES: Course[] = [
  { id: 'c101', semester: 1, name: 'مبادئ البرمجة', code: 'CS101' },
  { id: 'c102', semester: 1, name: 'رياضيات 1', code: 'MTH101' },
  { id: 'c103', semester: 1, name: 'أساسيات اللغة الإنجليزية', code: 'ENG101' },

  { id: 'c201', semester: 2, name: 'هياكل البيانات', code: 'CS102' },
  { id: 'c202', semester: 2, name: 'رياضيات 2', code: 'MTH102' },

  { id: 'c301', semester: 3, name: 'قواعد البيانات', code: 'CS201' },
  { id: 'c302', semester: 3, name: 'أنظمة التشغيل', code: 'CS202' },

  { id: 'c401', semester: 4, name: 'شبكات الحاسب', code: 'CS203' },
  { id: 'c402', semester: 4, name: 'هندسة البرمجيات', code: 'CS204' },

  { id: 'c501', semester: 5, name: 'الذكاء الاصطناعي', code: 'CS301' },
  { id: 'c601', semester: 6, name: 'أمن المعلومات', code: 'CS302' },
  { id: 'c701', semester: 7, name: 'تطوير تطبيقات الموبايل', code: 'CS401' },
  { id: 'c801', semester: 8, name: 'مشروع التخرج 1', code: 'CS402' },
  { id: 'c901', semester: 9, name: 'مشروع التخرج 2', code: 'CS403' },
  { id: 'c1001', semester: 10, name: 'التدريب الميداني', code: 'CS404' },
];

export function coursesForSemester(semester: number): Course[] {
  return COURSES.filter((c) => c.semester === semester);
}

export const ALL_SEMESTERS = Array.from({ length: 10 }, (_, i) => i + 1);
