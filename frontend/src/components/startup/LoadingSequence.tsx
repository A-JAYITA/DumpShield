import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

interface LoadLine {
  text: string;
  delay: number;
}

const loadLines: LoadLine[] = [
  { text: 'Initializing Civic Intelligence Engine...', delay: 0 },
  { text: 'Loading Geospatial Intelligence...', delay: 400 },
  { text: 'Loading Hotspot Analytics...', delay: 800 },
  { text: 'Loading Risk Forecast Models...', delay: 1200 },
  { text: 'Launching DumpShield AI...', delay: 1600 },
];

interface LoadingSequenceProps {
  onComplete: () => void;
}

const LoadingSequence: React.FC<LoadingSequenceProps> = ({ onComplete }) => {
  const [completedLines, setCompletedLines] = useState<number[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadLines.forEach((line, i) => {
      setTimeout(() => {
        setCompletedLines((prev) => [...prev, i]);
      }, line.delay + 300);
    });

    setTimeout(() => {
      setShowAll(true);
    }, 2200);

    setTimeout(() => {
      onComplete();
    }, 3000);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-lg px-8">
        {/* Logo pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-10"
        >
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-6 h-6 text-emerald-500" />
            </motion.div>
          </div>
        </motion.div>

        {/* Loading lines */}
        <div className="space-y-4">
          {loadLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: completedLines.includes(i) ? 1 : 0.3,
                x: 0,
              }}
              transition={{ duration: 0.4, delay: line.delay / 1000 }}
              className="flex items-center gap-3"
            >
              {completedLines.includes(i) ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="w-5 h-5 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center shrink-0"
                >
                  <Check className="w-3 h-3 text-emerald-500" />
                </motion.div>
              ) : (
                <div className="w-5 h-5 border border-slate-700 rounded-full shrink-0" />
              )}
              <span
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                  completedLines.includes(i) ? 'text-emerald-500' : 'text-slate-600'
                }`}
              >
                {line.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-8 h-[2px] bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: '0%' }}
            animate={{ width: showAll ? '100%' : `${(completedLines.length / loadLines.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingSequence;
