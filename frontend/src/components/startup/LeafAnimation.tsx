import React from 'react';
import { motion } from 'framer-motion';
import ParticleField from './ParticleField';

const LeafSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 100 120"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="leafGrad" x1="50" y1="0" x2="50" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <filter id="leafGlow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path
      d="M50 5 C20 25, 5 55, 10 85 C15 105, 35 115, 50 118 C65 115, 85 105, 90 85 C95 55, 80 25, 50 5Z"
      fill="url(#leafGrad)"
      filter="url(#leafGlow)"
    />
    <path
      d="M50 15 L50 108"
      stroke="#059669"
      strokeWidth="1.5"
      opacity="0.6"
    />
    <path
      d="M50 35 L30 50 M50 50 L28 68 M50 65 L32 82 M50 80 L38 95"
      stroke="#059669"
      strokeWidth="1"
      opacity="0.4"
    />
    <path
      d="M50 35 L70 50 M50 50 L72 68 M50 65 L68 82 M50 80 L62 95"
      stroke="#059669"
      strokeWidth="1"
      opacity="0.4"
    />
  </svg>
);

interface LeafAnimationProps {
  onComplete: () => void;
}

const LeafAnimation: React.FC<LeafAnimationProps> = ({ onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background radial glow */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2, delay: 2 }}
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(16,185,129,0.15) 0%, transparent 60%)',
        }}
      />

      {/* Particles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute"
      >
        <ParticleField count={30} spread={250} color="#10B981" maxSize={3} duration={4} />
      </motion.div>

      {/* Additional burst particles that spread outward */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 3.5, duration: 1.5 }}
        className="absolute"
      >
        <ParticleField count={20} spread={400} color="#34D399" maxSize={2} duration={2} />
      </motion.div>

      {/* Leaf */}
      <motion.div
        className="absolute"
        initial={{ y: 300, opacity: 0, scale: 0.6 }}
        animate={{
          y: [300, 100, 0],
          opacity: [0, 1, 1],
          scale: [0.6, 0.9, 1],
        }}
        transition={{
          duration: 4,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.6, 1],
        }}
        onAnimationComplete={onComplete}
      >
        {/* Leaf glow */}
        <motion.div
          className="absolute -inset-10 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0.8] }}
          transition={{ duration: 4, delay: 1 }}
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)',
          }}
        />

        <LeafSVG className="w-24 h-28 relative z-10" />
      </motion.div>
    </motion.div>
  );
};

export default LeafAnimation;
