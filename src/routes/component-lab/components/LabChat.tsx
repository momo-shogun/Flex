import { useTamboThread, useTamboThreadInput } from '@tambo-ai/react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

function getMessageText(content: unknown): string {
  if (content == null) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (part == null) return '';
        if (typeof part === 'string') return part;
        const p = part as { type?: string; text?: string };
        if (p.type === 'text' && typeof p.text === 'string') return p.text;
        if (typeof p.text === 'string') return p.text;
        return '';
      })
      .filter(Boolean)
      .join('');
  }
  const p = content as { type?: string; text?: string };
  if (p.type === 'text' && typeof p.text === 'string') return p.text;
  return typeof (content as { text?: string }).text === 'string'
    ? (content as { text: string }).text
    : '';
}

export function LabChat() {
  const { thread } = useTamboThread();
  const { value, setValue, submit, isPending } = useTamboThreadInput();

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-4 border-b border-slate-700">
        <h3 className="font-semibold text-slate-200">Component Lab</h3>
        <p className="text-xs text-slate-500 mt-1">
          Create variants, test props, apply presets
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {thread?.messages?.map((msg) => {
          const text = getMessageText(msg.content);
          if (!text.trim()) return null;
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  isUser
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-200 border border-slate-700'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{text}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-3 border-t border-slate-700 flex gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Create a variant, list presets..."
          className="flex-1 min-h-[72px] rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void submit({ streamResponse: true });
            }
          }}
        />
        <Button
          type="button"
          size="icon"
          className="shrink-0 bg-violet-600 hover:bg-violet-500"
          onClick={() => void submit({ streamResponse: true })}
          disabled={isPending || !value.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
