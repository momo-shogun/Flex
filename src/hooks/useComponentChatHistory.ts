import { useState, useEffect, useCallback } from 'react';
import type { ComponentId } from '@/types/components';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface LastUpdate {
  componentId: ComponentId;
  props: Record<string, unknown>;
  timestamp: number;
}

const STORAGE_KEY_PREFIX = 'flex_chat_history_';
const LAST_UPDATE_KEY = 'flex_last_update';

export function useComponentChatHistory(componentId: ComponentId) {
  const storageKey = `${STORAGE_KEY_PREFIX}${componentId}`;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [lastUpdate, setLastUpdate] = useState<LastUpdate | null>(() => {
    try {
      const stored = localStorage.getItem(LAST_UPDATE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.componentId === componentId ? parsed : null;
      }
    } catch {
      // ignore
    }
    return null;
  });

  // Load history when component changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      setMessages(stored ? JSON.parse(stored) : []);
    } catch {
      setMessages([]);
    }

    // Load last update for this component
    try {
      const stored = localStorage.getItem(LAST_UPDATE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setLastUpdate(parsed.componentId === componentId ? parsed : null);
      } else {
        setLastUpdate(null);
      }
    } catch {
      setLastUpdate(null);
    }
  }, [componentId, storageKey]);

  const addMessage = useCallback(
    (role: 'user' | 'assistant', content: string, id?: string) => {
      const messageId = id || `${Date.now()}-${Math.random()}`;
      setMessages((prev) => {
        const existingIndex = prev.findIndex((m) => m.id === messageId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            content,
            timestamp: Date.now(),
          };
          try {
            localStorage.setItem(storageKey, JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        }
        const newMessage: ChatMessage = {
          id: messageId,
          role,
          content,
          timestamp: Date.now(),
        };
        const updated = [...prev, newMessage];
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    },
    [storageKey]
  );

  const saveLastUpdate = useCallback(
    (props: Record<string, unknown>) => {
      const update: LastUpdate = {
        componentId,
        props,
        timestamp: Date.now(),
      };
      setLastUpdate(update);
      try {
        localStorage.setItem(LAST_UPDATE_KEY, JSON.stringify(update));
      } catch {
        // ignore storage errors
      }
    },
    [componentId]
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }, [storageKey]);

  return {
    messages,
    addMessage,
    saveLastUpdate,
    lastUpdate,
    clearHistory,
  };
}
