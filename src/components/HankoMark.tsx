'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface HankoMarkProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function HankoMark({ size = 'md', label = '蓮' }: HankoMarkProps) {
  const shouldReduceMotion = useReducedMotion();

  const dimensions =
    size === 'sm'
      ? 'w-7 h-7 text-xs'
      : size === 'lg'
        ? 'w-12 h-12 text-lg'
        : 'w-9 h-9 text-sm';

  return (
    <motion.span
      aria-hidden="true"
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`inline-flex items-center justify-center border border-[#C82E36] text-[#C82E36] font-jp-seal select-none tracking-normal ${dimensions}`}
      style={{ borderRadius: '3px' }}
    >
      {label}
    </motion.span>
  );
}
