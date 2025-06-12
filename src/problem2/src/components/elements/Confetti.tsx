import React from 'react';
import { motion } from 'framer-motion';

export interface ConfettiProps {
  isVisible: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    x: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-2 h-2"
          style={{
            backgroundColor: piece.color,
            left: `${piece.x}%`,
            top: -10,
          }}
          initial={{ y: 0, rotate: 0 }}
          animate={{
            y: '100vh',
            rotate: 360,
          }}
          transition={{
            duration: 3,
            delay: piece.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}; 