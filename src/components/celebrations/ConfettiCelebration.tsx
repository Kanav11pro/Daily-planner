
import { useEffect, useState } from 'react';
import { Trophy, Star, Sparkles, Zap, Crown, Target } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface ConfettiCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

const ConfettiPiece = ({ delay, type }: { delay: number; type: 'square' | 'circle' | 'triangle' }) => {
  const colors = ['bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-red-400', 'bg-purple-400', 'bg-pink-400'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomX = Math.random() * 100;
  const randomRotation = Math.random() * 360;
  const randomSize = Math.random() * 8 + 4;
  
  return (
    <div
      className={`absolute ${randomColor} animate-bounce`}
      style={{
        left: `${randomX}%`,
        width: `${randomSize}px`,
        height: `${randomSize}px`,
        animationDelay: `${delay}ms`,
        animationDuration: `${2 + Math.random() * 2}s`,
        transform: `rotate(${randomRotation}deg)`,
        top: '-10px',
        borderRadius: type === 'circle' ? '50%' : type === 'triangle' ? '0' : '2px',
        clipPath: type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
      }}
    />
  );
};

export const ConfettiCelebration = ({ message, onComplete }: ConfettiCelebrationProps) => {
  const [confetti, setConfetti] = useState<number[]>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const pieces = Array.from({ length: 100 }, (_, i) => i);
    setConfetti(pieces);
    
    setTimeout(() => setShowContent(true), 500);
    setTimeout(() => onComplete(), 5000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Enhanced Confetti */}
      <div className="absolute inset-0 overflow-hidden">
        {confetti.map((piece) => (
          <ConfettiPiece 
            key={piece} 
            delay={piece * 15} 
            type={['square', 'circle', 'triangle'][piece % 3] as 'square' | 'circle' | 'triangle'}
          />
        ))}
      </div>

      {/* Animated Background Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 rounded-full border-4 border-yellow-400/30 animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute w-64 h-64 rounded-full border-4 border-blue-400/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
        <div className="absolute w-32 h-32 rounded-full border-4 border-green-400/30 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className={`bg-gradient-to-br from-white via-yellow-50 to-orange-50 rounded-3xl p-8 text-center shadow-2xl max-w-md w-full border-4 border-yellow-300 relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-transparent to-orange-100 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="text-8xl mb-4 animate-bounce">🎉</div>
              <Crown className="absolute -top-4 left-1/2 transform -translate-x-1/2 h-8 w-8 text-yellow-600 animate-pulse" />
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="h-10 w-10 text-yellow-600 animate-bounce" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              {message.title}
            </h2>
            <Target className="h-10 w-10 text-yellow-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          
          <p className="text-xl text-gray-700 mb-4 font-semibold">
            {message.message}
          </p>
          
          <p className="text-base text-gray-600 mb-6">
            {message.subtitle}
          </p>
          
          <div className="flex justify-center space-x-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="h-8 w-8 text-yellow-500 fill-current animate-pulse" 
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Keep The Fire Burning! 🔥</span>
              <Zap className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
