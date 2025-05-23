
import { Trophy, Star } from "lucide-react";

export const Celebration = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-2xl p-8 text-center shadow-2xl animate-scale-in">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800">Task Completed!</h2>
          <Trophy className="h-8 w-8 text-yellow-500" />
        </div>
        <p className="text-gray-600 mb-4">Great job! You're one step closer to your JEE success!</p>
        <div className="flex justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-6 w-6 text-yellow-400 fill-current animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
};
