
import { useState, useEffect } from "react";
import { Flame, Target, Trophy, Zap, ChevronRight } from "lucide-react";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";

const powerfulQuotes = [
  { 
    text: "Champions aren't made in the gyms. Champions are made from something deep inside them: a desire, a dream, a vision.", 
    author: "Muhammad Ali",
    category: "CHAMPION MINDSET" 
  },
  { 
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", 
    author: "Winston Churchill",
    category: "RELENTLESS SPIRIT" 
  },
  { 
    text: "The expert in anything was once a beginner who refused to give up.", 
    author: "Helen Hayes",
    category: "GROWTH MINDSET" 
  },
  { 
    text: "Your limitation—it's only your imagination. Push beyond what you think is possible.", 
    author: "Anonymous",
    category: "BREAK BARRIERS" 
  },
  { 
    text: "Great things never come from comfort zones. Step into the fire of challenge.", 
    author: "Anonymous",
    category: "COMFORT ZONE KILLER" 
  },
  { 
    text: "The pain of discipline weighs ounces while the pain of regret weighs tons.", 
    author: "Jim Rohn",
    category: "DISCIPLINE POWER" 
  },
  { 
    text: "Don't stop when you're tired. Stop when you're done conquering your goals.", 
    author: "Anonymous",
    category: "UNSTOPPABLE FORCE" 
  },
  { 
    text: "Hard work beats talent when talent doesn't work hard. Outwork everyone.", 
    author: "Tim Notke",
    category: "WORK ETHIC" 
  },
  { 
    text: "A year from now you may wish you had started today. Start NOW.", 
    author: "Karen Lamb",
    category: "URGENCY MINDSET" 
  },
  { 
    text: "Excellence is not a skill, it's an attitude. Demand excellence from yourself.", 
    author: "Ralph Marston",
    category: "EXCELLENCE STANDARD" 
  },
  { 
    text: "Success is the sum of small efforts repeated day in and day out. Every day counts.", 
    author: "Robert Collier",
    category: "CONSISTENCY WINS" 
  },
  { 
    text: "Champions train while others complain. What are YOU doing right now?", 
    author: "Anonymous",
    category: "CHAMPION'S CHOICE" 
  },
  { 
    text: "Your only limit is your mind. Shatter every mental barrier.", 
    author: "Anonymous",
    category: "LIMITLESS POTENTIAL" 
  },
  { 
    text: "It always seems impossible until it's done. Make the impossible inevitable.", 
    author: "Nelson Mandela",
    category: "IMPOSSIBLE TO INEVITABLE" 
  },
  { 
    text: "Believe you can and you're halfway there. Now go all the way.", 
    author: "Theodore Roosevelt",
    category: "BELIEF POWER" 
  }
];

const motivationalActions = [
  "🔥 IGNITE YOUR POTENTIAL",
  "⚡ UNLEASH YOUR POWER", 
  "🎯 LOCK ON TARGET",
  "💪 DOMINATE TODAY",
  "🚀 LAUNCH INTO GREATNESS"
];

export const QuoteSection = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [currentAction, setCurrentAction] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % powerfulQuotes.length);
        setCurrentAction((prev) => (prev + 1) % motivationalActions.length);
        setIsAnimating(false);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const currentQuoteData = powerfulQuotes[currentQuote];

  return (
    <div className={`relative bg-gradient-to-br ${themeColors.primary} rounded-3xl p-8 text-white overflow-hidden shadow-2xl border border-white/20`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-white/15 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute right-1/4 top-1/4 w-24 h-24 bg-yellow-400/20 rounded-full blur-lg animate-bounce delay-500"></div>
      </div>
      
      {/* Overlay Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10"></div>
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Flame className="h-8 w-8 text-orange-300 animate-pulse" />
              <div className="absolute inset-0 animate-ping">
                <Flame className="h-8 w-8 text-orange-300 opacity-75" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                DAILY FIRE
              </h2>
              <p className="text-sm text-white/80 font-medium">Fuel Your Success</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-yellow-300" />
            <Trophy className="h-6 w-6 text-yellow-300" />
          </div>
        </div>

        {/* Category Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4 border border-white/30">
          <Zap className="h-4 w-4 text-yellow-300 mr-2" />
          <span className="text-sm font-bold text-yellow-300 tracking-wider">
            {currentQuoteData.category}
          </span>
        </div>

        {/* Main Quote Section */}
        <div className={`transition-all duration-500 transform ${isAnimating ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
          <blockquote className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
              "{currentQuoteData.text}"
            </span>
          </blockquote>
          
          <div className="flex items-center justify-between">
            <cite className="text-xl text-white/90 font-semibold">
              — {currentQuoteData.author}
            </cite>
            
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span className="text-sm font-bold text-yellow-300">
                {motivationalActions[currentAction]}
              </span>
              <ChevronRight className="h-4 w-4 text-yellow-300 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Action Call-to-Action */}
        <div className="mt-8 p-4 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl border border-yellow-300/30 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-2">
            <Flame className="h-5 w-5 text-orange-300 animate-bounce" />
            <span className="text-lg font-bold text-center bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
              Every second counts. Your future self is watching. MAKE IT COUNT! 
            </span>
            <Flame className="h-5 w-5 text-orange-300 animate-bounce delay-100" />
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {powerfulQuotes.slice(0, 5).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentQuote % 5 ? 'bg-yellow-300 scale-125' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
