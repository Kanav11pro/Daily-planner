
import { useEffect, useState } from 'react';
import { Rocket, Orbit, Atom } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface CosmicExplosionCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

const Planet = ({ delay, orbitRadius, speed }: { delay: number; orbitRadius: number; speed: number }) => {
  return (
    <div
      className="absolute animate-spin"
      style={{
        width: `${orbitRadius * 2}px`,
        height: `${orbitRadius * 2}px`,
        left: '50%',
        top: '50%',
        marginLeft: `-${orbitRadius}px`,
        marginTop: `-${orbitRadius}px`,
        animationDelay: `${delay}ms`,
        animationDuration: `${speed}s`
      }}
    >
      <div
        className="absolute text-2xl"
        style={{
          right: '0',
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      >
        🪐
      </div>
    </div>
  );
};

export const CosmicExplosionCelebration = ({ message, onComplete }: CosmicExplosionCelebrationProps) => {
  const [planets, setPlanets] = useState<Array<{orbitRadius: number; speed: number; delay: number}>>([]);
  const [showContent, setShowContent] = useState(false);
  const [explosionPhase, setExplosionPhase] = useState(0);

  useEffect(() => {
    const planetData = Array.from({ length: 5 }, (_, i) => ({
      orbitRadius: 100 + i * 50,
      speed: 3 + i * 2,
      delay: i * 200
    }));
    setPlanets(planetData);
    
    setTimeout(() => setShowContent(true), 500);
    
    const explosionInterval = setInterval(() => {
      setExplosionPhase(prev => (prev + 1) % 3);
    }, 800);

    setTimeout(() => onComplete(), 6000);
    
    return () => clearInterval(explosionInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 pointer-events-none p-4 overflow-hidden">
      {/* Stars Background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Orbiting Planets */}
      <div className="absolute inset-0 flex items-center justify-center">
        {planets.map((planet, index) => (
          <Planet key={index} delay={planet.delay} orbitRadius={planet.orbitRadius} speed={planet.speed} />
        ))}
      </div>

      {/* Cosmic Explosion Waves */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(explosionPhase + 1)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border-4 border-purple-400 animate-ping opacity-30"
            style={{
              width: `${(i + 1) * 200}px`,
              height: `${(i + 1) * 200}px`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>

      {/* Floating Space Elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            {['🌟', '✨', '🌠', '💫', '⭐'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={`bg-gradient-to-br from-purple-900 via-indigo-900 to-black rounded-3xl p-8 text-center shadow-2xl max-w-md w-full border-4 border-purple-400 relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-transparent to-blue-400/20 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Rocket className="h-16 w-16 text-blue-400 animate-bounce mr-4" />
            <Atom className="h-12 w-12 text-purple-400 animate-spin" />
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            {message.title}
          </h2>
          
          <p className="text-xl text-blue-100 mb-4 font-semibold">
            {message.message}
          </p>
          
          <p className="text-base text-blue-200 mb-6">
            {message.subtitle}
          </p>
          
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full text-lg font-bold animate-pulse">
            <Orbit className="h-5 w-5 inline mr-2" />
            Cosmic Achievement! 🚀
          </div>
        </div>
      </div>
    </div>
  );
};
