'use client';

import { motion, useReducedMotion } from 'framer-motion';

const AMBIENT_PETALS = [
  { left: '8%', size: 18, duration: 16, delay: 0, drift: 32, rotateEnd: 280, opacity: 0.48 },
  { left: '21%', size: 14, duration: 20, delay: 3.5, drift: -26, rotateEnd: -240, opacity: 0.38 },
  { left: '34%', size: 20, duration: 18, delay: 7, drift: 24, rotateEnd: 320, opacity: 0.45 },
  { left: '49%', size: 15, duration: 22, delay: 1.8, drift: -30, rotateEnd: 260, opacity: 0.36 },
  { left: '63%', size: 17, duration: 17, delay: 5.2, drift: 28, rotateEnd: -300, opacity: 0.46 },
  { left: '76%', size: 13, duration: 21, delay: 9, drift: -22, rotateEnd: 240, opacity: 0.4 },
  { left: '88%', size: 19, duration: 15, delay: 2.5, drift: -34, rotateEnd: -280, opacity: 0.5 },
  { left: '94%', size: 15, duration: 19, delay: 6.4, drift: -20, rotateEnd: 290, opacity: 0.38 },
];

export function FallingPetals() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
    >
      {AMBIENT_PETALS.map((petal, idx) => (
        <motion.svg
          key={idx}
          viewBox="0 0 24 14"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size * 0.6,
          }}
          initial={{ y: '-8vh', x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: '108vh',
            x: [0, petal.drift, -petal.drift * 0.6, petal.drift * 0.4],
            rotate: petal.rotateEnd,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            y: {
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: 'linear',
            },
            x: {
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            rotate: {
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: 'linear',
            },
            opacity: {
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              times: [0, 0.1, 0.88, 1],
            },
          }}
          className="absolute top-0"
        >
          <path
            d="M1 7 C6 1, 16 1, 23 7 C16 13, 6 13, 1 7 Z"
            fill="var(--petal-fill)"
            fillOpacity="var(--petal-opacity)"
            stroke="var(--petal-stroke)"
            strokeWidth="0.7"
            strokeOpacity="0.65"
          />
        </motion.svg>
      ))}
    </div>
  );
}
