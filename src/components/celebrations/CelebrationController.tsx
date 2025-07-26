
import { useState, useEffect } from 'react';
import { ConfettiCelebration } from './ConfettiCelebration';
import { FireworksCelebration } from './FireworksCelebration';
import { RisingStarsCelebration } from './RisingStarsCelebration';
import { ParticleBurstCelebration } from './ParticleBurstCelebration';
import { GlowingRingCelebration } from './GlowingRingCelebration';
import { BalloonRiseCelebration } from './BalloonRiseCelebration';
import { TypewriterCelebration } from './TypewriterCelebration';
import { NeonGlowCelebration } from './NeonGlowCelebration';
import { PaperPlaneCelebration } from './PaperPlaneCelebration';
import { RainbowWaveCelebration } from './RainbowWaveCelebration';
import { CosmicExplosionCelebration } from './CosmicExplosionCelebration';
import { BookFlipCelebration } from './BookFlipCelebration';

interface CelebrationControllerProps {
  onComplete: () => void;
}

const celebrationTypes = [
  { component: ConfettiCelebration, name: 'Confetti Rain', theme: 'classic' },
  { component: FireworksCelebration, name: 'Fireworks', theme: 'explosive' },
  { component: RisingStarsCelebration, name: 'Rising Stars', theme: 'celestial' },
  { component: ParticleBurstCelebration, name: 'Particle Burst', theme: 'energy' },
  { component: GlowingRingCelebration, name: 'Glowing Ring', theme: 'futuristic' },
  { component: BalloonRiseCelebration, name: 'Balloon Rise', theme: 'playful' },
  { component: TypewriterCelebration, name: 'Code Complete', theme: 'tech' },
  { component: NeonGlowCelebration, name: 'Neon Glow', theme: 'cyberpunk' },
  { component: PaperPlaneCelebration, name: 'Paper Plane', theme: 'journey' },
  { component: RainbowWaveCelebration, name: 'Rainbow Wave', theme: 'colorful' },
  { component: CosmicExplosionCelebration, name: 'Cosmic Explosion', theme: 'space' },
  { component: BookFlipCelebration, name: 'Knowledge Flip', theme: 'academic' }
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
  },
  {
    title: "Masterful Performance! 🌟",
    message: "Your commitment to excellence is truly inspiring!",
    subtitle: "This is how dreams transform into reality!"
  },
  {
    title: "Academic Warrior! ⚡",
    message: "You're conquering challenges with incredible determination!",
    subtitle: "Success recognizes those who never give up!"
  },
  {
    title: "Knowledge Champion! 📚",
    message: "Every concept you master makes you stronger!",
    subtitle: "Education is your superpower - keep wielding it!"
  },
  {
    title: "Future Leader! 👑",
    message: "Your discipline today shapes tomorrow's achievements!",
    subtitle: "Great minds are built through consistent effort!"
  },
  {
    title: "Excellence Personified! 🎖️",
    message: "You're not just studying, you're crafting your destiny!",
    subtitle: "Every step forward is a step towards greatness!"
  }
];

export const CelebrationController = ({ onComplete }: CelebrationControllerProps) => {
  const [currentCelebration, setCurrentCelebration] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    // Rotate celebration types and messages randomly for variety
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
