import { motion } from 'framer-motion';

export interface BlurTextProps {
  text: string;
  delay?: number;
  duration?: number;
  animateBy?: 'characters' | 'words';
  blurAmount?: number;
  className?: string;
}

export function BlurText({
  text,
  delay = 0,
  duration = 0.8,
  animateBy = 'characters',
  blurAmount = 10,
  className = ''
}: BlurTextProps) {
  const items = animateBy === 'characters' 
    ? text.split('')
    : text.split(' ');

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
    hidden: { 
      opacity: 0, 
      filter: `blur(${blurAmount}px)`,
      scale: 1.1
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      transition: { 
        duration,
        ease: 'easeOut'
      }
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
