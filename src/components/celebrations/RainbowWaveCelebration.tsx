
import { useEffect, useState } from 'react';
import { Sun, Cloud, Heart } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface RainbowWaveCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

export const RainbowWaveCelebration = ({ message, onComplete }: RainbowWaveCelebrationProps) => {
  const [showContent, setShowContent] = useState(false);
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 400);
    
    const waveInterval = setInterval(() => {
      setWaveOffset(prev => (prev + 1) % 360);
    }, 50);

    setTimeout(() => onComplete(), 5500);
    
    return () => clearInterval(waveInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-400 via-white to-green-400 flex items-center justify-center z-50 pointer-events-none p-4 overflow-hidden">
      {/* Animated Rainbow */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" viewBox="0 0 800 600" className="absolute inset-0">
          {['#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff80', '#0080ff', '#8000ff'].map((color, i) => (
            <path
              key={i}
              d={`M0,${300 + i * 15} Q400,${200 + Math.sin(waveOffset * Math.PI / 180) * 50} 800,${300 + i * 15}`}
              stroke={color}
              strokeWidth="8"
              fill="none"
              opacity="0.8"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </svg>
      </div>

      {/* Floating Rainbow Drops */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              fontSize: `${20 + Math.random() * 20}px`
            }}
          >
            {['🌈', '💎', '⭐', '🌟', '✨'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      {/* Sun and Clouds */}
      <div className="absolute top-10 right-10">
        <Sun className="h-20 w-20 text-yellow-400 animate-spin" style={{ animationDuration: '4s' }} />
      </div>
      <div className="absolute top-16 left-10">
        <Cloud className="h-16 w-16 text-white animate-bounce" />
      </div>

      {/* Main Content */}
      <div className={`bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center shadow-2xl max-w-md w-full border-4 border-pink-400 relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-yellow-100 to-purple-100 animate-pulse opacity-50"></div>
        
        <div className="relative z-10">
          <div className="text-8xl mb-4 animate-bounce">🌈</div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            {message.title}
          </h2>
          
          <p className="text-xl text-gray-700 mb-4 font-semibold">
            {message.message}
          </p>
          
          <p className="text-base text-gray-600 mb-6">
            {message.subtitle}
          </p>
          
          <div className="flex justify-center space-x-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Heart 
                key={i} 
                className="h-8 w-8 text-pink-500 fill-current animate-pulse" 
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-6 py-3 rounded-full text-lg font-bold animate-pulse">
            Colors of Success! 🌈
          </div>
        </div>
      </div>
    </div>
  );
};
