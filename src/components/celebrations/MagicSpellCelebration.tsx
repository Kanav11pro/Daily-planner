
import { useEffect, useState } from 'react';
import { Wand2, Sparkles, Star, Crown } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface MagicSpellCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

const MagicSparkle = ({ delay, x, y }: { delay: number; x: number; y: number }) => {
  const sparkles = ['✨', '⭐', '💫', '🌟', '✴️'];
  const randomSparkle = sparkles[Math.floor(Math.random() * sparkles.length)];
  
  return (
    <div
      className="absolute text-2xl animate-ping"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}ms`,
        animationDuration: '2s'
      }}
    >
      {randomSparkle}
    </div>
  );
};

export const MagicSpellCelebration = ({ message, onComplete }: MagicSpellCelebrationProps) => {
  const [magicSparkles, setMagicSparkles] = useState<Array<{x: number; y: number; delay: number}>>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const sparkles = Array.from({ length: 25 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 80
    }));
    setMagicSparkles(sparkles);
    
    setTimeout(() => setShowContent(true), 500);
    setTimeout(() => onComplete(), 5000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Magic Sparkles */}
      <div className="absolute inset-0 overflow-hidden">
        {magicSparkles.map((sparkle, index) => (
          <MagicSparkle key={index} delay={sparkle.delay} x={sparkle.x} y={sparkle.y} />
        ))}
      </div>

      {/* Magic Circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-80 h-80 rounded-full border-4 border-purple-400 animate-spin shadow-2xl shadow-purple-400/50" style={{ animationDuration: '4s' }}>
          <div className="w-full h-full rounded-full border-2 border-indigo-400 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}>
            <div className="w-full h-full rounded-full border-2 border-blue-400 animate-spin" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 border-4 border-purple-400 rounded-3xl p-8 text-center shadow-2xl max-w-md w-full relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-transparent to-blue-400/20 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Wand2 className="h-20 w-20 text-purple-400 animate-bounce" />
              <div className="absolute -top-2 -right-2 text-2xl animate-spin">🪄</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="h-8 w-8 text-purple-400 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {message.title}
            </h2>
            <Crown className="h-8 w-8 text-purple-400 animate-pulse" />
          </div>
          
          <p className="text-xl text-purple-100 mb-4 font-semibold">
            {message.message}
          </p>
          
          <p className="text-base text-purple-200 mb-6">
            {message.subtitle}
          </p>
          
          <div className="flex justify-center space-x-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="h-8 w-8 text-purple-400 fill-current animate-pulse" 
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Magic Unleashed! 🪄</span>
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
