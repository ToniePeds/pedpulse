'use client'

// File: src/components/interactive/InteractiveCourseSection.tsx
// Description: React client component that fetches case studies from Supabase
// and communicates with a server-side API route for AI chat completions.

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Define the shape of a case study
interface Case {
  id: number;
  title: string;
  short_description: string;
  description: string;
}

// Define the minimal chat message type used by our API
interface ChatMsg {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default function InteractiveCourseSection() {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Load case studies once on mount
    (async () => {
      const { data, error } = await supabase.from('interactive_cases').select('*');
      if (error) console.error('Error fetching cases:', error);
      else if (data) setCases(data as Case[]);
    })();
  }, []);

  const handleSelectCase = async (c: Case) => {
    setSelectedCase(c);
    setMessages([
      {
        role: 'system',
        content: `You are a pediatric teaching assistant. Guide the student on this case:\n${c.description}`
      }
    ]);
  };

  const handleSend = async () => {
    if (!userInput.trim() || !selectedCase) return;
    const userMsg: ChatMsg = { role: 'user', content: userInput.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setUserInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const aiMsg: ChatMsg = await res.json();
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Interactive AI-Powered Cases</h3>
        <div className="flex flex-wrap gap-2">
          {cases.map(c => (
            <button
              key={c.id}
              onClick={() => handleSelectCase(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition
                ${selectedCase?.id === c.id
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </section>

      {selectedCase && (
        <section className="bg-gray-900 p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold text-white mb-2">{selectedCase.title}</h4>
          <p className="text-gray-300 mb-4">{selectedCase.short_description}</p>

          <div className="border rounded h-64 overflow-y-auto p-4 bg-gray-800 mb-4">
            {messages.map((msg, i) => (
              <div key={i} className="mb-2">
                <span
                  className={`${
                    msg.role === 'system'
                      ? 'italic text-gray-400'
                      : msg.role === 'assistant'
                      ? 'font-medium text-teal-400'
                      : 'text-gray-200'
                  }`}
                >
                  {msg.role === 'assistant'
                    ? 'Tutor:'
                    : msg.role === 'user'
                    ? 'You:'
                    : ''}
                </span>{' '}
                <span className="text-gray-100">{msg.content}</span>
              </div>
            ))}
          </div>

          <textarea
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            rows={3}
            className="w-full border border-gray-700 rounded p-2 mb-3 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Ask a question or proceed..."
            disabled={loading}
          />

          <button
            onClick={handleSend}
            disabled={loading || !userInput.trim()}
            className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-500 disabled:opacity-50"
          >
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </section>
      )}
    </div>
  );
}
