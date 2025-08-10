
import { CelebrationController } from './celebrations/CelebrationController';

interface CelebrationProps {
  onComplete?: () => void;
}

export const Celebration = ({ onComplete }: CelebrationProps) => {
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto">
      <CelebrationController 
        onComplete={onComplete || (() => {})}
      />
    </div>
  );
};
