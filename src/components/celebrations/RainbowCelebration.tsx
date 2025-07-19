
import { useEffect, useState } from 'react';
import { Rainbow, Sparkles, Heart, Star } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface RainbowCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

const RainbowDrop = ({ delay, x }: { delay: number; x: number }) => {
  const colors = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400', 'text-blue-400', 'text-indigo-400', 'text-purple-400'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <div
      className={`absolute ${randomColor} text-2xl animate-bounce`}
      style={{
        left: `${x}%`,
        top: '-20px',
        animationDelay: `${delay}ms`,
        animationDuration: '3s',
        animationIterationCount: 'infinite'
      }}
    >
      🌈
    </div>
  );
};

export const RainbowCelebration = ({ message, onComplete }: RainbowCelebrationProps) => {
  const [rainbowDrops, setRainbowDrops] = useState<Array<{x: number; delay: number}>>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const drops = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * 100,
      delay: i * 150
    }));
    setRainbowDrops(drops);
    
    setTimeout(() => setShowContent(true), 400);
    setTimeout(() => onComplete(), 5000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-900 via-purple-900 to-blue-900 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Rainbow Drops */}
      <div className="absolute inset-0 overflow-hidden">
        {rainbowDrops.map((drop, index) => (
          <RainbowDrop key={index} delay={drop.delay} x={drop.x} />
        ))}
      </div>

      {/* Rainbow Arc Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 h-48 rounded-full border-8 border-t-red-400 border-r-orange-400 border-b-yellow-400 border-l-green-400 animate-spin" style={{ animationDuration: '8s' }}></div>
      </div>

      {/* Main Content */}
      <div className={`bg-gradient-to-br from-white via-pink-50 to-purple-50 border-4 border-pink-400 rounded-3xl p-8 text-center shadow-2xl max-w-md w-full relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-transparent to-purple-100 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Rainbow className="h-20 w-20 text-pink-500 animate-bounce" />
              <div className="absolute -top-2 -right-2 text-2xl animate-spin">🌈</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-pink-500 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {message.title}
            </h2>
            <Heart className="h-8 w-8 text-pink-500 animate-pulse" />
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
                className="h-8 w-8 text-pink-500 fill-current animate-pulse" 
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Colorful Success! 🌈</span>
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
