import { useState, useEffect } from 'react';

export interface TextCursorProps {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: string;
  cursorClassName?: string;
  className?: string;
  onComplete?: () => void;
}

export function TextCursor({
  text,
  speed = 50,
  delay = 0,
  cursor = '|',
  cursorClassName = '',
  className = '',
  onComplete
}: TextCursorProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [started, setStarted] = useState(false);

  // Start typing after delay
  useEffect(() => {
    if (!started && delay > 0) {
      const startTimeout = setTimeout(() => {
        setStarted(true);
      }, delay);
      return () => clearTimeout(startTimeout);
    } else {
      setStarted(true);
    }
  }, [delay, started]);

  // Typing animation
  useEffect(() => {
    if (!started) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete && currentIndex === text.length) {
      onComplete();
    }
  }, [currentIndex, text, speed, started, onComplete]);

  // Cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={className}>
      {displayedText}
      <span 
        className={`inline-block transition-opacity duration-100 ${cursorClassName}`}
        style={{ opacity: showCursor ? 1 : 0 }}
      >
        {cursor}
      </span>
    </span>
  );
}
