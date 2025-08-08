
import { useState, useEffect } from 'react';
import { CelebrationController } from '../celebrations/CelebrationController';

interface PracticeCelebrationProps {
  trigger: {
    type: 'session_added' | 'daily_goal' | 'streak' | 'target_complete';
    value: number;
    context?: any;
  };
  onComplete: () => void;
}

export const PracticeCelebration = ({ trigger, onComplete }: PracticeCelebrationProps) => {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Check if celebration should be shown based on trigger
    const shouldCelebrate = checkCelebrationTrigger(trigger);
    if (shouldCelebrate) {
      setShowCelebration(true);
    }
  }, [trigger]);

  const checkCelebrationTrigger = (trigger: any) => {
    switch (trigger.type) {
      case 'session_added':
        return true; // Always celebrate new sessions
      case 'daily_goal':
        return trigger.value >= 100; // Celebrate daily goal completion
      case 'streak':
        return trigger.value > 0 && trigger.value % 3 === 0; // Celebrate every 3-day streak
      case 'target_complete':
        return trigger.value >= 100; // Celebrate target completion
      default:
        return false;
    }
  };

  if (!showCelebration) {
    return null;
  }

  return (
    <CelebrationController
      onComplete={() => {
        setShowCelebration(false);
        onComplete();
      }}
    />
  );
};
