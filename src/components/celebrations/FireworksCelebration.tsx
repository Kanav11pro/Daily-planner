
import { useEffect, useState } from 'react';
import { Rocket, Flame, Star, Zap } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface FireworksCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

const Firework = ({ delay, x, y }: { delay: number; x: number; y: number }) => {
  const colors = ['text-red-400', 'text-blue-400', 'text-green-400', 'text-yellow-400', 'text-purple-400', 'text-pink-400'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <div
      className="absolute animate-ping"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}ms`,
        animationDuration: '2s'
      }}
    >
      <div className={`${randomColor} text-4xl`}>✨</div>
    </div>
  );
};

export const FireworksCelebration = ({ message, onComplete }: FireworksCelebrationProps) => {
  const [fireworks, setFireworks] = useState<Array<{x: number; y: number; delay: number}>>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fireworksArray = Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 100
    }));
    setFireworks(fireworksArray);
    
    setTimeout(() => setShowContent(true), 300);
    setTimeout(() => onComplete(), 5000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Fireworks */}
      <div className="absolute inset-0 overflow-hidden">
        {fireworks.map((firework, index) => (
          <Firework key={index} delay={firework.delay} x={firework.x} y={firework.y} />
        ))}
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 animate-pulse"></div>

      {/* Main Content */}
      <div className={`bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 border-4 border-purple-400 rounded-3xl p-8 text-center shadow-2xl max-w-md w-full relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-transparent to-pink-400/20 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Rocket className="h-20 w-20 text-yellow-400 animate-bounce" />
              <div className="absolute -top-2 -right-2 text-2xl animate-spin">🎆</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Flame className="h-8 w-8 text-orange-400 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {message.title}
            </h2>
            <Flame className="h-8 w-8 text-orange-400 animate-pulse" />
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
                className="h-8 w-8 text-yellow-400 fill-current animate-pulse" 
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Ignite Your Potential! 🚀</span>
              <Zap className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
