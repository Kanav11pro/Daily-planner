import { useState, useEffect } from "react";
import { Flame, Target, Trophy, Zap, ChevronRight } from "lucide-react";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";
const powerfulQuotes = [{
  text: "Champions aren't made in the gyms. Champions are made from something deep inside them: a desire, a dream, a vision.",
  author: "Muhammad Ali",
  category: "CHAMPION MINDSET"
}, {
  text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  author: "Winston Churchill",
  category: "RELENTLESS SPIRIT"
}, {
  text: "The expert in anything was once a beginner who refused to give up.",
  author: "Helen Hayes",
  category: "GROWTH MINDSET"
}, {
  text: "Your limitation—it's only your imagination. Push beyond what you think is possible.",
  author: "Anonymous",
  category: "BREAK BARRIERS"
}, {
  text: "Great things never come from comfort zones. Step into the fire of challenge.",
  author: "Anonymous",
  category: "COMFORT ZONE KILLER"
}, {
  text: "The pain of discipline weighs ounces while the pain of regret weighs tons.",
  author: "Jim Rohn",
  category: "DISCIPLINE POWER"
}, {
  text: "Don't stop when you're tired. Stop when you're done conquering your goals.",
  author: "Anonymous",
  category: "UNSTOPPABLE FORCE"
}, {
  text: "Hard work beats talent when talent doesn't work hard. Outwork everyone.",
  author: "Tim Notke",
  category: "WORK ETHIC"
}, {
  text: "A year from now you may wish you had started today. Start NOW.",
  author: "Karen Lamb",
  category: "URGENCY MINDSET"
}, {
  text: "Excellence is not a skill, it's an attitude. Demand excellence from yourself.",
  author: "Ralph Marston",
  category: "EXCELLENCE STANDARD"
}, {
  text: "Success is the sum of small efforts repeated day in and day out. Every day counts.",
  author: "Robert Collier",
  category: "CONSISTENCY WINS"
}, {
  text: "Champions train while others complain. What are YOU doing right now?",
  author: "Anonymous",
  category: "CHAMPION'S CHOICE"
}, {
  text: "Your only limit is your mind. Shatter every mental barrier.",
  author: "Anonymous",
  category: "LIMITLESS POTENTIAL"
}, {
  text: "It always seems impossible until it's done. Make the impossible inevitable.",
  author: "Nelson Mandela",
  category: "IMPOSSIBLE TO INEVITABLE"
}, {
  text: "Believe you can and you're halfway there. Now go all the way.",
  author: "Theodore Roosevelt",
  category: "BELIEF POWER"
}];
const motivationalActions = ["🔥 IGNITE YOUR POTENTIAL", "⚡ UNLEASH YOUR POWER", "🎯 LOCK ON TARGET", "💪 DOMINATE TODAY", "🚀 LAUNCH INTO GREATNESS"];
export const QuoteSection = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [currentAction, setCurrentAction] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const {
    theme
  } = useTheme();
  const themeColors = getThemeColors(theme);
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuote(prev => (prev + 1) % powerfulQuotes.length);
        setCurrentAction(prev => (prev + 1) % motivationalActions.length);
        setIsAnimating(false);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  const currentQuoteData = powerfulQuotes[currentQuote];
  return (
    <div className={`relative ${themeColors.card} backdrop-blur-xl border ${themeColors.border} rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden transform transition-all duration-700 hover:scale-[1.02]`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <div className={`transition-all duration-700 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-xl backdrop-blur-sm border border-amber-200/30">
                <Flame className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-amber-600 tracking-wider uppercase">
                  {currentQuoteData.category}
                </div>
                <div className="text-xs text-gray-500 mt-1">Daily Motivation</div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="h-4 w-4 text-indigo-500" />
              <Trophy className="h-4 w-4 text-yellow-500" />
              <Zap className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          
          <blockquote className="text-lg sm:text-xl font-semibold text-gray-800 leading-relaxed mb-4">
            "{currentQuoteData.text}"
          </blockquote>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              — <span className="font-medium">{currentQuoteData.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full border border-indigo-200/50">
                <span className="text-xs font-bold text-indigo-600">
                  {motivationalActions[currentAction]}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-indigo-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};