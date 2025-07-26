
import { useEffect, useState } from 'react';
import { Plane, Wind, Target } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface PaperPlaneCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

const PaperPlane = ({ delay, startX, startY, endX, endY }: { delay: number; startX: number; startY: number; endX: number; endY: number }) => {
  return (
    <div
      className="absolute text-4xl animate-bounce"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        animationDelay: `${delay}ms`,
        animationDuration: '3s',
        transition: 'all 3s ease-in-out',
        transform: `translate(${endX - startX}vw, ${endY - startY}vh) rotate(45deg)`
      }}
    >
      ✈️
    </div>
  );
};

export const PaperPlaneCelebration = ({ message, onComplete }: PaperPlaneCelebrationProps) => {
  const [planes, setPlanes] = useState<Array<{startX: number; startY: number; endX: number; endY: number; delay: number}>>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const planeData = Array.from({ length: 8 }, (_, i) => ({
      startX: Math.random() * 30,
      startY: Math.random() * 100,
      endX: 70 + Math.random() * 30,
      endY: Math.random() * 100,
      delay: i * 400
    }));
    setPlanes(planeData);
    
    setTimeout(() => setShowContent(true), 600);
    setTimeout(() => onComplete(), 6000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-sky-400 via-sky-300 to-white flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Clouds */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-6xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          >
            ☁️
          </div>
        ))}
      </div>

      {/* Paper Planes */}
      <div className="absolute inset-0 overflow-hidden">
        {planes.map((plane, index) => (
          <PaperPlane key={index} delay={plane.delay} startX={plane.startX} startY={plane.startY} endX={plane.endX} endY={plane.endY} />
        ))}
      </div>

      {/* Wind Lines */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-16 h-0.5 bg-white/60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              transform: `rotate(${Math.random() * 45}deg)`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={`bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md w-full border-4 border-sky-400 relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-sky-100 via-white to-blue-100 animate-pulse opacity-70"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Plane className="h-16 w-16 text-sky-600 animate-bounce mr-4" />
            <Target className="h-12 w-12 text-orange-500 animate-ping" />
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-4">
            {message.title}
          </h2>
          
          <p className="text-xl text-gray-700 mb-4 font-semibold">
            {message.message}
          </p>
          
          <p className="text-base text-gray-600 mb-6">
            {message.subtitle}
          </p>
          
          <div className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-6 py-3 rounded-full text-lg font-bold animate-pulse">
            <Wind className="h-5 w-5 inline mr-2" />
            Flying Towards Success! ✈️
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
