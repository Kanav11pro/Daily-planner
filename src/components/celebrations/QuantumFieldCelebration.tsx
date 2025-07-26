
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
  const [particles, setParticles] = useState<Array<{id: number; x: number; y: number; vx: number; vy: number}>>([]);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
    
    // Create quantum particles
    const initialParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    }));
    setParticles(initialParticles);

    setTimeout(() => onComplete(), 5000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Quantum Field Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
          {Array.from({ length: 96 }).map((_, i) => (
            <div
              key={i}
              className="border border-cyan-400 animate-pulse"
              style={{
                animationDelay: `${i * 20}ms`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Quantum Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.id * 100}ms`,
              boxShadow: '0 0 10px #06b6d4'
            }}
          />
        ))}
      </div>

      {/* Energy Waves */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute border-2 border-cyan-400 rounded-full animate-ping"
            style={{
              left: '50%',
              top: '50%',
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              marginLeft: `-${100 + i * 50}px`,
              marginTop: `-${100 + i * 50}px`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s',
              opacity: 0.3
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={`bg-black/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-2xl max-w-md w-full border-2 border-cyan-400 relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Atom className="h-16 w-16 text-cyan-400 animate-spin mr-4" style={{ animationDuration: '3s' }} />
            <Cpu className="h-12 w-12 text-purple-400 animate-pulse" />
          </div>
          
          <h2 className="text-3xl font-bold text-cyan-400 mb-4 font-mono" style={{ textShadow: '0 0 10px #06b6d4' }}>
            {message.title}
          </h2>
          
          <p className="text-lg text-white mb-4 font-semibold">
            {message.message}
          </p>
          
          <p className="text-sm text-cyan-200 mb-6">
            {message.subtitle}
          </p>
          
          <div className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-6 py-3 rounded-lg text-lg font-bold font-mono animate-pulse">
            <Zap className="h-5 w-5 inline mr-2" />
            QUANTUM STATE: EXCELLENCE ⚛️
          </div>
        </div>
      </div>
    </div>
  );
};
