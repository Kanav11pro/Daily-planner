
import { useState, useEffect } from 'react';
import { ConfettiCelebration } from './ConfettiCelebration';
import { FireworksCelebration } from './FireworksCelebration';
import { RisingStarsCelebration } from './RisingStarsCelebration';
import { ParticleBurstCelebration } from './ParticleBurstCelebration';
import { GlowingRingCelebration } from './GlowingRingCelebration';

interface CelebrationControllerProps {
  onComplete: () => void;
}

const celebrationTypes = [
  { component: ConfettiCelebration, name: 'Confetti Rain' },
  { component: FireworksCelebration, name: 'Fireworks' },
  { component: RisingStarsCelebration, name: 'Rising Stars' },
  { component: ParticleBurstCelebration, name: 'Particle Burst' },
  { component: GlowingRingCelebration, name: 'Glowing Ring' }
];

const motivationalMessages = [
  {
    title: "Outstanding Achievement! 🎯",
    message: "You're building the foundation for success, one task at a time!",
    subtitle: "Every completed task brings you closer to your dream college!"
  },
  {
    title: "Incredible Progress! 🚀",
    message: "Your dedication is paying off! Keep this momentum going!",
    subtitle: "Champions are made through consistent effort like this!"
  },
  {
    title: "Phenomenal Work! ⭐",
    message: "You're not just completing tasks, you're building character!",
    subtitle: "Future toppers have the same discipline you're showing!"
  },
  {
    title: "Brilliant Execution! 💎",
    message: "Excellence is a habit, and you're mastering it perfectly!",
    subtitle: "Your future self will thank you for this dedication!"
  },
  {
    title: "Exceptional Dedication! 🏆",
    message: "You're proving that success is earned through persistence!",
    subtitle: "Every IIT/NEET topper started with discipline like yours!"
  }
];

export const CelebrationController = ({ onComplete }: CelebrationControllerProps) => {
  const [currentCelebration, setCurrentCelebration] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    // Rotate celebration types and messages
    const celebrationIndex = Math.floor(Math.random() * celebrationTypes.length);
    const messageIndex = Math.floor(Math.random() * motivationalMessages.length);
    
    setCurrentCelebration(celebrationIndex);
    setCurrentMessage(messageIndex);
  }, []);

  const CelebrationComponent = celebrationTypes[currentCelebration].component;
  const message = motivationalMessages[currentMessage];

  return (
    <CelebrationComponent 
      message={message}
      onComplete={onComplete}
    />
  );
};
