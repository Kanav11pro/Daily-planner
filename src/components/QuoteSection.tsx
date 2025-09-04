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
    <div className={`relative overflow-hidden rounded-2xl ${themeColors.card} ${themeColors.glow} transition-all duration-500 hover:scale-[1.02] group`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      <div className="relative p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold tracking-wider ${themeColors.accent} animate-pulse`}>
            <Flame className="w-4 h-4 mr-2" />
            {currentQuoteData.category}
          </div>
          <div className="flex space-x-2">
            <Target className="w-5 h-5 text-yellow-500 animate-bounce" />
            <Trophy className="w-5 h-5 text-amber-500 animate-pulse" />
            <Zap className="w-5 h-5 text-orange-500 animate-bounce" />
          </div>
        </div>
        
        <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
          <blockquote className={`text-lg sm:text-xl font-semibold leading-relaxed mb-4 ${themeColors.text}`}>
            "{currentQuoteData.text}"
          </blockquote>
          <cite className={`text-sm font-medium opacity-80 ${themeColors.text}`}>
            — {currentQuoteData.author}
          </cite>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200/20">
          <div className={`inline-flex items-center px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 group-hover:scale-105 ${themeColors.accent} cursor-pointer`}>
            <span className="mr-2">{motivationalActions[currentAction]}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};