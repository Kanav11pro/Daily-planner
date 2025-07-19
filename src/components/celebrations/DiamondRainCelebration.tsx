
import { useEffect, useState } from 'react';
import { Diamond, Gem, Crown, Star } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface DiamondRainCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

const FallingDiamond = ({ delay, x }: { delay: number; x: number }) => {
  const diamonds = ['💎', '💍', '🔹', '🔷', '💠'];
  const randomDiamond = diamonds[Math.floor(Math.random() * diamonds.length)];
  
  return (
    <div
      className="absolute text-3xl animate-bounce"
      style={{
        left: `${x}%`,
        top: '-40px',
        animationDelay: `${delay}ms`,
        animationDuration: '3s',
        animationIterationCount: 'infinite'
      }}
    >
      {randomDiamond}
    </div>
  );
};

export const DiamondRainCelebration = ({ message, onComplete }: DiamondRainCelebrationProps) => {
  const [diamonds, setDiamonds] = useState<Array<{x: number; delay: number}>>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const diamondArray = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * 100,
      delay: i * 200
    }));
    setDiamonds(diamondArray);
    
    setTimeout(() => setShowContent(true), 600);
    setTimeout(() => onComplete(), 5000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Diamond Rain */}
      <div className="absolute inset-0 overflow-hidden">
        {diamonds.map((diamond, index) => (
          <FallingDiamond key={index} delay={diamond.delay} x={diamond.x} />
        ))}
      </div>

      {/* Glowing Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>

      {/* Main Content */}
      <div className={`bg-gradient-to-br from-gray-900 via-blue-800 to-purple-900 border-4 border-blue-400 rounded-3xl p-8 text-center shadow-2xl max-w-md w-full relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-purple-400/20 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Diamond className="h-20 w-20 text-blue-400 animate-bounce" />
              <div className="absolute -top-2 -right-2 text-2xl animate-spin">💎</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Gem className="h-8 w-8 text-blue-400 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {message.title}
            </h2>
            <Gem className="h-8 w-8 text-blue-400 animate-pulse" />
          </div>
          
          <p className="text-xl text-blue-100 mb-4 font-semibold">
            {message.message}
          </p>
          
          <p className="text-base text-blue-200 mb-6">
            {message.subtitle}
          </p>
          
          <div className="flex justify-center space-x-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="h-8 w-8 text-blue-400 fill-current animate-pulse" 
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <Crown className="h-5 w-5" />
              <span>Diamond Excellence! 💎</span>
              <Crown className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
