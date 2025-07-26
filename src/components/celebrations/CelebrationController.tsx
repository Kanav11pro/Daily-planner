
import { useState, useEffect } from 'react';
import { ConfettiCelebration } from './ConfettiCelebration';
import { FireworksCelebration } from './FireworksCelebration';
import { RisingStarsCelebration } from './RisingStarsCelebration';
import { ParticleBurstCelebration } from './ParticleBurstCelebration';
import { GlowingRingCelebration } from './GlowingRingCelebration';
import { TypewriterCelebration } from './TypewriterCelebration';
import { NeonGlowCelebration } from './NeonGlowCelebration';
import { CosmicExplosionCelebration } from './CosmicExplosionCelebration';
import { BookFlipCelebration } from './BookFlipCelebration';
import { QuantumFieldCelebration } from './QuantumFieldCelebration';
import { HologramCelebration } from './HologramCelebration';
import { LaserGridCelebration } from './LaserGridCelebration';
import { DigitalRainCelebration } from './DigitalRainCelebration';
import { ElectronicPulseCelebration } from './ElectronicPulseCelebration';

interface CelebrationControllerProps {
  onComplete: () => void;
}

const celebrationTypes = [
  { component: NeonGlowCelebration, name: 'Neon Glow', theme: 'cyberpunk' },
  { component: TypewriterCelebration, name: 'Code Complete', theme: 'tech' },
  { component: QuantumFieldCelebration, name: 'Quantum Field', theme: 'futuristic' },
  { component: HologramCelebration, name: 'Hologram', theme: 'sci-fi' },
  { component: LaserGridCelebration, name: 'Laser Grid', theme: 'cyberpunk' },
  { component: DigitalRainCelebration, name: 'Digital Rain', theme: 'matrix' },
  { component: ElectronicPulseCelebration, name: 'Electronic Pulse', theme: 'tech' },
  { component: CosmicExplosionCelebration, name: 'Cosmic Explosion', theme: 'space' },
  { component: FireworksCelebration, name: 'Fireworks', theme: 'explosive' },
  { component: RisingStarsCelebration, name: 'Rising Stars', theme: 'celestial' },
  { component: ParticleBurstCelebration, name: 'Particle Burst', theme: 'energy' },
  { component: GlowingRingCelebration, name: 'Glowing Ring', theme: 'futuristic' },
  { component: BookFlipCelebration, name: 'Knowledge Flip', theme: 'academic' },
  { component: ConfettiCelebration, name: 'Confetti Rain', theme: 'classic' }
];

const jeeMotivationalMessages = [
  {
    title: "BREAKTHROUGH ACHIEVED! 🚀",
    message: "Excellence unlocked. Your dedication is building tomorrow's success.",
    subtitle: "Every completed task brings you closer to your JEE dreams!"
  },
  {
    title: "MASTERY LEVEL UNLOCKED! ⚡",
    message: "Outstanding performance detected. Your potential is limitless.",
    subtitle: "Keep pushing boundaries - JEE success awaits the persistent!"
  },
  {
    title: "CHAMPION MINDSET ACTIVATED! 💎",
    message: "Superior focus achieved. You're operating at peak performance.",
    subtitle: "Your determination is forging the path to engineering excellence!"
  },
  {
    title: "VICTORY SEQUENCE INITIATED! 🔥",
    message: "Exceptional progress confirmed. You're unstoppable.",
    subtitle: "Each concept mastered is a step closer to your dream college!"
  },
  {
    title: "GENIUS MODE ACTIVATED! 🧠",
    message: "Mental agility maximized. Your learning capacity is extraordinary.",
    subtitle: "Transform every challenge into an opportunity for growth!"
  },
  {
    title: "SUCCESS PROTOCOL ENGAGED! 🎯",
    message: "Peak performance achieved. Your consistency is remarkable.",
    subtitle: "You're not just preparing for JEE - you're becoming unstoppable!"
  },
  {
    title: "EXCELLENCE FREQUENCY REACHED! ✨",
    message: "Your commitment is generating incredible momentum.",
    subtitle: "Every moment of focus multiplies your chances of success!"
  },
  {
    title: "CHAMPION ENERGY DETECTED! ⚡",
    message: "Your dedication is powering extraordinary results.",
    subtitle: "You have the strength to turn your JEE dreams into reality!"
  },
  {
    title: "BREAKTHROUGH VELOCITY! 💫",
    message: "Learning at incredible speed. Your progress is phenomenal.",
    subtitle: "At this pace, nothing can stop you from reaching your goals!"
  },
  {
    title: "DESTINY ALIGNMENT COMPLETE! 🌟",
    message: "Perfect synchronization achieved. Success is inevitable.",
    subtitle: "The universe is supporting your journey to engineering greatness!"
  }
];

export const CelebrationController = ({ onComplete }: CelebrationControllerProps) => {
  const [currentCelebration, setCurrentCelebration] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    // Prioritize cyberpunk and tech themes
    const cyberpunkThemes = celebrationTypes.filter(c => 
      c.theme === 'cyberpunk' || c.theme === 'tech' || c.theme === 'futuristic' || c.theme === 'matrix' || c.theme === 'sci-fi'
    );
    const otherThemes = celebrationTypes.filter(c => 
      c.theme !== 'cyberpunk' && c.theme !== 'tech' && c.theme !== 'futuristic' && c.theme !== 'matrix' && c.theme !== 'sci-fi'
    );
    
    // 70% chance for cyberpunk/tech themes, 30% for others
    const useAdvancedTheme = Math.random() < 0.7;
    const selectedThemes = useAdvancedTheme ? cyberpunkThemes : otherThemes;
    
    const celebrationIndex = Math.floor(Math.random() * selectedThemes.length);
    const actualIndex = celebrationTypes.indexOf(selectedThemes[celebrationIndex]);
    const messageIndex = Math.floor(Math.random() * jeeMotivationalMessages.length);
    
    setCurrentCelebration(actualIndex);
    setCurrentMessage(messageIndex);
  }, []);

  const CelebrationComponent = celebrationTypes[currentCelebration].component;
  const message = jeeMotivationalMessages[currentMessage];

  return (
    <CelebrationComponent 
      message={message}
      onComplete={onComplete}
    />
  );
};
