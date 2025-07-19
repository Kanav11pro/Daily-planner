
import { useEffect, useState } from 'react';
import { Star, Sparkles, Crown, Medal } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface GlowingRingCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

export const GlowingRingCelebration = ({ message, onComplete }: GlowingRingCelebrationProps) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
    setTimeout(() => onComplete(), 5000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Glowing Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 rounded-full border-4 border-cyan-400 animate-pulse shadow-2xl shadow-cyan-400/50" style={{ animationDuration: '2s' }}></div>
        <div className="absolute w-72 h-72 rounded-full border-4 border-teal-400 animate-pulse shadow-2xl shadow-teal-400/50" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}></div>
        <div className="absolute w-48 h-48 rounded-full border-4 border-emerald-400 animate-pulse shadow-2xl shadow-emerald-400/50" style={{ animationDuration: '1s', animationDelay: '0.6s' }}></div>
      </div>

      {/* Floating Sparkles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-cyan-400 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={`bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 border-4 border-cyan-400 rounded-3xl p-8 text-center shadow-2xl max-w-md w-full relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-transparent to-emerald-400/20 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Medal className="h-20 w-20 text-cyan-400 animate-bounce" />
              <div className="absolute -top-2 -right-2 text-2xl animate-spin">🏆</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="h-8 w-8 text-cyan-400 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {message.title}
            </h2>
            <Crown className="h-8 w-8 text-cyan-400 animate-pulse" />
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
          
          <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Glowing Success! ✨</span>
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
