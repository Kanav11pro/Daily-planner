
import { Trophy, Star, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const ConfettiPiece = ({ delay }: { delay: number }) => {
  const colors = ['bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-red-400', 'bg-purple-400', 'bg-pink-400'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomX = Math.random() * 100;
  const randomRotation = Math.random() * 360;
  
  return (
    <div
      className={`absolute w-2 h-2 ${randomColor} rounded-full animate-bounce`}
      style={{
        left: `${randomX}%`,
        animationDelay: `${delay}ms`,
        animationDuration: '2s',
        transform: `rotate(${randomRotation}deg)`,
        top: '-10px'
      }}
    />
  );
};

export const Celebration = () => {
  const [confetti, setConfetti] = useState<number[]>([]);

  useEffect(() => {
    // Generate confetti pieces
    const pieces = Array.from({ length: 50 }, (_, i) => i);
    setConfetti(pieces);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden">
        {confetti.map((piece) => (
          <ConfettiPiece key={piece} delay={piece * 20} />
        ))}
      </div>

      {/* Main celebration card */}
      <div className="bg-gradient-to-br from-white via-yellow-50 to-orange-50 rounded-3xl p-6 sm:p-8 text-center shadow-2xl animate-scale-in max-w-sm w-full border-4 border-yellow-300 relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-transparent to-orange-100 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute top-4 right-4 w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="relative mb-4">
            <div className="text-6xl sm:text-8xl mb-4 animate-bounce">🎉</div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <Sparkles className="h-8 w-8 text-yellow-500 animate-spin" />
            </div>
            <div className="absolute -bottom-2 left-1/4">
              <Zap className="h-6 w-6 text-orange-500 animate-pulse" />
            </div>
            <div className="absolute -bottom-2 right-1/4">
              <Zap className="h-6 w-6 text-pink-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="h-8 w-8 text-yellow-600 animate-bounce" />
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Outstanding!
            </h2>
            <Trophy className="h-8 w-8 text-yellow-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          
          <p className="text-lg sm:text-xl text-gray-700 mb-4 font-semibold">
            Task Completed Successfully! 🚀
          </p>
          
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            You're making incredible progress towards your JEE goals!
          </p>
          
          <div className="flex justify-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 fill-current animate-pulse" 
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg animate-pulse">
            Keep The Momentum! 💪
          </div>
        </div>
      </div>
    </div>
  );
};
