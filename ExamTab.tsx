import React, { useState } from 'react';
import type { ExamConfig, ExamQuestion, QuestionType } from '../../types';
import { getLectures, addExamResult } from '../../lib/db';
import { generateExam } from '../../lib/examGen';

const TYPE_LABELS: Record<QuestionType, string> = {
  mcq: 'اختيار من متعدد',
  true_false: 'صح أو خطأ',
  fill_blank: 'أكمل الفراغ',
};

export function ExamTab({ courseId }: { courseId: string }) {
  const lectures = getLectures(courseId);
  const [questionCount, setQuestionCount] = useState(5);
  const [types, setTypes] = useState<QuestionType[]>(['mcq']);
  const [selectedLectureIds, setSelectedLectureIds] = useState<string[]>(
    lectures.map((l) => l.id)
  );

  const [exam, setExam] = useState<ExamQuestion[] | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const toggleType = (t: QuestionType) => {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const toggleLecture = (id: string) => {
    setSelectedLectureIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const startExam = () => {
    const config: ExamConfig = {
      questionCount,
      questionTypes: types,
      lectureIds: selectedLectureIds,
    };
    const generated = generateExam(lectures, config);
    setExam(generated);
    setAnswers({});
    setSubmitted(false);
  };

  const submitExam = () => {
    if (!exam) return;
    const correctCount = exam.filter((q) => answers[q.id] === q.correctAnswer).length;
    addExamResult({
      id: crypto.randomUUID(),
      courseId,
      takenAt: Date.now(),
      totalQuestions: exam.length,
      correctCount,
      scorePercent: Math.round((correctCount / exam.length) * 100),
      config: { questionCount, questionTypes: types, lectureIds: selectedLectureIds },
    });
    setSubmitted(true);
  };

  if (lectures.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        ارفع محاضرة على الأقل من تبويب "المحاضرات" الأول عشان تقدر تعمل امتحان.
      </div>
    );
  }

  // شاشة عرض الامتحان الجاري
  if (exam) {
    const correctCount = exam.filter((q) => answers[q.id] === q.correctAnswer).length;
    return (
      <div className="p-4 space-y-4">
        {exam.map((q, idx) => (
          <div key={q.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <div className="font-semibold mb-3">
              {idx + 1}. {q.question}
            </div>
            <div className="space-y-2">
              {(q.options ?? []).map((opt) => {
                const isChosen = answers[q.id] === opt;
                const showResult = submitted;
                const isCorrectOpt = opt === q.correctAnswer;
                return (
                  <button
                    key={opt}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                    className={`w-full text-right rounded-lg px-3 py-2 border text-sm transition ${
                      showResult
                        ? isCorrectOpt
                          ? 'bg-green-100 dark:bg-green-900/40 border-green-400'
                          : isChosen
                          ? 'bg-red-100 dark:bg-red-900/40 border-red-400'
                          : 'border-slate-200 dark:border-slate-700'
                        : isChosen
                        ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-400'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
              {q.type === 'fill_blank' && (
                <input
                  disabled={submitted}
                  value={answers[q.id] ?? ''}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  placeholder="اكتب إجابتك"
                  className="w-full h-10 rounded-lg px-3 bg-slate-100 dark:bg-slate-800 outline-none text-sm"
                />
              )}
            </div>
            {submitted && q.type === 'fill_blank' && (
              <div className="text-xs mt-2 text-slate-500">الإجابة الصحيحة: {q.correctAnswer}</div>
            )}
          </div>
        ))}

        {!submitted ? (
          <button onClick={submitExam} className="w-full h-12 rounded-xl bg-blue-600 text-white font-bold">
            تسليم الامتحان
          </button>
        ) : (
          <div className="text-center bg-slate-900 text-white rounded-xl p-4">
            <div className="text-2xl font-bold">
              {correctCount} / {exam.length}
            </div>
            <div className="text-sm opacity-80 mt-1">
              نسبتك: {Math.round((correctCount / exam.length) * 100)}%
            </div>
            <button
              onClick={() => setExam(null)}
              className="mt-3 h-10 px-4 rounded-lg bg-white text-slate-900 font-semibold"
            >
              امتحان جديد
            </button>
          </div>
        )}
      </div>
    );
  }

  // شاشة إعدادات الامتحان
  return (
    <div className="p-4 space-y-5">
      <div>
        <label className="font-semibold block mb-2">عدد الأسئلة</label>
        <input
          type="range"
          min={3}
          max={20}
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-center font-bold text-blue-600">{questionCount} سؤال</div>
      </div>

      <div>
        <label className="font-semibold block mb-2">نوع الأسئلة</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TYPE_LABELS) as QuestionType[]).map((t) => (
            <button
              key={t}
              onClick={() => toggleType(t)}
              className={`px-3 h-9 rounded-full text-sm font-semibold border ${
                types.includes(t)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="font-semibold block mb-2">المحاضرات المشمولة</label>
        <div className="space-y-2">
          {lectures.map((l) => (
            <label
              key={l.id}
              className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2"
            >
              <input
                type="checkbox"
                checked={selectedLectureIds.includes(l.id)}
                onChange={() => toggleLecture(l.id)}
              />
              <span className="text-sm">{l.fileName}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={startExam}
        disabled={types.length === 0 || selectedLectureIds.length === 0}
        className="w-full h-12 rounded-xl bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold"
      >
        بدء الامتحان
      </button>
    </div>
  );
}
