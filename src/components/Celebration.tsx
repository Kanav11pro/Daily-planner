
import { Trophy, Star, Sparkles } from "lucide-react";

export const Celebration = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-none p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-2xl animate-scale-in max-w-sm w-full">
        <div className="relative">
          <div className="text-4xl sm:text-6xl mb-4 animate-bounce">🎉</div>
          <Sparkles className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-6 text-yellow-400 animate-ping" />
        </div>
        
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 animate-pulse" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Task Completed!</h2>
          <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 animate-pulse" />
        </div>
        
        <p className="text-sm sm:text-base text-gray-600 mb-4">Great job! You're one step closer to your JEE success!</p>
        
        <div className="flex justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 fill-current animate-pulse" 
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        
        <div className="mt-4 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Keep going! 🚀
        </div>
      </div>
    </div>
  );
};
