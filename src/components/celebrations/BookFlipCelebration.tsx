
import { useEffect, useState } from 'react';
import { BookOpen, GraduationCap, Award } from 'lucide-react';

interface CelebrationMessage {
  title: string;
  message: string;
  subtitle: string;
}

interface BookFlipCelebrationProps {
  message: CelebrationMessage;
  onComplete: () => void;
}

export const BookFlipCelebration = ({ message, onComplete }: BookFlipCelebrationProps) => {
  const [showContent, setShowContent] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pages = ['📖', '📚', '🎓', '🏆', '⭐'];

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
    
    const pageInterval = setInterval(() => {
      setCurrentPage(prev => (prev + 1) % pages.length);
    }, 600);

    setTimeout(() => onComplete(), 5000);
    
    return () => clearInterval(pageInterval);
  }, [onComplete, pages.length]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 flex items-center justify-center z-50 pointer-events-none p-4">
      {/* Floating Knowledge Symbols */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              fontSize: `${16 + Math.random() * 12}px`
            }}
          >
            {['📝', '✏️', '📐', '🔬', '🧮', '📊', '📈'][Math.floor(Math.random() * 7)]}
          </div>
        ))}
      </div>

      {/* Book Pages Animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div 
            className="text-9xl animate-pulse transition-all duration-500"
            style={{ transform: `rotateY(${currentPage * 20}deg)` }}
          >
            {pages[currentPage]}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md w-full border-4 border-amber-400 relative overflow-hidden transition-all duration-1000 ${showContent ? 'animate-scale-in opacity-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 animate-pulse opacity-60"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6 space-x-4">
            <BookOpen className="h-12 w-12 text-amber-600 animate-bounce" />
            <GraduationCap className="h-16 w-16 text-blue-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <Award className="h-12 w-12 text-green-600 animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
            {message.title}
          </h2>
          
          <p className="text-xl text-gray-700 mb-4 font-semibold">
            {message.message}
          </p>
          
          <p className="text-base text-gray-600 mb-6">
            {message.subtitle}
          </p>
          
          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mb-6">
            {pages.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === currentPage ? 'bg-amber-500 scale-125' : 'bg-amber-200'
                }`}
              />
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full text-lg font-bold animate-pulse">
            Knowledge Mastered! 📚
          </div>
        </div>
      </div>
    </div>
  );
};
