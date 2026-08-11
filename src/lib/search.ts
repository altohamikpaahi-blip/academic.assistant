// نظام بحث واسترجاع بسيط (بدون ذكاء اصطناعي حقيقي، بدون API خارجي)
// بيقسم نص المحاضرات لجمل، وبيدور على أقرب الجمل لسؤال المستخدم
// عن طريق مقارنة الكلمات المشتركة (keyword overlap scoring).

import type { Lecture } from '../types';

interface SentenceRef {
  text: string;
  lectureName: string;
}

const STOP_WORDS = new Set([
  'من', 'في', 'على', 'الى', 'إلى', 'عن', 'ما', 'هو', 'هي', 'ماذا', 'كيف',
  'ازاي', 'إزاي', 'هل', 'او', 'أو', 'و', 'ال', 'يا', 'ب', 'ل', 'مع', 'كل',
  'هذا', 'هذه', 'ذلك', 'التي', 'الذي', 'انا', 'أنا', 'انت', 'أنت', 'do',
  'the', 'is', 'a', 'an', 'of', 'to', 'in', 'what', 'how',
]);

function normalize(text: string): string {
  return text
    .replace(/[\u064B-\u0652]/g, '') // إزالة التشكيل
    .replace(/[إأآا]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .toLowerCase()
    .trim();
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function splitSentences(text: string, lectureName: string): SentenceRef[] {
  return text
    .split(/(?<=[.!؟?\n])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15)
    .map((s) => ({ text: s, lectureName }));
}

export interface SearchAnswer {
  answer: string;
  matchedLectures: string[];
  found: boolean;
}

export function answerFromLectures(question: string, lectures: Lecture[]): SearchAnswer {
  if (lectures.length === 0) {
    return {
      answer: 'مفيش محاضرات مرفوعة للمقرر ده لسه. ارفع ملف من تبويب "المحاضرات" الأول عشان أقدر أجاوبك من محتواه.',
      matchedLectures: [],
      found: false,
    };
  }

  const allSentences: SentenceRef[] = lectures.flatMap((l) =>
    splitSentences(l.text, l.fileName)
  );

  if (allSentences.length === 0) {
    return {
      answer: 'مقدرتش أستخرج نص واضح من الملفات المرفوعة. جرب ترفع ملف PDF أو Word فيه نص (مش صور ممسوحة ضوئياً).',
      matchedLectures: [],
      found: false,
    };
  }

  const qWords = new Set(tokenize(question));
  if (qWords.size === 0) {
    return {
      answer: 'اكتب سؤال أوضح شوية عشان أقدر أدورلك على إجابته في المحاضرات.',
      matchedLectures: [],
      found: false,
    };
  }

  const scored = allSentences
    .map((s) => {
      const sWords = tokenize(s.text);
      const overlap = sWords.filter((w) => qWords.has(w)).length;
      const score = overlap / Math.sqrt(sWords.length + 1);
      return { ...s, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return {
      answer: 'مقدرتش ألاقي إجابة واضحة للسؤال ده في المحاضرات المرفوعة. جرب تصيغ السؤال بشكل تاني أو ارفع محاضرات أكتر.',
      matchedLectures: [],
      found: false,
    };
  }

  const top = scored.slice(0, 3);
  const uniqueLectures = Array.from(new Set(top.map((t) => t.lectureName)));
  const answer = top.map((t) => `• ${t.text.trim()}`).join('\n\n');

  return { answer, matchedLectures: uniqueLectures, found: true };
}
