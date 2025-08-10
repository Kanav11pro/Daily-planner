
import { useEffect, useState } from 'react';
import { Zap, Cpu, Atom } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface QuantumFieldCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

export const QuantumFieldCelebration = ({ message, onComplete }: QuantumFieldCelebrationProps) => {
  const [showContent, setShowContent] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number; x: number; y: number}>>([]);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
    
    // Reduced particles for mobile performance
    const initialParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(initialParticles);

    const completeTimer = setTimeout(() => onComplete(), 4000);
    
    return () => clearTimeout(completeTimer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Simplified Quantum Field Grid for mobile */}
      <div className="absolute inset-0 opacity-15">
        <div className="grid grid-cols-6 sm:grid-cols-12 grid-rows-4 sm:grid-rows-8 h-full w-full">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="border border-cyan-400 animate-pulse"
              style={{
                animationDelay: `${i * 30}ms`,
                animationDuration: '4s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Quantum Particles - Reduced for mobile */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-ping"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.id * 150}ms`,
              boxShadow: '0 0 8px #06b6d4'
            }}
          />
        ))}
      </div>

      {/* Simplified Energy Waves for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute border-2 border-cyan-400 rounded-full animate-ping opacity-20"
            style={{
              left: '50%',
              top: '50%',
              width: `${150 + i * 80}px`,
              height: `${150 + i * 80}px`,
              marginLeft: `-${75 + i * 40}px`,
              marginTop: `-${75 + i * 40}px`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: '4s',
            }}
          />
        ))}
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className={`bg-black/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center shadow-2xl max-w-sm sm:max-w-md w-full border-2 border-cyan-400 relative overflow-hidden transition-all duration-700 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <Atom className="h-12 w-12 sm:h-16 sm:w-16 text-cyan-400 animate-spin mr-2 sm:mr-4" style={{ animationDuration: '4s' }} />
            <Cpu className="h-8 w-8 sm:h-12 sm:w-12 text-purple-400 animate-pulse" />
          </div>
          
          <h2 className="text-xl sm:text-3xl font-bold text-cyan-400 mb-3 sm:mb-4 font-mono" style={{ textShadow: '0 0 8px #06b6d4' }}>
            {message.title}
          </h2>
          
          <p className="text-sm sm:text-lg text-white mb-3 sm:mb-4 font-semibold">
            {message.message}
          </p>
          
          <p className="text-xs sm:text-sm text-cyan-200 mb-4 sm:mb-6">
            {message.subtitle}
          </p>
          
          <div 
            className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-lg font-bold font-mono animate-pulse"
            style={{ 
              boxShadow: '0 0 10px #06b6d4',
              textShadow: '0 0 3px #ffffff'
            }}
          >
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 inline mr-2" />
            QUANTUM EXCELLENCE ⚛️
          </div>
        </div>
      </div>
    </div>
  );
};
