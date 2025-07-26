
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
      setPulseIntensity(prev => prev === 1 ? 1.5 : 1);
    }, 500);

    setTimeout(() => onComplete(), 5000);
    
    return () => clearInterval(pulseInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Neon Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
          {[...Array(64)].map((_, i) => (
            <div
              key={i}
              className="border border-cyan-500 animate-pulse"
              style={{
                animationDelay: `${i * 50}ms`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Electric Bolts */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <Zap
            key={i}
            className="absolute text-yellow-400 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${30 + Math.random() * 20}px`,
              animationDelay: `${i * 0.3}s`,
              filter: 'drop-shadow(0 0 10px #fbbf24)'
            }}
          />
        ))}
      </div>

      {/* Main Neon Box */}
      <div 
        className={`bg-black rounded-2xl p-8 text-center shadow-2xl max-w-md w-full relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}
        style={{
          border: `3px solid #06b6d4`,
          boxShadow: `0 0 ${20 * pulseIntensity}px #06b6d4, inset 0 0 ${10 * pulseIntensity}px rgba(6, 182, 212, 0.1)`,
          transform: `scale(${pulseIntensity})`
        }}
      >
        {/* Animated Corner Lines */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 animate-pulse" style={{ filter: 'drop-shadow(0 0 5px #06b6d4)' }}></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 animate-pulse" style={{ filter: 'drop-shadow(0 0 5px #06b6d4)' }}></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 animate-pulse" style={{ filter: 'drop-shadow(0 0 5px #06b6d4)' }}></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 animate-pulse" style={{ filter: 'drop-shadow(0 0 5px #06b6d4)' }}></div>

        <div className="relative z-10">
          <div className="mb-6">
            <Trophy 
              className="h-20 w-20 mx-auto text-cyan-400 animate-bounce" 
              style={{ 
                filter: 'drop-shadow(0 0 15px #06b6d4)',
                animationDuration: '1s'
              }} 
            />
          </div>
          
          <h2 
            className="text-4xl font-bold text-cyan-400 mb-4 animate-pulse"
            style={{ 
              textShadow: '0 0 10px #06b6d4, 0 0 20px #06b6d4',
              fontFamily: 'monospace'
            }}
          >
            {message.title}
          </h2>
          
          <p 
            className="text-lg text-white mb-4 font-semibold"
            style={{ textShadow: '0 0 5px #ffffff' }}
          >
            {message.message}
          </p>
          
          <p 
            className="text-sm text-cyan-200 mb-6"
            style={{ textShadow: '0 0 3px #06b6d4' }}
          >
            {message.subtitle}
          </p>
          
          <div className="flex justify-center space-x-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="h-8 w-8 text-yellow-400 fill-current animate-pulse" 
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  filter: 'drop-shadow(0 0 5px #fbbf24)'
                }}
              />
            ))}
          </div>
          
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg text-lg font-bold font-mono animate-pulse"
            style={{ 
              boxShadow: '0 0 15px #06b6d4',
              textShadow: '0 0 5px #ffffff'
            }}
          >
            SYSTEM: EXCELLENCE DETECTED ⚡
          </div>
        </div>
      </div>
    </div>
  );
};
