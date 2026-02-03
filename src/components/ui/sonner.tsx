"use client";

import { Toaster as Sonner } from 'sonner';
import type { ToasterProps } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast border border-slate-600 bg-slate-800 text-slate-100 shadow-lg',
          title: 'text-slate-100',
          description: 'text-slate-400',
          actionButton: 'bg-slate-700 text-slate-100',
          cancelButton: 'bg-slate-800 text-slate-400',
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
