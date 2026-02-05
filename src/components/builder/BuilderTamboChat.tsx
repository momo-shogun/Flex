import { useEffect, useRef } from 'react';
import {
  useTamboThread,
  useTamboThreadInput,
  useTamboContextAttachment,
} from '@tambo-ai/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const BUILDER_CONTEXT =
  'Editing the website builder canvas. Use add_builder_section to add sections and update_builder_section to change props. For a hero WITH split text animation, add exactly ONE composite: use aurora-hero-splittext for "aurora hero with split text" (title animates inside the Aurora Hero section); use silk-hero-splittext for "silk hero with split text". Never add aurora-hero and split-text as two separate sections when the user wants one hero with animated title. Use list_builder_sections to see existing sections.';

export function BuilderTamboChat() {
  const { thread } = useTamboThread();
  const { value, setValue, submit, isPending, error } = useTamboThreadInput();
  const { addContextAttachment, clearContextAttachments } = useTamboContextAttachment();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    clearContextAttachments();
    addContextAttachment({
      context: BUILDER_CONTEXT,
      displayName: 'website-builder',
      type: 'playground-component',
    });
    return () => clearContextAttachments();
  }, [addContextAttachment, clearContextAttachments]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages?.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isPending) return;
    await submit({ streamResponse: true });
    setValue('');
  };

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

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-3 py-2 border-b" style={{ borderColor: 'hsl(var(--builder-panel-border))' }}>
        <p className="text-xs" style={{ color: 'hsl(var(--builder-text-muted))' }}>
          e.g. &quot;Add aurora hero with split text&quot; (one section) or &quot;Add silk hero with split text&quot;
        </p>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-3">
          {!thread && (
            <p className="text-xs py-2" style={{ color: 'hsl(var(--builder-text-muted))' }}>
              Loading…
            </p>
          )}
          {thread?.messages?.map((message) => {
            const text = getMessageText(message.content);
            if (!text.trim()) return null;
            const isUser = message.role === 'user';
            return (
              <div
                key={message.id}
                className={
                  isUser
                    ? 'ml-auto max-w-[90%] rounded-lg px-3 py-2 text-xs bg-slate-700 text-slate-100'
                    : 'mr-auto max-w-[90%] rounded-lg px-3 py-2 text-xs border bg-slate-800/80 border-slate-700 text-slate-200'
                }
              >
                <p className="whitespace-pre-wrap break-words">{text}</p>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      {error && (
        <div className="px-3 py-2 text-xs text-red-400 border-t border-slate-700">
          {error.message ?? 'Something went wrong.'}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t flex gap-2"
        style={{ borderColor: 'hsl(var(--builder-panel-border))' }}
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a section or edit props..."
          className="flex-1 min-h-[72px] resize-none rounded-md border bg-slate-800 border-slate-600 px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          disabled={isPending}
          rows={2}
        />
        <Button
          type="submit"
          size="sm"
          className="self-end bg-violet-600 hover:bg-violet-500"
          disabled={isPending || !value.trim()}
        >
          {isPending ? 'Sending…' : 'Send'}
        </Button>
      </form>
    </div>
  );
}
