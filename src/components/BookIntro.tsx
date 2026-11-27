'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const WIND_PETALS = [
  { startX: -140, startY: -70, endX: 250, endY: 160, delay: 0.04, size: 32, rot: 42 },
  { startX: -200, startY: 50, endX: 280, endY: -50, delay: 0.16, size: 26, rot: -28 },
  { startX: 40, startY: -150, endX: 310, endY: 100, delay: 0.1, size: 30, rot: 68 },
  { startX: -100, startY: 110, endX: 220, endY: -90, delay: 0.26, size: 24, rot: -52 },
  { startX: -240, startY: -20, endX: 200, endY: 130, delay: 0.34, size: 28, rot: 22 },
  { startX: 90, startY: -110, endX: 340, endY: 70, delay: 0.4, size: 27, rot: 78 },
];

export function BookIntro() {
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (shouldReduceMotion) {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="lotus-water-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#F4EEDE] px-4"
          aria-label="Abertura Lótus"
        >
          {/* Superfície suave de água em aquarela */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute h-72 w-[460px] rounded-full blur-2xl sm:w-[560px]"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(138, 178, 198, 0.32) 0%, rgba(164, 198, 212, 0.14) 55%, rgba(244, 238, 222, 0) 78%)',
              transform: 'translateY(68px)',
            }}
          />

          {/* Ondas sutis na água sob a flor */}
          {[0, 1].map((ring) => (
            <motion.div
              key={ring}
              initial={{ scale: 0.55, opacity: 0.45 }}
              animate={{ scale: 1.55 + ring * 0.35, opacity: 0 }}
              transition={{
                duration: 1.5,
                delay: ring * 0.38,
                ease: 'easeOut',
              }}
              className="pointer-events-none absolute h-24 w-60 rounded-full border border-[#6E9BB2]/35"
              style={{ transform: 'translateY(76px)' }}
            />
          ))}

          {/* Pétalas em aquarela voando pela tela com a brisa */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {WIND_PETALS.map((petal, idx) => (
              <motion.svg
                key={idx}
                viewBox="0 0 24 14"
                style={{ width: petal.size, height: petal.size * 0.6 }}
                initial={{
                  x: petal.startX,
                  y: petal.startY,
                  rotate: petal.rot,
                  opacity: 0,
                }}
                animate={{
                  x: petal.endX,
                  y: petal.endY,
                  rotate: petal.rot + 65,
                  opacity: [0, 0.85, 0.85, 0],
                }}
                transition={{
                  duration: 1.45,
                  delay: petal.delay,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="absolute"
                aria-hidden="true"
              >
                <path
                  d="M1 7 C6 1, 16 1, 23 7 C16 13, 6 13, 1 7 Z"
                  fill="#D94B57"
                  fillOpacity="0.88"
                  stroke="#A82229"
                  strokeWidth="0.7"
                  strokeOpacity="0.6"
                />
              </motion.svg>
            ))}
          </div>

          {/* Flor de lótus em aquarela balançando levemente ao vento */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: [-2, 2.2, -1.2],
              y: [0, -4, 0],
            }}
            transition={{
              opacity: { duration: 0.45, ease: 'easeOut' },
              scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              rotate: { duration: 1.7, ease: 'easeInOut' },
              y: { duration: 1.7, ease: 'easeInOut' },
            }}
            style={{ transformOrigin: 'bottom center' }}
            className="relative z-10 w-72 sm:w-96"
          >
            <img
              src="/ilustracoes/lotus-agua.jpg"
              alt="Flor de lótus em aquarela sobre a água"
              style={{
                maskImage:
                  'radial-gradient(ellipse 46% 46% at 50% 50%, black 46%, transparent 96%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 46% 46% at 50% 50%, black 46%, transparent 96%)',
              }}
              className="h-auto w-full select-none mix-blend-multiply brightness-105 saturate-150 contrast-110"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 -mt-5 font-serif-editorial text-3xl font-medium tracking-tight text-[#141416] sm:text-4xl"
          >
            Lótus
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
