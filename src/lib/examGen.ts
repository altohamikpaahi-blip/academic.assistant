// توليد أسئلة امتحان بأنماط جاهزة من نصوص المحاضرات المرفوعة
// (اختيار من متعدد / صح وخطأ / أكمل الفراغ) - بدون أي API خارجي.

import type { ExamConfig, ExamQuestion, Lecture, QuestionType } from '../types';

function normalizeSentences(lecture: Lecture): string[] {
  return lecture.text
    .split(/(?<=[.!؟?\n])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25 && s.length < 220);
}

function pickSignificantWord(sentence: string): string | null {
  const words = sentence
    .split(/\s+/)
    .filter((w) => w.replace(/[^\p{L}\p{N}]/gu, '').length > 3);
  if (words.length === 0) return null;
  // نختار كلمة من نص الجملة تقريباً (مش أول كلمة عشان تبقى ذات معنى أكتر)
  const idx = Math.min(words.length - 1, Math.floor(words.length / 2));
  return words[idx].replace(/[^\p{L}\p{N}]/gu, '');
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeFillBlank(sentence: string, lectureId: string): ExamQuestion | null {
  const word = pickSignificantWord(sentence);
  if (!word) return null;
  const blanked = sentence.replace(word, '______');
  if (blanked === sentence) return null;
  return {
    id: crypto.randomUUID(),
    type: 'fill_blank',
    question: blanked,
    correctAnswer: word,
    sourceLectureId: lectureId,
  };
}

function makeTrueFalse(sentence: string, lectureId: string, allSentences: string[]): ExamQuestion {
  const makeFalse = Math.random() > 0.5;
  let statement = sentence;
  let correctAnswer = 'صح';

  if (makeFalse && allSentences.length > 3) {
    // نستبدل كلمة مهمة بكلمة من جملة تانية عشان تبقى العبارة غلط
    const otherSentence = allSentences[Math.floor(Math.random() * allSentences.length)];
    const wordFromSentence = pickSignificantWord(sentence);
    const wordFromOther = pickSignificantWord(otherSentence);
    if (wordFromSentence && wordFromOther && wordFromSentence !== wordFromOther) {
      statement = sentence.replace(wordFromSentence, wordFromOther);
      correctAnswer = 'خطأ';
    }
  }

  return {
    id: crypto.randomUUID(),
    type: 'true_false',
    question: statement,
    options: ['صح', 'خطأ'],
    correctAnswer,
    sourceLectureId: lectureId,
  };
}

function makeMcq(sentence: string, lectureId: string, distractorWords: string[]): ExamQuestion | null {
  const word = pickSignificantWord(sentence);
  if (!word) return null;
  const blanked = sentence.replace(word, '______');
  if (blanked === sentence) return null;

  const distractors = shuffle(distractorWords.filter((w) => w !== word)).slice(0, 3);
  while (distractors.length < 3) distractors.push('غير ذلك');

  return {
    id: crypto.randomUUID(),
    type: 'mcq',
    question: blanked,
    options: shuffle([word, ...distractors]),
    correctAnswer: word,
    sourceLectureId: lectureId,
  };
}

export function generateExam(lectures: Lecture[], config: ExamConfig): ExamQuestion[] {
  const selected = lectures.filter((l) => config.lectureIds.includes(l.id));
  if (selected.length === 0) return [];

  const allSentencesFlat: { sentence: string; lectureId: string }[] = [];
  const allWordsPool: string[] = [];

  for (const lecture of selected) {
    const sentences = normalizeSentences(lecture);
    for (const s of sentences) {
      allSentencesFlat.push({ sentence: s, lectureId: lecture.id });
      const w = pickSignificantWord(s);
      if (w) allWordsPool.push(w);
    }
  }

  if (allSentencesFlat.length === 0) return [];

  const shuffled = shuffle(allSentencesFlat);
  const questions: ExamQuestion[] = [];
  const types: QuestionType[] = config.questionTypes.length > 0 ? config.questionTypes : ['mcq'];

  let i = 0;
  let attempts = 0;
  while (questions.length < config.questionCount && attempts < shuffled.length * 2) {
    const item = shuffled[i % shuffled.length];
    const type: QuestionType = types[questions.length % types.length];
    const sentencesOfLecture = allSentencesFlat
      .filter((s) => s.lectureId === item.lectureId)
      .map((s) => s.sentence);

    let q: ExamQuestion | null = null;
    if (type === 'mcq') q = makeMcq(item.sentence, item.lectureId, allWordsPool);
    else if (type === 'fill_blank') q = makeFillBlank(item.sentence, item.lectureId);
    else q = makeTrueFalse(item.sentence, item.lectureId, sentencesOfLecture);

    if (q && !questions.some((existing) => existing.question === q!.question)) {
      questions.push(q);
    }
    i++;
    attempts++;
  }

  return questions;
}
