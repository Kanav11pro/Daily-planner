
import { useEffect, useState } from 'react';
import { Star, Sparkles, Crown, Award } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface RisingStarsCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

const RisingStar = ({ delay, x }: { delay: number; x: number }) => {
  const sizes = ['text-2xl', 'text-3xl', 'text-4xl'];
  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
  
  return (
    <div
      className={`absolute ${randomSize} text-yellow-400 animate-bounce`}
      style={{
        left: `${x}%`,
        bottom: '-50px',
        animationDelay: `${delay}ms`,
        animationDuration: '3s',
        animationIterationCount: 'infinite',
        animationDirection: 'alternate'
      }}
    >
      ⭐
    </div>
  );
};

export const RisingStarsCelebration = ({ message, onComplete }: RisingStarsCelebrationProps) => {
  const [stars, setStars] = useState<Array<{x: number; delay: number}>>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const starsArray = Array.from({ length: 15 }, (_, i) => ({
      x: Math.random() * 100,
      delay: i * 200
    }));
    setStars(starsArray);
    
    setTimeout(() => setShowContent(true), 500);
    setTimeout(() => onComplete(), 5000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Rising Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star, index) => (
          <RisingStar key={index} delay={star.delay} x={star.x} />
        ))}
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 animate-pulse"></div>

      {/* Main Content */}
      <div className={`bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 border-4 border-blue-400 rounded-3xl p-8 text-center shadow-2xl max-w-md w-full relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-purple-400/20 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Crown className="h-20 w-20 text-yellow-400 animate-bounce" />
              <div className="absolute -top-2 -right-2 text-2xl animate-spin">🌟</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Award className="h-8 w-8 text-yellow-400 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">
              {message.title}
            </h2>
            <Award className="h-8 w-8 text-yellow-400 animate-pulse" />
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
                className="h-8 w-8 text-yellow-400 fill-current animate-pulse" 
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Rising to the Stars! ⭐</span>
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
