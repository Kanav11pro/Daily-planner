
import { useEffect, useState } from 'react';
import { Gem, Star, Sparkles } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface CrystalFormationCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

const GrowingCrystal = ({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) => {
  return (
    <div
      className="absolute text-cyan-400 animate-pulse"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        fontSize: `${size}px`,
        animationDelay: `${delay}ms`,
        animationDuration: '2s'
      }}
    >
      🔮
    </div>
  );
};

export const CrystalFormationCelebration = ({ message, onComplete }: CrystalFormationCelebrationProps) => {
  const [crystals, setCrystals] = useState<Array<{x: number; y: number; delay: number; size: number}>>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const crystalArray = Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 150,
      size: 16 + Math.random() * 16
    }));
    setCrystals(crystalArray);
    
    setTimeout(() => setShowContent(true), 400);
    setTimeout(() => onComplete(), 5000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Growing Crystals */}
      <div className="absolute inset-0 overflow-hidden">
        {crystals.map((crystal, index) => (
          <GrowingCrystal key={index} delay={crystal.delay} x={crystal.x} y={crystal.y} size={crystal.size} />
        ))}
      </div>

      {/* Crystal Formation Pattern */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-60 h-60 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
        <div className="absolute w-40 h-40 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute w-20 h-20 bg-gradient-to-r from-purple-400/40 to-blue-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className={`bg-gradient-to-br from-cyan-900 via-blue-800 to-purple-900 border-4 border-cyan-400 rounded-3xl p-8 text-center shadow-2xl max-w-md w-full relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-transparent to-purple-400/20 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Gem className="h-20 w-20 text-cyan-400 animate-bounce" />
              <div className="absolute -top-2 -right-2 text-2xl animate-spin">🔮</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Gem className="h-8 w-8 text-cyan-400 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {message.title}
            </h2>
            <Gem className="h-8 w-8 text-cyan-400 animate-pulse" />
          </div>
          
          <p className="text-xl text-cyan-100 mb-4 font-semibold">
            {message.message}
          </p>
          
          <p className="text-base text-cyan-200 mb-6">
            {message.subtitle}
          </p>
          
          <div className="flex justify-center space-x-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="h-8 w-8 text-cyan-400 fill-current animate-pulse" 
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Crystal Clear! 🔮</span>
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
