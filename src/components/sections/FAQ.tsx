import { useState } from 'react';
import type { CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

const DEFAULT_ITEMS: FAQItem[] = [
  {
    question: 'How do I get started?',
    answer:
      'Sign up for an account, complete your profile, and follow the onboarding steps. You can start using the platform in minutes.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, PayPal, and bank transfers. Enterprise plans can also use invoicing.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes. You can cancel from your account settings. Your access continues until the end of the current billing period.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'We offer a 14-day free trial with full access. No credit card required to start.',
  },
];

interface FAQProps {
  items?: FAQItem[];
  title?: string;
  className?: string;
  /** Padding/margin for the inner content area (builder-editable). */
  innerStyle?: CSSProperties;
}

export function FAQ({ items = DEFAULT_ITEMS, title = 'Frequently Asked Questions', className, innerStyle }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className={cn('mx-auto max-w-2xl px-4 py-16 text-slate-100', className)}
      style={innerStyle}
    >
      <h2 className="mb-10 text-2xl font-bold text-white md:text-3xl">
        {title}
      </h2>
      <div className="space-y-2">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={index}
              layout
              className="rounded-lg border border-slate-700 bg-slate-900/50 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium text-white hover:bg-slate-800/50 transition-colors"
              >
                <span>{item.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  className="text-slate-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-slate-700 px-4 py-3 text-sm text-slate-400">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
