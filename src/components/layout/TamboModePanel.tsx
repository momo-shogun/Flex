import { useEffect, useRef, useState, useCallback } from 'react';
import {
  useTamboThread,
  useTamboThreadInput,
  useTamboContextAttachment,
} from '@tambo-ai/react';
import { ChevronDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useComponentChatHistory } from '@/hooks/useComponentChatHistory';
import type {
  ComponentId,
  SplitTextProps,
  BlurTextProps,
  TextCursorProps,
} from '@/types/components';

interface TamboModePanelProps {
  selectedComponent: ComponentId;
  splitTextProps: SplitTextProps;
  blurTextProps: BlurTextProps;
  textCursorProps: TextCursorProps;
  onSplitTextPropsChange: (updates: Partial<SplitTextProps>) => void;
  onBlurTextPropsChange: (updates: Partial<BlurTextProps>) => void;
  onTextCursorPropsChange: (updates: Partial<TextCursorProps>) => void;
}

export function TamboModePanel({
  selectedComponent,
  splitTextProps,
  blurTextProps,
  textCursorProps,
  onSplitTextPropsChange,
  onBlurTextPropsChange,
  onTextCursorPropsChange,
}: TamboModePanelProps) {
  const { thread } = useTamboThread();
  const { value, setValue, submit, isPending, error } = useTamboThreadInput();
  const {
    addContextAttachment,
    clearContextAttachments,
    attachments,
  } = useTamboContextAttachment();
  const { messages, addMessage, saveLastUpdate, lastUpdate, clearHistory } =
    useComponentChatHistory(selectedComponent);

  // Track previous props to detect Tambo updates
  const prevPropsRef = useRef({ splitTextProps, blurTextProps, textCursorProps });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 60;
    setShowScrollToBottom(!isNearBottom);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
      const t = setTimeout(checkScroll, 100);
      return () => clearTimeout(t);
    }
  }, [messages.length, scrollToBottom, checkScroll]);

  // Stage minimal context for the next message (Interactables already send props to Tambo; avoid duplicate large payloads).
  // Only run when selectedComponent changes; Tambo's add/clear can have unstable refs and would cause an infinite loop.
  const addContextAttachmentRef = useRef(addContextAttachment);
  const clearContextAttachmentsRef = useRef(clearContextAttachments);
  addContextAttachmentRef.current = addContextAttachment;
  clearContextAttachmentsRef.current = clearContextAttachments;
  useEffect(() => {
    const editableComponents = ['split-text', 'blur-text', 'text-cursor', 'faq'];
    if (!editableComponents.includes(selectedComponent)) {
      clearContextAttachmentsRef.current();
      return;
    }
    const contextLine = `Editing: ${selectedComponent}. Update this component's props via the Interactable.`;
    clearContextAttachmentsRef.current();
    addContextAttachmentRef.current({
      context: contextLine,
      displayName: selectedComponent,
      type: 'playground-component',
    });
  }, [selectedComponent]);

  // Sync Tambo thread messages with localStorage (per-component history).
  // Handle streaming: update messages as they arrive (thread.messages updates during streaming).
  useEffect(() => {
    if (!thread) return;
    thread.messages.forEach((msg) => {
      // Extract text content from message (handle various formats including streaming)
      const extractText = (content: unknown): string => {
        if (content == null) return '';
        if (typeof content === 'string') return content;
        if (Array.isArray(content)) {
          return content
            .map((item) => extractText(item))
            .filter(Boolean)
            .join('');
        }
        if (typeof content === 'object') {
          const obj = content as Record<string, unknown>;
          // Try common text fields
          if (typeof obj.text === 'string') return obj.text;
          if (typeof obj.content === 'string') return obj.content;
          // Recursively extract from nested objects
          if (obj.type === 'text' && typeof obj.text === 'string') return obj.text;
          // Handle nested content arrays
          if (Array.isArray(obj.content)) {
            return extractText(obj.content);
          }
          // Try to find any string value
          for (const key in obj) {
            const value = obj[key];
            if (typeof value === 'string' && value.trim()) {
              return value;
            }
          }
        }
        return '';
      };

      const fullText = extractText(msg.content).trim();
      if (fullText && (msg.role === 'user' || msg.role === 'assistant')) {
        // addMessage will update existing messages (for streaming) or add new ones
        // Only sync user and assistant messages (skip system/tool messages)
        addMessage(msg.role, fullText, msg.id);
      }
    });
  }, [thread, addMessage]);

  // Detect when props change after Tambo update (successful update)
  useEffect(() => {
    const prev = prevPropsRef.current;
    const current = { splitTextProps, blurTextProps, textCursorProps };
    const hasChanged =
      JSON.stringify(prev.splitTextProps) !== JSON.stringify(current.splitTextProps) ||
      JSON.stringify(prev.blurTextProps) !== JSON.stringify(current.blurTextProps) ||
      JSON.stringify(prev.textCursorProps) !== JSON.stringify(current.textCursorProps);

    if (hasChanged && thread && thread.messages.length > 0) {
      // Check if last message was assistant (Tambo response)
      const lastMsg = thread.messages[thread.messages.length - 1];
      if (lastMsg.role === 'assistant') {
        // Save current props as last update
        let propsToSave: Record<string, unknown> = {};
        if (selectedComponent === 'split-text') {
          propsToSave = { ...splitTextProps };
        } else if (selectedComponent === 'blur-text') {
          propsToSave = { ...blurTextProps };
        } else if (selectedComponent === 'text-cursor') {
          propsToSave = { ...textCursorProps };
        }
        saveLastUpdate(propsToSave);
      }
    }
    prevPropsRef.current = current;
  }, [
    splitTextProps,
    blurTextProps,
    textCursorProps,
    selectedComponent,
    thread,
    saveLastUpdate,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = value.trim();
    if (!userMessage || isPending) return;
    addMessage('user', userMessage);
    await submit({ streamResponse: true });
    setValue('');
  };

  const handleApplyAgain = () => {
    if (!lastUpdate || lastUpdate.componentId !== selectedComponent) return;
    if (selectedComponent === 'split-text') {
      onSplitTextPropsChange(lastUpdate.props as Partial<SplitTextProps>);
    } else if (selectedComponent === 'blur-text') {
      onBlurTextPropsChange(lastUpdate.props as Partial<BlurTextProps>);
    } else if (selectedComponent === 'text-cursor') {
      onTextCursorPropsChange(lastUpdate.props as Partial<TextCursorProps>);
    }
  };

  const handleClearChat = () => {
    clearHistory();
    setShowScrollToBottom(false);
  };

  return (
    <aside className="w-80 flex-shrink-0 min-h-0 bg-slate-950 border-l border-slate-800 flex flex-col">
      <div className="px-4 py-3 border-b border-slate-800">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            tamboMode
          </div>
          <div className="flex items-center gap-1.5">
            {messages.length > 0 && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleClearChat}
                className="h-6 px-2 text-[10px] gap-1 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                title="Clear this component's chat history"
              >
                <Trash2 className="h-3 w-3" />
                Clear chat
              </Button>
            )}
            {lastUpdate && lastUpdate.componentId === selectedComponent && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleApplyAgain}
                className="h-6 px-2 text-[10px]"
              >
                Apply again
              </Button>
            )}
          </div>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Chat with Tambo to describe changes. It can edit the currently selected
          component&apos;s props.
        </p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col relative">
        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3 text-xs"
          onScroll={checkScroll}
        >
          {messages.length > 0 ? (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === 'user'
                      ? 'ml-auto max-w-[85%] rounded-lg bg-slate-100 text-slate-900 px-3 py-2 text-[11px]'
                      : 'mr-auto max-w-[90%] rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-[11px] text-slate-100'
                  }
                >
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-700/70 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-300">
              Describe what you want to change. For example: &quot;Make this text larger and
              blue&quot; or &quot;Slow down the animation&quot;. Tambo will modify the currently
              selected component.
            </div>
          )}

          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
              {attachments.map((att) => (
                <span
                  key={att.id}
                  className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900 px-2 py-0.5"
                >
                  {att.displayName ?? 'Attached context'}
                </span>
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-md border border-red-900/60 bg-red-950/40 px-3 py-2 text-[11px] text-red-300">
              {String(error.message || '').toLowerCase().includes('forbidden') ||
              (error as { statusCode?: number }).statusCode === 403 ? (
                <>
                  <strong className="text-red-200">403 Forbidden</strong>
                  <p className="mt-1 text-red-300/90">
                    Tambo API ne request reject kar di. Check karo: (1) <code className="rounded bg-red-900/50 px-1">.env</code> mein <code className="rounded bg-red-900/50 px-1">VITE_TAMBO_API_KEY</code> sahi hai aur app restart kiya, (2) Dashboard mein project ke liye User Authentication off hai ya phir <code className="rounded bg-red-900/50 px-1">userToken</code> pass kar rahe ho.
                  </p>
                </>
              ) : (
                error.message ?? 'Something went wrong while sending the message.'
              )}
            </div>
          )}
        </div>

        {showScrollToBottom && messages.length > 0 && (
          <div className="absolute bottom-2 right-4 z-10">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={scrollToBottom}
              className="h-7 px-2.5 text-[10px] gap-1 bg-slate-900/95 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
              title="Go to bottom"
            >
              <ChevronDown className="h-3.5 w-3.5" />
              Bottom
            </Button>
          </div>
        )}
      </div>

      <div className="border-t border-slate-800 px-3 py-2">
        <form
          className="flex items-end gap-2"
          onSubmit={handleSubmit}
        >
          <textarea
            className="flex-1 resize-none rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            rows={2}
            placeholder="Describe the UI you want to generate..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isPending}
          />
          <button
            type="submit"
            className="inline-flex h-8 items-center rounded-md bg-violet-600 px-3 text-[11px] font-medium text-white hover:bg-violet-500 transition-colors disabled:opacity-60"
            disabled={isPending}
          >
            {isPending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </aside>
  );
}

