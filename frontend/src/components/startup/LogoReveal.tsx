import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface LogoRevealProps {
  onComplete: () => void;
}

const LogoReveal: React.FC<LogoRevealProps> = ({ onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020617]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 2000);
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(16,185,129,0.12) 0%, transparent 55%)',
        }}
      />

      {/* Logo icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.5)]">
          <Zap className="w-10 h-10 text-black" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: 30, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase mb-4"
      >
        DUMP<span className="text-emerald-500">SHIELD</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-xl md:text-2xl font-black text-emerald-500/60 uppercase tracking-[0.4em] mb-2"
      >
        AI
      </motion.p>

      {/* Tagline */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="text-sm md:text-base font-bold text-slate-400 tracking-widest mt-6"
      >
        Predict. Prevent. Protect Hyderabad.
      </motion.p>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-32 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent mt-8"
      />
    </motion.div>
  );
};

export default LogoReveal;
