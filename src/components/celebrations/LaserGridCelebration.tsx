
import { useEffect, useState } from 'react';
import { Zap, Target, Grid3X3 } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface LaserGridCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

export const LaserGridCelebration = ({ message, onComplete }: LaserGridCelebrationProps) => {
  const [showContent, setShowContent] = useState(false);
  const [activeLines, setActiveLines] = useState<number[]>([]);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
    
    const lineInterval = setInterval(() => {
      setActiveLines(prev => {
        const newLines = Array.from({ length: Math.floor(Math.random() * 5) + 3 }, () => Math.floor(Math.random() * 20));
        return newLines;
      });
    }, 400);

    setTimeout(() => onComplete(), 5000);
    
    return () => clearInterval(lineInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Laser Grid */}
      <div className="absolute inset-0">
        {/* Horizontal Lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className={`absolute w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent transition-opacity duration-300 ${
              activeLines.includes(i) ? 'opacity-100' : 'opacity-30'
            }`}
            style={{
              top: `${10 + i * 8}%`,
              boxShadow: activeLines.includes(i) ? '0 0 20px #ef4444' : 'none'
            }}
          />
        ))}
        
        {/* Vertical Lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className={`absolute h-full w-0.5 bg-gradient-to-b from-transparent via-red-500 to-transparent transition-opacity duration-300 ${
              activeLines.includes(i + 10) ? 'opacity-100' : 'opacity-30'
            }`}
            style={{
              left: `${10 + i * 8}%`,
              boxShadow: activeLines.includes(i + 10) ? '0 0 20px #ef4444' : 'none'
            }}
          />
        ))}
      </div>

      {/* Laser Nodes */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 0.2}s`,
              boxShadow: '0 0 15px #ef4444'
            }}
          />
        ))}
      </div>

      {/* Targeting System */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute border-2 border-red-500 rounded-full animate-ping"
              style={{
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                left: `${-50 - i * 25}px`,
                top: `${-50 - i * 25}px`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s'
              }}
            />
          ))}
          <Target className="h-12 w-12 text-red-500 animate-pulse" style={{ filter: 'drop-shadow(0 0 10px #ef4444)' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className={`bg-black border-2 border-red-500 rounded-2xl p-8 text-center shadow-2xl max-w-md w-full relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-black animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="mb-6">
            <Grid3X3 
              className="h-16 w-16 mx-auto text-red-500 animate-pulse" 
              style={{ 
                filter: 'drop-shadow(0 0 15px #ef4444)',
                animationDuration: '1s'
              }} 
            />
          </div>
          
          <h2 className="text-3xl font-bold text-red-500 mb-4 font-mono" style={{ textShadow: '0 0 10px #ef4444' }}>
            {message.title}
          </h2>
          
          <p className="text-lg text-white mb-4 font-semibold">
            {message.message}
          </p>
          
          <p className="text-sm text-red-200 mb-6">
            {message.subtitle}
          </p>
          
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-lg text-lg font-bold font-mono animate-pulse">
            <Zap className="h-5 w-5 inline mr-2" />
            TARGET: ACQUIRED 🎯
          </div>
        </div>
      </div>
    </div>
  );
};
