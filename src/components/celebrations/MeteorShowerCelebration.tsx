
import { useEffect, useState } from 'react';
import { Star, Sparkles, Zap } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface MeteorShowerCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

const Meteor = ({ delay, startX, startY, endX, endY }: { delay: number; startX: number; startY: number; endX: number; endY: number }) => {
  return (
    <div
      className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        animationDelay: `${delay}ms`,
        animationDuration: '2s'
      }}
    >
      <div className="absolute w-12 h-1 bg-gradient-to-r from-blue-400 to-transparent -translate-y-1"></div>
    </div>
  );
};

export const MeteorShowerCelebration = ({ message, onComplete }: MeteorShowerCelebrationProps) => {
  const [meteors, setMeteors] = useState<Array<{startX: number; startY: number; endX: number; endY: number; delay: number}>>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const meteorArray = Array.from({ length: 16 }, (_, i) => ({
      startX: Math.random() * 100,
      startY: Math.random() * 50,
      endX: Math.random() * 100,
      endY: 50 + Math.random() * 50,
      delay: i * 200
    }));
    setMeteors(meteorArray);
    
    setTimeout(() => setShowContent(true), 400);
    setTimeout(() => onComplete(), 5000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Meteor Shower */}
      <div className="absolute inset-0 overflow-hidden">
        {meteors.map((meteor, index) => (
          <Meteor key={index} delay={meteor.delay} startX={meteor.startX} startY={meteor.startY} endX={meteor.endX} endY={meteor.endY} />
        ))}
      </div>

      {/* Starry Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 50}ms`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={`bg-gradient-to-br from-indigo-900 via-purple-800 to-black border-4 border-purple-400 rounded-3xl p-8 text-center shadow-2xl max-w-md w-full relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-transparent to-indigo-400/20 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Star className="h-20 w-20 text-purple-400 animate-bounce" />
              <div className="absolute -top-2 -right-2 text-2xl animate-spin">☄️</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="h-8 w-8 text-purple-400 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {message.title}
            </h2>
            <Zap className="h-8 w-8 text-purple-400 animate-pulse" />
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
          
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Stellar Achievement! ☄️</span>
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
