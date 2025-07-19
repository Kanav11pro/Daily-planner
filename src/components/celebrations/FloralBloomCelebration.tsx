
import { useEffect, useState } from 'react';
import { Flower, Flower2, Heart, Star } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface FloralBloomCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

const BloomingFlower = ({ delay, x, y }: { delay: number; x: number; y: number }) => {
  const flowers = ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼'];
  const randomFlower = flowers[Math.floor(Math.random() * flowers.length)];
  
  return (
    <div
      className="absolute text-2xl animate-bounce"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}ms`,
        animationDuration: '3s'
      }}
    >
      {randomFlower}
    </div>
  );
};

export const FloralBloomCelebration = ({ message, onComplete }: FloralBloomCelebrationProps) => {
  const [flowers, setFlowers] = useState<Array<{x: number; y: number; delay: number}>>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const flowerArray = Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 150
    }));
    setFlowers(flowerArray);
    
    setTimeout(() => setShowContent(true), 500);
    setTimeout(() => onComplete(), 5000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-900 via-rose-900 to-red-900 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Blooming Flowers */}
      <div className="absolute inset-0 overflow-hidden">
        {flowers.map((flower, index) => (
          <BloomingFlower key={index} delay={flower.delay} x={flower.x} y={flower.y} />
        ))}
      </div>

      {/* Garden Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-red-500/20 animate-pulse"></div>

      {/* Main Content */}
      <div className={`bg-gradient-to-br from-pink-900 via-rose-800 to-red-900 border-4 border-pink-400 rounded-3xl p-8 text-center shadow-2xl max-w-md w-full relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-transparent to-rose-400/20 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Flower className="h-20 w-20 text-pink-400 animate-bounce" />
              <div className="absolute -top-2 -right-2 text-2xl animate-spin">🌸</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-pink-400 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              {message.title}
            </h2>
            <Heart className="h-8 w-8 text-pink-400 animate-pulse" />
          </div>
          
          <p className="text-xl text-pink-100 mb-4 font-semibold">
            {message.message}
          </p>
          
          <p className="text-base text-pink-200 mb-6">
            {message.subtitle}
          </p>
          
          <div className="flex justify-center space-x-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="h-8 w-8 text-pink-400 fill-current animate-pulse" 
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <Flower2 className="h-5 w-5" />
              <span>Blooming Success! 🌸</span>
              <Flower2 className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
