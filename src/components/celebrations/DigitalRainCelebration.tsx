
import { useEffect, useState } from 'react';
import { Code, Terminal, Binary } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface DigitalRainCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

export const DigitalRainCelebration = ({ message, onComplete }: DigitalRainCelebrationProps) => {
  const [showContent, setShowContent] = useState(false);
  const [rainDrops, setRainDrops] = useState<Array<{id: number; x: number; y: number; speed: number; opacity: number}>>([]);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 400);
    
    // Initialize rain drops
    const drops = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * -100,
      speed: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2
    }));
    setRainDrops(drops);

    const rainInterval = setInterval(() => {
      setRainDrops(prev => prev.map(drop => ({
        ...drop,
        y: drop.y > 110 ? -10 : drop.y + drop.speed,
        opacity: Math.random() * 0.8 + 0.2
      })));
    }, 100);

    setTimeout(() => onComplete(), 5500);
    
    return () => clearInterval(rainInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Digital Rain */}
      <div className="absolute inset-0 overflow-hidden">
        {rainDrops.map((drop) => (
          <div
            key={drop.id}
            className="absolute text-green-400 font-mono text-sm leading-tight"
            style={{
              left: `${drop.x}%`,
              top: `${drop.y}%`,
              opacity: drop.opacity,
              textShadow: '0 0 5px #22c55e'
            }}
          >
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className={i === 0 ? 'text-white' : ''}>
                {characters[Math.floor(Math.random() * characters.length)]}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Scanning Lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"
            style={{
              top: `${20 + i * 30}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: '2s',
              boxShadow: '0 0 20px #22c55e'
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={`bg-black/90 border-2 border-green-400 rounded-2xl p-8 text-center shadow-2xl max-w-md w-full relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-black/50"></div>
        
        {/* Matrix Effect Border */}
        <div className="absolute inset-0 border-2 border-green-400 rounded-2xl animate-pulse" style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)' }}></div>
        
        <div className="relative z-10">
          <div className="mb-6">
            <Terminal 
              className="h-16 w-16 mx-auto text-green-400 animate-pulse" 
              style={{ 
                filter: 'drop-shadow(0 0 15px #22c55e)',
                animationDuration: '1.5s'
              }} 
            />
          </div>
          
          <h2 className="text-3xl font-bold text-green-400 mb-4 font-mono" style={{ textShadow: '0 0 10px #22c55e' }}>
            {message.title}
          </h2>
          
          <p className="text-lg text-white mb-4 font-mono">
            {message.message}
          </p>
          
          <p className="text-sm text-green-200 mb-6 font-mono">
            {message.subtitle}
          </p>
          
          <div className="bg-gradient-to-r from-green-600 to-green-800 text-black px-6 py-3 rounded-lg text-lg font-bold font-mono animate-pulse">
            <Binary className="h-5 w-5 inline mr-2" />
            MATRIX: EXCELLENCE LOADED 💊
          </div>
        </div>
      </div>
    </div>
  );
};
