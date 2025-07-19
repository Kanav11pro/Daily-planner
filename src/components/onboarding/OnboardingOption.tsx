
import { ReactNode } from 'react';

interface OnboardingOptionProps {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
  emoji?: string;
  className?: string;
}

export const OnboardingOption = ({ 
  children, 
  selected, 
  onClick, 
  emoji, 
  className = "" 
}: OnboardingOptionProps) => {
  return (
    <div 
      className={`
        flex items-center space-x-3 p-4 rounded-2xl border-2 
        ${selected 
          ? 'border-white bg-white/20 shadow-lg shadow-white/20' 
          : 'border-white/20 hover:border-white/40 hover:bg-white/10'
        } 
        transition-all duration-300 cursor-pointer backdrop-blur-sm
        transform hover:scale-105 hover:shadow-xl
        ${className}
      `}
      onClick={onClick}
    >
      {emoji && <span className="text-2xl">{emoji}</span>}
      <div className="flex-1 text-white font-medium">
        {children}
      </div>
      {selected && (
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
        </div>
      )}
    </div>
  );
};
