
import { CelebrationController } from './celebrations/CelebrationController';

interface CelebrationProps {
  onComplete?: () => void;
}

export const Celebration = ({ onComplete }: CelebrationProps) => {
  return (
    <CelebrationController 
      onComplete={onComplete || (() => {})}
    />
  );
};
