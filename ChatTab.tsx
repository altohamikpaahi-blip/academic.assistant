import React, { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '../../types';
import { addChatMessage, getChatHistory, getLectures } from '../../lib/db';
import { answerFromLectures } from '../../lib/search';

export function ChatTab({ courseId }: { courseId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => getChatHistory(courseId));
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const question = input.trim();
    if (!question) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      courseId,
      role: 'user',
      content: question,
      createdAt: Date.now(),
    };
    addChatMessage(userMsg);

    const lectures = getLectures(courseId);
    const result = answerFromLectures(question, lectures);

    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      courseId,
      role: 'assistant',
      content: result.answer,
      createdAt: Date.now(),
      sourceLectureNames: result.matchedLectures,
    };
    addChatMessage(assistantMsg);

    setMessages(getChatHistory(courseId));
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-slate-500 mt-8">
            اسأل أي سؤال عن محتوى المحاضرات المرفوعة، وهجاوبك من غيرها.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 whitespace-pre-line text-sm ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-bl-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-br-sm'
              }`}
            >
              {m.content}
              {m.sourceLectureNames && m.sourceLectureNames.length > 0 && (
                <div className="text-xs opacity-70 mt-1">
                  المصدر: {m.sourceLectureNames.join('، ')}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2 bg-white dark:bg-slate-900">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="اكتب سؤالك هنا..."
          className="flex-1 h-11 rounded-xl px-3 bg-slate-100 dark:bg-slate-800 outline-none"
        />
        <button
          onClick={handleSend}
          className="h-11 px-5 rounded-xl bg-blue-600 text-white font-semibold"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}
