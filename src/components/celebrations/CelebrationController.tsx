
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

const motivationalMessages = [
  {
    title: "SYSTEM OVERRIDE: SUCCESS DETECTED! 🚀",
    message: "Neural pathways optimized. Knowledge acquisition: COMPLETE.",
    subtitle: "Your dedication is rewriting the code of success!"
  },
  {
    title: "QUANTUM ACHIEVEMENT UNLOCKED! ⚡",
    message: "Processing excellence... Result: EXCEPTIONAL PERFORMANCE.",
    subtitle: "Every task completed accelerates your ascension to greatness!"
  },
  {
    title: "DIGITAL MASTERY ACHIEVED! 💎",
    message: "Algorithm status: SUPERIOR. Performance metrics: OFF THE CHARTS.",
    subtitle: "Your discipline is programming tomorrow's victories!"
  },
  {
    title: "CYBERNETIC EXCELLENCE CONFIRMED! 🔥",
    message: "Data analysis complete. Conclusion: UNSTOPPABLE FORCE DETECTED.",
    subtitle: "You're not just studying - you're engineering your destiny!"
  },
  {
    title: "NEURAL NETWORK OPTIMIZATION! 🧠",
    message: "Synaptic connections enhanced. Learning capacity: MAXIMIZED.",
    subtitle: "Each concept mastered upgrades your intellectual hardware!"
  },
  {
    title: "MATRIX-LEVEL PERFORMANCE! 🎯",
    message: "Reality.exe has stopped working. Reason: TOO MUCH EXCELLENCE.",
    subtitle: "You're bending the rules of possibility with pure determination!"
  },
  {
    title: "HOLOGRAPHIC ACHIEVEMENT! ✨",
    message: "Projecting success at quantum frequencies. Signal strength: MAXIMUM.",
    subtitle: "Your potential is materializing into tangible results!"
  },
  {
    title: "ELECTROMAGNETIC VICTORY! ⚡",
    message: "Energy levels: CRITICAL. Success probability: 99.9% GUARANTEED.",
    subtitle: "You're generating the power to transform dreams into reality!"
  },
  {
    title: "PHOTONIC BREAKTHROUGH! 💫",
    message: "Light-speed learning detected. Velocity: BEYOND MEASURABLE.",
    subtitle: "At this rate, you'll reach your goals faster than light itself!"
  },
  {
    title: "COSMIC SYNCHRONIZATION! 🌟",
    message: "Universal alignment confirmed. Destiny status: ON TRACK.",
    subtitle: "The universe is conspiring to make your success inevitable!"
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
