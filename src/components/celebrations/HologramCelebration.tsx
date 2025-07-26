
import { useEffect, useState } from 'react';
import { Eye, Layers, Sparkles } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface HologramCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

export const HologramCelebration = ({ message, onComplete }: HologramCelebrationProps) => {
  const [showContent, setShowContent] = useState(false);
  const [glitchOffset, setGlitchOffset] = useState(0);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 400);
    
    const glitchInterval = setInterval(() => {
      setGlitchOffset(Math.random() * 4 - 2);
    }, 200);

    setTimeout(() => onComplete(), 5500);
    
    return () => clearInterval(glitchInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-blue-900 to-purple-900 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Holographic Scan Lines */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-0.5 bg-cyan-400 animate-pulse"
            style={{
              top: `${i * 2}%`,
              animationDelay: `${i * 50}ms`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>

      {/* Holographic Projectors */}
      <div className="absolute inset-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <Eye
            key={i}
            className="absolute text-cyan-400 animate-pulse"
            style={{
              left: i % 2 === 0 ? '10%' : '90%',
              top: i < 2 ? '10%' : '90%',
              fontSize: '24px',
              transform: i % 2 === 0 ? 'rotate(0deg)' : 'rotate(180deg)',
              animationDelay: `${i * 0.5}s`,
              filter: 'drop-shadow(0 0 10px #06b6d4)'
            }}
          />
        ))}
      </div>

      {/* Floating Data Fragments */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-cyan-300 font-mono text-sm animate-bounce opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + Math.random()}s`
            }}
          >
            {['01101', '11010', 'EXEC', 'DATA', 'SYNC'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      {/* Main Hologram */}
      <div 
        className={`bg-black/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-2xl max-w-md w-full border-2 border-cyan-400 relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}
        style={{
          transform: `translateX(${glitchOffset}px)`,
          boxShadow: '0 0 30px rgba(6, 182, 212, 0.5), inset 0 0 20px rgba(6, 182, 212, 0.1)',
          background: `linear-gradient(45deg, 
            rgba(6, 182, 212, 0.1) 0%, 
            rgba(0, 0, 0, 0.8) 50%, 
            rgba(6, 182, 212, 0.1) 100%)`
        }}
      >
        {/* Holographic Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-pulse" style={{ animationDuration: '1.5s' }}></div>
        
        <div className="relative z-10" style={{ transform: `translateX(${glitchOffset * 0.5}px)` }}>
          <div className="mb-6">
            <Layers 
              className="h-16 w-16 mx-auto text-cyan-400 animate-pulse" 
              style={{ 
                filter: 'drop-shadow(0 0 15px #06b6d4)',
                animationDuration: '2s'
              }} 
            />
          </div>
          
          <h2 className="text-3xl font-bold text-cyan-400 mb-4 font-mono" style={{ 
            textShadow: '0 0 10px #06b6d4, 0 0 20px #06b6d4',
            filter: `hue-rotate(${glitchOffset * 10}deg)`
          }}>
            {message.title}
          </h2>
          
          <p className="text-lg text-white mb-4 font-semibold opacity-90">
            {message.message}
          </p>
          
          <p className="text-sm text-cyan-200 mb-6 opacity-80">
            {message.subtitle}
          </p>
          
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg text-lg font-bold font-mono animate-pulse">
            <Sparkles className="h-5 w-5 inline mr-2" />
            HOLOGRAM: ACTIVE 📡
          </div>
        </div>
      </div>
    </div>
  );
};
