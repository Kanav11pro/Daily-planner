
import { EnhancedTargetTracker } from './EnhancedTargetTracker';

interface TargetTrackerProps {
  detailed?: boolean;
}

export const TargetTracker = ({ detailed = false }: TargetTrackerProps) => {
  return <EnhancedTargetTracker detailed={detailed} />;
};
