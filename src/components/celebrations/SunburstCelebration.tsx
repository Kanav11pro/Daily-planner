
import { useEffect, useState } from 'react';
import { Sun, Star, Sparkles, Crown } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface SunburstCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

const SunRay = ({ angle, delay }: { angle: number; delay: number }) => {
  return (
    <div
      className="absolute w-1 h-32 bg-gradient-to-t from-yellow-400 to-orange-400 animate-pulse"
      style={{
        left: '50%',
        top: '50%',
        transformOrigin: 'bottom center',
        transform: `translate(-50%, -100%) rotate(${angle}deg)`,
        animationDelay: `${delay}ms`,
        animationDuration: '3s'
      }}
    />
  );
};

export const SunburstCelebration = ({ message, onComplete }: SunburstCelebrationProps) => {
  const [sunRays, setSunRays] = useState<Array<{angle: number; delay: number}>>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const rays = Array.from({ length: 24 }, (_, i) => ({
      angle: (360 / 24) * i,
      delay: i * 50
    }));
    setSunRays(rays);
    
    setTimeout(() => setShowContent(true), 500);
    setTimeout(() => onComplete(), 5000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Sun Rays */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-0 h-0">
          {sunRays.map((ray, index) => (
            <SunRay key={index} angle={ray.angle} delay={ray.delay} />
          ))}
        </div>
      </div>

      {/* Central Sun */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-40 h-40 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse shadow-2xl shadow-yellow-400/50"></div>
      </div>

      {/* Main Content */}
      <div className={`bg-gradient-to-br from-yellow-900 via-orange-800 to-red-900 border-4 border-yellow-400 rounded-3xl p-8 text-center shadow-2xl max-w-md w-full relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-orange-400/20 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Sun className="h-20 w-20 text-yellow-400 animate-bounce" />
              <div className="absolute -top-2 -right-2 text-2xl animate-spin">☀️</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="h-8 w-8 text-yellow-400 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {message.title}
            </h2>
            <Crown className="h-8 w-8 text-yellow-400 animate-pulse" />
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
              <Sparkles className="h-5 w-5" />
              <span>Radiant Success! ☀️</span>
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
