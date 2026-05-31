import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, SkipForward } from 'lucide-react';

interface Slide {
  title: string;
  subtitle: string;
  description: string;
  bgUrl: string;
  overlay: string;
  button?: string;
}

const slides: Slide[] = [
  {
    title: 'The Telangana We Want To Protect',
    subtitle: 'Nature & Sustainability',
    description:
      "Telangana's natural ecosystems support biodiversity, public health, and sustainable development. Protecting these environments is essential for future generations.",
    bgUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    overlay: 'from-emerald-950/90 via-[#020617]/80 to-[#020617]/95',
  },
  {
    title: 'Urban Growth & Sustainability',
    subtitle: 'Smart City Infrastructure',
    description:
      'Rapid urban growth creates opportunities, but it also increases waste generation and environmental challenges. Smart cities require intelligent and sustainable waste management solutions.',
    bgUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80',
    overlay: 'from-blue-950/90 via-[#020617]/80 to-[#020617]/95',
  },
  {
    title: 'The Illegal Dumping Crisis',
    subtitle: 'Environmental Threat',
    description:
      'Illegal dumping pollutes ecosystems, damages public spaces, creates health risks, and increases municipal cleanup costs. Current systems are reactive and act only after waste has accumulated.',
    bgUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1920&q=80',
    overlay: 'from-red-950/90 via-[#020617]/80 to-[#020617]/95',
    button: 'Launch DumpShield AI',
  },
];

interface IntroSlidesProps {
  onComplete: () => void;
}

const IntroSlides: React.FC<IntroSlidesProps> = ({ onComplete }) => {
  const [current, setCurrent] = useState(0);
  const isLast = current === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[#020617]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src={slides[current].bgUrl}
              alt=""
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Dark overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t ${slides[current].overlay}`}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-12 md:p-20 pb-32">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-4"
            >
              {slides[current].subtitle}
            </motion.p>

            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase max-w-4xl mb-6 leading-tight"
            >
              {slides[current].title}
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed"
            >
              {slides[current].description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Skip button */}
      {!isLast && (
        <motion.button
          onClick={handleSkip}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute top-8 right-8 z-10 flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all rounded-lg"
        >
          <SkipForward className="w-3.5 h-3.5" />
          Skip
        </motion.button>
      )}

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex items-center justify-between z-10">
        {/* Progress dots */}
        <div className="flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current
                  ? 'w-8 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Next / Launch button */}
        <motion.button
          onClick={handleNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-3 px-8 py-4 font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-lg ${
            isLast
              ? 'bg-emerald-500 text-black hover:bg-emerald-400'
              : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
          }`}
        >
          {isLast ? 'Launch DumpShield AI' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default IntroSlides;
