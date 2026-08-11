// استخراج النص من الملفات المرفوعة (PDF / Word / TXT)
// كل ده بيحصل جوه الجهاز نفسه (client-side) وبدون أي اتصال إنترنت أو API خارجي.

import * as pdfjsLib from 'pdfjs-dist';
// worker محلي (مش من CDN) عشان يشتغل offline جوه تطبيق الأندرويد
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

async function extractPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let fullText = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }
  return fullText;
}

async function extractDocx(file: File): Promise<string> {
  const mammoth = await import('mammoth/mammoth.browser');
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}

async function extractTxt(file: File): Promise<string> {
  return await file.text();
}

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  try {
    if (name.endsWith('.pdf')) return await extractPdf(file);
    if (name.endsWith('.docx')) return await extractDocx(file);
    if (name.endsWith('.txt')) return await extractTxt(file);
    // امتدادات غير مدعومة (زي .doc القديم أو صور) - نحاول نقراها كنص عادي
    return await extractTxt(file);
  } catch (err) {
    console.error('فشل استخراج النص من الملف', err);
    return '';
  }
}
