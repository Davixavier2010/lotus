'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface PetalButtonLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

const BURST_PETALS = [
  { x: -42, y: 48, rot: -45, delay: 0, size: 20 },
  { x: -18, y: 62, rot: 25, delay: 0.03, size: 22 },
  { x: 6, y: 54, rot: -20, delay: 0.02, size: 19 },
  { x: 28, y: 64, rot: 55, delay: 0.04, size: 21 },
  { x: 46, y: 44, rot: 35, delay: 0.01, size: 18 },
  { x: -30, y: 36, rot: -65, delay: 0.05, size: 17 },
];

export function PetalButtonLink({
  href,
  className = '',
  children,
}: PetalButtonLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [bursting, setBursting] = useState(false);

  // Garante reset sempre que a rota mudar ou ao voltar para a página
  useEffect(() => {
    setBursting(false);
  }, [pathname]);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (
      shouldReduceMotion ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    e.preventDefault();
    setBursting(true);

    window.setTimeout(() => {
      router.push(href);
    }, 240);

    window.setTimeout(() => {
      setBursting(false);
    }, 600);
  }

  return (
    <span className="relative inline-flex">
      <motion.a
        href={href}
        onClick={handleClick}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
        className={className}
      >
        {children}
      </motion.a>

      <AnimatePresence>
        {bursting && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"
          >
            {BURST_PETALS.map((petal, idx) => (
              <motion.svg
                key={idx}
                viewBox="0 0 24 14"
                style={{ width: petal.size, height: petal.size * 0.6 }}
                initial={{ x: 0, y: 0, scale: 0.7, rotate: 0, opacity: 1 }}
                animate={{
                  x: petal.x,
                  y: petal.y,
                  scale: 1.05,
                  rotate: petal.rot,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 0.48,
                  delay: petal.delay,
                  times: [0, 0.7, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute z-30"
              >
                <path
                  d="M1 7 C6 1, 16 1, 23 7 C16 13, 6 13, 1 7 Z"
                  fill="#FF7A8A"
                  stroke="#E0243C"
                  strokeWidth="0.9"
                />
              </motion.svg>
            ))}
          </span>
        )}
      </AnimatePresence>
    </span>
  );
}
