
import { useEffect, useState } from 'react';
import { Gift, Heart, Star } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface BalloonRiseCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

const Balloon = ({ delay, x, color }: { delay: number; x: number; color: string }) => {
  return (
    <div
      className={`absolute text-6xl animate-bounce`}
      style={{
        left: `${x}%`,
        bottom: '-100px',
        animationDelay: `${delay}ms`,
        animationDuration: '4s',
        animationDirection: 'alternate-reverse',
        animationIterationCount: 'infinite'
      }}
    >
      🎈
    </div>
  );
};

export const BalloonRiseCelebration = ({ message, onComplete }: BalloonRiseCelebrationProps) => {
  const [balloons, setBalloons] = useState<Array<{x: number; delay: number; color: string}>>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const balloonData = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * 90 + 5,
      delay: i * 300,
      color: ['red', 'blue', 'yellow', 'green', 'purple', 'pink'][i % 6]
    }));
    setBalloons(balloonData);
    
    setTimeout(() => setShowContent(true), 800);
    setTimeout(() => onComplete(), 6000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-green-200 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Balloons */}
      <div className="absolute inset-0 overflow-hidden">
        {balloons.map((balloon, index) => (
          <Balloon key={index} delay={balloon.delay} x={balloon.x} color={balloon.color} />
        ))}
      </div>

      {/* Floating Hearts */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-pink-500 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              fontSize: `${20 + Math.random() * 20}px`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={`bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md w-full border-4 border-yellow-400 relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-pink-100 to-blue-100 animate-pulse opacity-50"></div>
        
        <div className="relative z-10">
          <div className="text-8xl mb-4 animate-bounce">🎉</div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            {message.title}
          </h2>
          
          <p className="text-xl text-gray-700 mb-4 font-semibold">
            {message.message}
          </p>
          
          <p className="text-base text-gray-600 mb-6">
            {message.subtitle}
          </p>
          
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-lg font-bold animate-pulse">
            <Gift className="h-5 w-5 inline mr-2" />
            Soaring High! 🎈
          </div>
        </div>
      </div>
    </div>
  );
};
