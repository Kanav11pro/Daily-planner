
import { useEffect, useState } from 'react';
import { Zap, Star, Trophy } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface NeonGlowCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

export const NeonGlowCelebration = ({ message, onComplete }: NeonGlowCelebrationProps) => {
  const [showContent, setShowContent] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(1);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
    
    const pulseInterval = setInterval(() => {
      setPulseIntensity(prev => prev === 1 ? 1.2 : 1);
    }, 800);

    const completeTimer = setTimeout(() => onComplete(), 4000);
    
    return () => {
      clearInterval(pulseInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Simplified Neon Grid Background for mobile performance */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-4 sm:grid-cols-8 grid-rows-4 sm:grid-rows-8 h-full w-full">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="border border-cyan-500 animate-pulse"
              style={{
                animationDelay: `${i * 100}ms`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Reduced Electric Bolts for performance */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <Zap
            key={i}
            className="absolute text-yellow-400 animate-ping hidden sm:block"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${20 + Math.random() * 15}px`,
              animationDelay: `${i * 0.5}s`,
              filter: 'drop-shadow(0 0 8px #fbbf24)'
            }}
          />
        ))}
      </div>

      {/* Main Neon Box - Mobile Optimized */}
      <div 
        className={`bg-black rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center shadow-2xl max-w-sm sm:max-w-md w-full mx-4 relative overflow-hidden transition-all duration-700 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}
        style={{
          border: `2px solid #06b6d4`,
          boxShadow: `0 0 ${15 * pulseIntensity}px #06b6d4, inset 0 0 ${8 * pulseIntensity}px rgba(6, 182, 212, 0.1)`,
          transform: `scale(${0.95 + (pulseIntensity - 1) * 0.1})`
        }}
      >
        {/* Simplified Corner Lines for mobile */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 animate-pulse" style={{ filter: 'drop-shadow(0 0 3px #06b6d4)' }}></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 animate-pulse" style={{ filter: 'drop-shadow(0 0 3px #06b6d4)' }}></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400 animate-pulse" style={{ filter: 'drop-shadow(0 0 3px #06b6d4)' }}></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 animate-pulse" style={{ filter: 'drop-shadow(0 0 3px #06b6d4)' }}></div>

        <div className="relative z-10">
          <div className="mb-4 sm:mb-6">
            <Trophy 
              className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-cyan-400 animate-bounce" 
              style={{ 
                filter: 'drop-shadow(0 0 10px #06b6d4)',
                animationDuration: '1.5s'
              }} 
            />
          </div>
          
          <h2 
            className="text-xl sm:text-3xl font-bold text-cyan-400 mb-3 sm:mb-4 animate-pulse"
            style={{ 
              textShadow: '0 0 8px #06b6d4, 0 0 15px #06b6d4',
              fontFamily: 'monospace'
            }}
          >
            {message.title}
          </h2>
          
          <p 
            className="text-base sm:text-lg text-white mb-3 sm:mb-4 font-semibold"
            style={{ textShadow: '0 0 3px #ffffff' }}
          >
            {message.message}
          </p>
          
          <p 
            className="text-xs sm:text-sm text-cyan-200 mb-4 sm:mb-6"
            style={{ textShadow: '0 0 2px #06b6d4' }}
          >
            {message.subtitle}
          </p>
          
          <div className="flex justify-center space-x-1 mb-4 sm:mb-6">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400 fill-current animate-pulse" 
                style={{ 
                  animationDelay: `${i * 0.15}s`,
                  filter: 'drop-shadow(0 0 3px #fbbf24)'
                }}
              />
            ))}
          </div>
          
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-lg font-bold font-mono animate-pulse"
            style={{ 
              boxShadow: '0 0 10px #06b6d4',
              textShadow: '0 0 3px #ffffff'
            }}
          >
            EXCELLENCE DETECTED ⚡
          </div>
        </div>
      </div>
    </div>
  );
};
