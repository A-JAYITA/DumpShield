import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import LeafAnimation from './LeafAnimation';
import LogoReveal from './LogoReveal';
import IntroSlides from './IntroSlides';
import LoadingSequence from './LoadingSequence';

type Stage = 'leaf' | 'logo' | 'slides' | 'loading';

interface StartupExperienceProps {
  onComplete: () => void;
}

const StartupExperience: React.FC<StartupExperienceProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<Stage>('leaf');

  const handleLeafComplete = useCallback(() => {
    setStage('logo');
  }, []);

  const handleLogoComplete = useCallback(() => {
    setStage('slides');
  }, []);

  const handleSlidesComplete = useCallback(() => {
    setStage('loading');
  }, []);

  const handleLoadingComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <AnimatePresence mode="wait">
      {stage === 'leaf' && (
        <LeafAnimation key="leaf" onComplete={handleLeafComplete} />
      )}
      {stage === 'logo' && (
        <LogoReveal key="logo" onComplete={handleLogoComplete} />
      )}
      {stage === 'slides' && (
        <IntroSlides key="slides" onComplete={handleSlidesComplete} />
      )}
      {stage === 'loading' && (
        <LoadingSequence key="loading" onComplete={handleLoadingComplete} />
      )}
    </AnimatePresence>
  );
};

export default StartupExperience;
