
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
  { component: NeonGlowCelebration, name: 'Victory Glow', theme: 'cyberpunk' },
  { component: TypewriterCelebration, name: 'Success Formula', theme: 'tech' },
  { component: QuantumFieldCelebration, name: 'Excellence Field', theme: 'futuristic' },
  { component: HologramCelebration, name: 'Achievement Vision', theme: 'sci-fi' },
  { component: LaserGridCelebration, name: 'Focus Grid', theme: 'cyberpunk' },
  { component: DigitalRainCelebration, name: 'Knowledge Rain', theme: 'matrix' },
  { component: ElectronicPulseCelebration, name: 'Success Pulse', theme: 'tech' },
  { component: CosmicExplosionCelebration, name: 'Victory Explosion', theme: 'space' },
  { component: FireworksCelebration, name: 'Achievement Burst', theme: 'explosive' },
  { component: RisingStarsCelebration, name: 'Rising Champion', theme: 'celestial' },
  { component: ParticleBurstCelebration, name: 'Energy Burst', theme: 'energy' },
  { component: GlowingRingCelebration, name: 'Champion Ring', theme: 'futuristic' },
  { component: BookFlipCelebration, name: 'Knowledge Master', theme: 'academic' },
  { component: ConfettiCelebration, name: 'Victory Rain', theme: 'classic' }
];

const motivationalMessages = [
  {
    title: "MISSION ACCOMPLISHED! 🚀",
    message: "Your dedication is paying off. Every task completed brings you closer to JEE success!",
    subtitle: "Keep this momentum going - you're building the habits of a topper!"
  },
  {
    title: "EXCELLENCE UNLOCKED! ⚡",
    message: "Outstanding work! Your consistent effort is the key to cracking JEE.",
    subtitle: "Each step forward is a step closer to your dream college!"
  },
  {
    title: "CHAMPION MINDSET ACTIVATED! 💎",
    message: "Your focus and determination are remarkable. This is how JEE toppers think!",
    subtitle: "You're not just studying - you're mastering the art of success!"
  },
  {
    title: "VICTORY STREAK CONTINUES! 🔥",
    message: "Incredible progress! Your discipline is setting you apart from the competition.",
    subtitle: "Every completed task is proof of your JEE preparation strength!"
  },
  {
    title: "TOPPER LEVEL ACHIEVED! 🧠",
    message: "Your brain is getting stronger with every challenge you complete!",
    subtitle: "This is exactly how JEE champions build their success foundation!"
  },
  {
    title: "UNSTOPPABLE FORCE! 🎯",
    message: "Your consistency is your superpower. JEE success demands exactly this mindset!",
    subtitle: "You're proving that dedication always defeats talent without hard work!"
  },
  {
    title: "DREAM BUILDER! ✨",
    message: "Every task you complete is a brick in your dream college foundation.",
    subtitle: "Your future self will thank you for this dedication!"
  },
  {
    title: "SUCCESS MAGNET! ⚡",
    message: "You're attracting success with your incredible work ethic!",
    subtitle: "This is the energy that transforms JEE dreams into reality!"
  },
  {
    title: "BREAKTHROUGH MOMENT! 💫",
    message: "Your speed of learning is accelerating. This is peak performance mode!",
    subtitle: "At this pace, your JEE goals are not just possible - they're inevitable!"
  },
  {
    title: "CHAMPION IN ACTION! 🌟",
    message: "The universe rewards those who never give up. You're living proof!",
    subtitle: "Your persistence is writing the success story of your JEE journey!"
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
    const messageIndex = Math.floor(Math.random() * motivationalMessages.length);
    
    setCurrentCelebration(actualIndex);
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
