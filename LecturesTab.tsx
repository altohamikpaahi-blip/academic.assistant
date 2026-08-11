import React, { useRef, useState } from 'react';
import type { Lecture } from '../../types';
import { addLecture, deleteLecture, getLectures } from '../../lib/db';
import { extractTextFromFile } from '../../lib/fileExtract';

export function LecturesTab({ courseId }: { courseId: string }) {
  const [lectures, setLectures] = useState<Lecture[]>(() => getLectures(courseId));
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setLoading(true);
    for (const file of Array.from(files)) {
      const text = await extractTextFromFile(file);
      const lecture: Lecture = {
        id: crypto.randomUUID(),
        courseId,
        fileName: file.name,
        addedAt: Date.now(),
        text,
      };
      addLecture(lecture);
    }
    setLectures(getLectures(courseId));
    setLoading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDelete = (id: string) => {
    deleteLecture(id);
    setLectures(getLectures(courseId));
  };

  return (
    <div className="p-4">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="w-full h-12 rounded-xl border-2 border-dashed border-blue-400 text-blue-600 dark:text-blue-400 font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-slate-900 transition"
      >
        {loading ? 'جاري استخراج النص...' : '📄 إدراج ملف محاضرة (PDF / Word / TXT)'}
      </button>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        الملفات بتتحلل وتتخزن على جهازك بس، من غير رفع لأي سيرفر.
      </p>

      <div className="mt-5 space-y-2">
        {lectures.length === 0 && (
          <p className="text-center text-slate-500 mt-8">لسه مفيش محاضرات مرفوعة لهذا المقرر.</p>
        )}
        {lectures.map((lec) => (
          <div
            key={lec.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-sm">{lec.fileName}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {lec.text ? `${lec.text.length} حرف مستخرج` : 'لم يتم استخراج نص'}
              </div>
            </div>
            <button
              onClick={() => handleDelete(lec.id)}
              className="text-red-500 text-sm font-semibold px-2"
            >
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
