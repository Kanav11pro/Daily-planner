
import { useState, useEffect } from 'react';
import { ConfettiCelebration } from './ConfettiCelebration';
import { FireworksCelebration } from './FireworksCelebration';
import { RisingStarsCelebration } from './RisingStarsCelebration';
import { ParticleBurstCelebration } from './ParticleBurstCelebration';
import { GlowingRingCelebration } from './GlowingRingCelebration';
import { RainbowCelebration } from './RainbowCelebration';
import { MagicSpellCelebration } from './MagicSpellCelebration';
import { DiamondRainCelebration } from './DiamondRainCelebration';
import { LightningBoltCelebration } from './LightningBoltCelebration';
import { CrystalFormationCelebration } from './CrystalFormationCelebration';
import { SunburstCelebration } from './SunburstCelebration';
import { MeteorShowerCelebration } from './MeteorShowerCelebration';
import { FloralBloomCelebration } from './FloralBloomCelebration';
import { OceanWaveCelebration } from './OceanWaveCelebration';

interface CelebrationControllerProps {
  onComplete: () => void;
}

const celebrationTypes = [
  { component: ConfettiCelebration, name: 'Confetti Rain' },
  { component: FireworksCelebration, name: 'Fireworks' },
  { component: RisingStarsCelebration, name: 'Rising Stars' },
  { component: ParticleBurstCelebration, name: 'Particle Burst' },
  { component: GlowingRingCelebration, name: 'Glowing Ring' },
  { component: RainbowCelebration, name: 'Rainbow Magic' },
  { component: MagicSpellCelebration, name: 'Magic Spell' },
  { component: DiamondRainCelebration, name: 'Diamond Rain' },
  { component: LightningBoltCelebration, name: 'Lightning Bolt' },
  { component: CrystalFormationCelebration, name: 'Crystal Formation' },
  { component: SunburstCelebration, name: 'Sunburst' },
  { component: MeteorShowerCelebration, name: 'Meteor Shower' },
  { component: FloralBloomCelebration, name: 'Floral Bloom' },
  { component: OceanWaveCelebration, name: 'Ocean Wave' }
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
    title: "Magnificent Progress! 🌟",
    message: "You're turning dreams into reality, one step at a time!",
    subtitle: "This is how legends are made - through consistent action!"
  },
  {
    title: "Spectacular Achievement! ⚡",
    message: "Your commitment to excellence is truly inspiring!",
    subtitle: "You're developing the mindset of a champion!"
  },
  {
    title: "Amazing Breakthrough! 🔥",
    message: "Every task completed is a victory worth celebrating!",
    subtitle: "Success stories are written by students like you!"
  },
  {
    title: "Extraordinary Focus! 🎊",
    message: "You're showing the world what determination looks like!",
    subtitle: "Your consistency today builds your success tomorrow!"
  },
  {
    title: "Remarkable Achievement! 🌈",
    message: "You're not just studying, you're creating your future!",
    subtitle: "Every great achiever started with the discipline you're showing!"
  }
];

export const CelebrationController = ({ onComplete }: CelebrationControllerProps) => {
  const [currentCelebration, setCurrentCelebration] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    // Rotate celebration types and messages randomly
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
