
import { useEffect, useState } from 'react';
import { Zap, Radio, Waves } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface ElectronicPulseCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

export const ElectronicPulseCelebration = ({ message, onComplete }: ElectronicPulseCelebrationProps) => {
  const [showContent, setShowContent] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(1);
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
    
    const pulseInterval = setInterval(() => {
      setPulseIntensity(prev => prev === 1 ? 2 : 1);
    }, 300);

    const waveInterval = setInterval(() => {
      setWaveOffset(prev => (prev + 5) % 360);
    }, 50);

    setTimeout(() => onComplete(), 5000);
    
    return () => {
      clearInterval(pulseInterval);
      clearInterval(waveInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Electronic Circuit Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" viewBox="0 0 400 300">
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i}>
              <path
                d={`M${i * 50},0 L${i * 50},300 M0,${i * 40} L400,${i * 40}`}
                stroke="#8b5cf6"
                strokeWidth="1"
                opacity="0.5"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
              <circle
                cx={i * 50}
                cy={(i * 40) % 300}
                r="3"
                fill="#8b5cf6"
                className="animate-ping"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Electronic Pulses */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-electric-blue rounded-full animate-ping"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + Math.sin(waveOffset * Math.PI / 180 + i) * 30 + 30}%`,
              animationDelay: `${i * 0.2}s`,
              backgroundColor: `hsl(${240 + i * 30}, 100%, 60%)`,
              boxShadow: `0 0 15px hsl(${240 + i * 30}, 100%, 60%)`
            }}
          />
        ))}
      </div>

      {/* Wave Visualization */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" viewBox="0 0 800 600">
          {Array.from({ length: 4 }).map((_, i) => (
            <path
              key={i}
              d={`M0,${300 + i * 20} Q200,${250 + Math.sin(waveOffset * Math.PI / 180) * 100} 400,${300 + i * 20} T800,${300 + i * 20}`}
              stroke={`hsl(${280 + i * 20}, 100%, 60%)`}
              strokeWidth="3"
              fill="none"
              opacity="0.7"
              className="animate-pulse"
              style={{ 
                animationDelay: `${i * 0.1}s`,
                filter: `drop-shadow(0 0 10px hsl(${280 + i * 20}, 100%, 60%))`
              }}
            />
          ))}
        </svg>
      </div>

      {/* Main Content */}
      <div 
        className={`bg-black/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-2xl max-w-md w-full border-2 border-purple-400 relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}
        style={{
          borderColor: `hsl(280, 100%, ${60 * pulseIntensity}%)`,
          boxShadow: `0 0 ${30 * pulseIntensity}px rgba(139, 92, 246, 0.6)`,
          transform: `scale(${0.98 + 0.02 * pulseIntensity})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="mb-6">
            <Radio 
              className="h-16 w-16 mx-auto text-purple-400 animate-pulse" 
              style={{ 
                filter: `drop-shadow(0 0 15px hsl(280, 100%, ${60 * pulseIntensity}%))`,
                animationDuration: '0.6s'
              }} 
            />
          </div>
          
          <h2 
            className="text-3xl font-bold text-purple-400 mb-4 font-mono" 
            style={{ 
              textShadow: `0 0 10px hsl(280, 100%, ${60 * pulseIntensity}%)`,
              color: `hsl(280, 100%, ${60 * pulseIntensity}%)`
            }}
          >
            {message.title}
          </h2>
          
          <p className="text-lg text-white mb-4 font-semibold">
            {message.message}
          </p>
          
          <p className="text-sm text-purple-200 mb-6">
            {message.subtitle}
          </p>
          
          <div 
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold font-mono animate-pulse"
            style={{ boxShadow: `0 0 15px hsl(280, 100%, ${40 * pulseIntensity}%)` }}
          >
            <Waves className="h-5 w-5 inline mr-2" />
            FREQUENCY: OPTIMAL ⚡
          </div>
        </div>
      </div>
    </div>
  );
};
