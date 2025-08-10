
import { useEffect, useState } from 'react';
import { Keyboard, Code, Zap } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface TypewriterCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

export const TypewriterCelebration = ({ message, onComplete }: TypewriterCelebrationProps) => {
  const [typedText, setTypedText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const fullText = "TASK COMPLETED! EXCELLENCE ACHIEVED!";

  useEffect(() => {
    setTimeout(() => setShowContent(true), 200);
    
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 80);

    const completeTimer = setTimeout(() => onComplete(), 4500);
    
    return () => {
      clearInterval(typeInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Simplified Matrix background for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-400 font-mono animate-pulse text-xs sm:text-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>

      {/* Terminal Window - Mobile Optimized */}
      <div className={`bg-gray-900 rounded-lg p-4 sm:p-6 text-center shadow-2xl max-w-sm sm:max-w-2xl w-full border border-green-400 relative overflow-hidden transition-all duration-700 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        {/* Terminal Header */}
        <div className="flex items-center mb-3 sm:mb-4 border-b border-gray-700 pb-2">
          <div className="flex space-x-1 sm:space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex-1 text-center text-gray-400 font-mono text-xs sm:text-sm">
            ExamAce Terminal
          </div>
        </div>

        {/* Typed Content */}
        <div className="font-mono text-left mb-4 sm:mb-6 text-xs sm:text-sm">
          <div className="text-green-400 mb-1 sm:mb-2">$ task_completion_protocol...</div>
          <div className="text-blue-400 mb-1 sm:mb-2">$ performance: EXCELLENT</div>
          <div className="text-yellow-400 mb-2 sm:mb-4">$ celebration_ready...</div>
          
          <div className="text-white text-sm sm:text-xl mb-3 sm:mb-4">
            {typedText}<span className="animate-blink">|</span>
          </div>
        </div>

        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
            <Keyboard className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 animate-pulse" />
            <h2 className="text-lg sm:text-2xl font-bold text-green-400">
              {message.title}
            </h2>
            <Code className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 animate-pulse" />
          </div>
          
          <p className="text-sm sm:text-lg text-gray-300 mb-3 sm:mb-4 font-mono">
            {message.message}
          </p>
          
          <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 font-mono">
            {message.subtitle}
          </p>
          
          <div className="bg-green-600 text-black px-4 sm:px-6 py-2 sm:py-3 rounded text-sm sm:text-lg font-bold font-mono animate-pulse">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 inline mr-2" />
            SUCCESS: Task completed! 💻
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  );
};
