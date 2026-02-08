import { motion } from 'framer-motion';

export interface SplitTextProps {
  text?: string;
  delay?: number;
  duration?: number;
  animateBy?: 'characters' | 'words';
  className?: string;
}

export function SplitText({
  text = '',
  delay = 0,
  duration = 0.5,
  animateBy = 'characters',
  className = ''
}: SplitTextProps) {
  const safeText = text ?? '';
  const items = animateBy === 'characters'
    ? safeText.split('')
    : safeText.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay
      }
    }
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={`inline-flex flex-wrap ${className}`}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ display: 'inline-block' }}
        >
          {item === ' ' ? '\u00A0' : item}
        </motion.span>
      ))}
    </motion.div>
  );
}
