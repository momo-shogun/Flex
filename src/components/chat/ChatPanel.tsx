import { useState, useCallback } from 'react';
import { useDesignSystemStore } from '@/store/design-system-store';
import { IntentParser } from '@/core/ai/intent-parser';
import { MutationEngine } from '@/core/ai/mutation-engine';
import type { SystemContext } from '@/types/ai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const parser = new IntentParser();
const mutationEngine = new MutationEngine();

const SUGGESTIONS = [
  'Make it accessible',
  'Increase contrast',
  'Round corners',
  'Make it more playful',
];

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const components = useDesignSystemStore((s) => s.components);
  const theme = useDesignSystemStore((s) => s.theme);
  const a11yIssues = useDesignSystemStore((s) => s.a11yIssues);
  const selectedId = useDesignSystemStore((s) => s.selectedId);
  const updateMultipleComponents = useDesignSystemStore(
    (s) => s.updateMultipleComponents
  );
  const snapshot = useDesignSystemStore((s) => s.snapshot);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isProcessing) return;

      const userMessage: Message = {
        id: String(Date.now()),
        role: 'user',
        content: input.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsProcessing(true);

      try {
        const context: SystemContext = {
          components,
          theme,
          a11yIssues,
          selectedId,
        };
        const response = await parser.parse(input.trim(), context);
        const mutations = mutationEngine.applyMutations(response, components);

        if (Object.keys(mutations).length > 0) {
          snapshot();
          updateMultipleComponents(mutations);
        }

        const assistantMessage: Message = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: response.explanation,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        console.error('AI processing error:', err);
        const errorMessage: Message = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content:
            err instanceof Error
              ? err.message
              : 'Something went wrong. Try again.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsProcessing(false);
      }
    },
    [
      input,
      isProcessing,
      components,
      theme,
      a11yIssues,
      selectedId,
      snapshot,
      updateMultipleComponents,
    ]
  );

  return (
    <div className="flex flex-col h-full w-[380px] shrink-0 bg-white border-l border-slate-200">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          Design Assistant
        </h2>
        <p className="text-sm text-slate-500">
          Describe changes in plain language
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-sm text-slate-500">
            Try: “Make it accessible”, “Round corners”, “Increase contrast”
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-lg px-4 py-2 flex gap-1">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
              <span
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              />
              <span
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-slate-200 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setInput(s)}
            className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700"
          >
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Make buttons more accessible..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
