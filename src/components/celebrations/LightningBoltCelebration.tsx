
import { useEffect, useState } from 'react';
import { Zap, Bolt, Star } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface LightningBoltCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

const LightningStrike = ({ delay, x, y }: { delay: number; x: number; y: number }) => {
  return (
    <div
      className="absolute text-yellow-400 text-4xl animate-ping"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}ms`,
        animationDuration: '1.5s'
      }}
    >
      ⚡
    </div>
  );
};

export const LightningBoltCelebration = ({ message, onComplete }: LightningBoltCelebrationProps) => {
  const [lightning, setLightning] = useState<Array<{x: number; y: number; delay: number}>>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const strikes = Array.from({ length: 15 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 100
    }));
    setLightning(strikes);
    
    setTimeout(() => setShowContent(true), 300);
    setTimeout(() => onComplete(), 5000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Lightning Strikes */}
      <div className="absolute inset-0 overflow-hidden">
        {lightning.map((strike, index) => (
          <LightningStrike key={index} delay={strike.delay} x={strike.x} y={strike.y} />
        ))}
      </div>

      {/* Electric Field */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 animate-pulse"></div>

      {/* Main Content */}
      <div className={`bg-gradient-to-br from-yellow-900 via-orange-800 to-red-900 border-4 border-yellow-400 rounded-3xl p-8 text-center shadow-2xl max-w-md w-full relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-orange-400/20 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Zap className="h-20 w-20 text-yellow-400 animate-bounce" />
              <div className="absolute -top-2 -right-2 text-2xl animate-spin">⚡</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bolt className="h-8 w-8 text-yellow-400 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {message.title}
            </h2>
            <Bolt className="h-8 w-8 text-yellow-400 animate-pulse" />
          </div>
          
          <p className="text-xl text-yellow-100 mb-4 font-semibold">
            {message.message}
          </p>
          
          <p className="text-base text-yellow-200 mb-6">
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
          
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Lightning Speed! ⚡</span>
              <Zap className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
