
import { useEffect, useState } from 'react';
import { Waves, Droplets, Star, Sparkles } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface OceanWaveCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

const WaveRipple = ({ delay, size }: { delay: number; size: number }) => {
  return (
    <div
      className="absolute border-2 border-blue-400 rounded-full animate-ping"
      style={{
        left: '50%',
        top: '50%',
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
        animationDelay: `${delay}ms`,
        animationDuration: '3s'
      }}
    />
  );
};

export const OceanWaveCelebration = ({ message, onComplete }: OceanWaveCelebrationProps) => {
  const [waves, setWaves] = useState<Array<{delay: number; size: number}>>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const waveArray = Array.from({ length: 8 }, (_, i) => ({
      delay: i * 300,
      size: 100 + i * 50
    }));
    setWaves(waveArray);
    
    setTimeout(() => setShowContent(true), 600);
    setTimeout(() => onComplete(), 5000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Wave Ripples */}
      <div className="absolute inset-0 flex items-center justify-center">
        {waves.map((wave, index) => (
          <WaveRipple key={index} delay={wave.delay} size={wave.size} />
        ))}
      </div>

      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-blue-400/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={`bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-900 border-4 border-blue-400 rounded-3xl p-8 text-center shadow-2xl max-w-md w-full relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-cyan-400/20 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Waves className="h-20 w-20 text-blue-400 animate-bounce" />
              <div className="absolute -top-2 -right-2 text-2xl animate-spin">🌊</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Droplets className="h-8 w-8 text-blue-400 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {message.title}
            </h2>
            <Droplets className="h-8 w-8 text-blue-400 animate-pulse" />
          </div>
          
          <p className="text-xl text-blue-100 mb-4 font-semibold">
            {message.message}
          </p>
          
          <p className="text-base text-blue-200 mb-6">
            {message.subtitle}
          </p>
          
          <div className="flex justify-center space-x-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="h-8 w-8 text-blue-400 fill-current animate-pulse" 
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Flowing Success! 🌊</span>
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
