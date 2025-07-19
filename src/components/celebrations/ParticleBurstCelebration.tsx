
import { useEffect, useState } from 'react';
import { Zap, Bolt, Star, Trophy } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface ParticleBurstCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

const Particle = ({ delay, angle, distance }: { delay: number; angle: number; distance: number }) => {
  const colors = ['bg-yellow-400', 'bg-orange-400', 'bg-red-400', 'bg-pink-400', 'bg-purple-400'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <div
      className={`absolute w-2 h-2 ${randomColor} rounded-full animate-ping`}
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${distance}px)`,
        animationDelay: `${delay}ms`,
        animationDuration: '2s'
      }}
    />
  );
};

export const ParticleBurstCelebration = ({ message, onComplete }: ParticleBurstCelebrationProps) => {
  const [particles, setParticles] = useState<Array<{angle: number; distance: number; delay: number}>>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const particlesArray = Array.from({ length: 30 }, (_, i) => ({
      angle: (360 / 30) * i,
      distance: 100 + Math.random() * 100,
      delay: i * 50
    }));
    setParticles(particlesArray);
    
    setTimeout(() => setShowContent(true), 400);
    setTimeout(() => onComplete(), 5000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Particle Burst */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-0 h-0">
          {particles.map((particle, index) => (
            <Particle key={index} delay={particle.delay} angle={particle.angle} distance={particle.distance} />
          ))}
        </div>
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 animate-pulse"></div>

      {/* Main Content */}
      <div className={`bg-gradient-to-br from-orange-900 via-red-800 to-pink-900 border-4 border-orange-400 rounded-3xl p-8 text-center shadow-2xl max-w-md w-full relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-transparent to-pink-400/20 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Bolt className="h-20 w-20 text-yellow-400 animate-bounce" />
              <div className="absolute -top-2 -right-2 text-2xl animate-spin">💥</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="h-8 w-8 text-orange-400 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {message.title}
            </h2>
            <Zap className="h-8 w-8 text-orange-400 animate-pulse" />
          </div>
          
          <p className="text-xl text-orange-100 mb-4 font-semibold">
            {message.message}
          </p>
          
          <p className="text-base text-orange-200 mb-6">
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
              <Trophy className="h-5 w-5" />
              <span>Explosive Progress! 💥</span>
              <Trophy className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
