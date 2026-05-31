import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ParticleFieldProps {
  count?: number;
  spread?: number;
  color?: string;
  maxSize?: number;
  duration?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 25,
  spread = 200,
  color = '#10B981',
  maxSize = 4,
  duration = 3,
}) => {
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * spread * 2,
      y: (Math.random() - 0.5) * spread * 2,
      size: Math.random() * maxSize + 1,
      delay: Math.random() * 2,
      duration: Math.random() * duration + duration,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, [count, spread, maxSize, duration]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: color,
            boxShadow: `0 0 ${p.size * 3}px ${color}`,
            left: '50%',
            top: '50%',
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: [0, p.opacity, p.opacity, 0],
            scale: [0, 1, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default ParticleField;
