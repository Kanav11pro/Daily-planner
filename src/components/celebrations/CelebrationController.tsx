
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
  { component: NeonGlowCelebration, name: 'JEE Victory Glow', theme: 'cyberpunk' },
  { component: TypewriterCelebration, name: 'Formula Master', theme: 'tech' },
  { component: QuantumFieldCelebration, name: 'Physics Champion', theme: 'futuristic' },
  { component: HologramCelebration, name: 'IIT Dream Vision', theme: 'sci-fi' },
  { component: LaserGridCelebration, name: 'Study Focus Grid', theme: 'cyberpunk' },
  { component: DigitalRainCelebration, name: 'Knowledge Matrix', theme: 'matrix' },
  { component: ElectronicPulseCelebration, name: 'Revision Pulse', theme: 'tech' },
  { component: CosmicExplosionCelebration, name: 'Breakthrough Blast', theme: 'space' },
  { component: FireworksCelebration, name: 'Problem Solved', theme: 'explosive' },
  { component: RisingStarsCelebration, name: 'JEE Star Rising', theme: 'celestial' },
  { component: ParticleBurstCelebration, name: 'Concept Clarity', theme: 'energy' },
  { component: GlowingRingCelebration, name: 'Topper Circle', theme: 'futuristic' },
  { component: BookFlipCelebration, name: 'Chapter Complete', theme: 'academic' },
  { component: ConfettiCelebration, name: 'Study Victory', theme: 'classic' }
];

const motivationalMessages = [
  {
    title: "CHAPTER MASTERED! 🎯",
    message: "Outstanding! You've conquered another challenging topic. This is how JEE toppers build their success!",
    subtitle: "Your consistent effort is turning you into a JEE champion. Keep this momentum going!"
  },
  {
    title: "PROBLEM CRUSHER! ⚡",
    message: "Incredible problem-solving skills! You're developing the analytical mind of a future engineer.",
    subtitle: "Each solved problem brings you closer to your IIT dream. You're unstoppable!"
  },
  {
    title: "FORMULA WARRIOR! 🧠",
    message: "Your mastery of concepts is remarkable! This is exactly how JEE toppers think and solve.",
    subtitle: "You're not just learning - you're becoming a physics, chemistry, and math genius!"
  },
  {
    title: "STUDY STREAK CHAMPION! 🔥",
    message: "Your dedication is unmatched! This consistent effort is what separates toppers from the rest.",
    subtitle: "Every completed task is a step closer to your dream college. You're building success habits!"
  },
  {
    title: "CONCEPT CONQUEROR! 🏆",
    message: "Amazing work! You're mastering concepts that will be crucial for JEE success.",
    subtitle: "Your understanding is deepening with every topic. This is how champions are made!"
  },
  {
    title: "REVISION MASTER! 📚",
    message: "Perfect! Your revision strategy is paying off. This is how you'll ace the JEE exam.",
    subtitle: "Strong foundations lead to strong results. You're preparing like a true topper!"
  },
  {
    title: "SPEED SOLVER! ⚡",
    message: "Impressive speed and accuracy! You're developing the timing skills crucial for JEE.",
    subtitle: "Your problem-solving velocity is increasing. This is competitive exam excellence!"
  },
  {
    title: "MOCK TEST HERO! 🎯",
    message: "Outstanding performance! You're showing the consistency that leads to JEE success.",
    subtitle: "Your scores are improving because of this dedicated practice. Keep pushing forward!"
  },
  {
    title: "PHYSICS PHENOMENON! 🚀",
    message: "Your grasp of physics concepts is phenomenal! Future engineers think like this.",
    subtitle: "You're building the analytical skills that will make you stand out in JEE!"
  },
  {
    title: "MATH MAGICIAN! ✨",
    message: "Brilliant mathematical thinking! Your problem-solving approach is getting sharper.",
    subtitle: "This mathematical fluency is your ticket to JEE success. You're becoming unstoppable!"
  },
  {
    title: "CHEMISTRY CHAMPION! 🧪",
    message: "Excellent understanding of chemical concepts! Your knowledge is expanding rapidly.",
    subtitle: "You're mastering the reactions and equations that will help you crack JEE!"
  },
  {
    title: "TIME MANAGEMENT MASTER! ⏰",
    message: "Perfect time utilization! This efficiency will be your superpower in the actual exam.",
    subtitle: "You're learning to work smart, not just hard. This is how toppers optimize their study!"
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
