
import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";

const motivationMessages = [
  {
    title: "GRIND NEVER STOPS!",
    message: "Every page you study, every problem you solve - you're building an unstoppable mind!"
  },
  {
    title: "BEAST MODE ACTIVATED!",
    message: "Champions don't wait for motivation. They create it through action!"
  },
  {
    title: "LEVEL UP TIME!",
    message: "Each study session is a step closer to your dreams. Keep pushing!"
  },
  {
    title: "UNSTOPPABLE FORCE!",
    message: "Your dedication today determines your success tomorrow. Stay hungry!"
  },
  {
    title: "POWER THROUGH!",
    message: "Difficult roads often lead to beautiful destinations. Keep going!"
  },
  {
    title: "DOMINATE TODAY!",
    message: "Success isn't given, it's earned. One chapter at a time!"
  },
  {
    title: "CRUSH YOUR GOALS!",
    message: "Every expert was once a beginner. Every pro was once an amateur!"
  },
  {
    title: "RISE AND GRIND!",
    message: "Your future self is counting on your present efforts!"
  },
  {
    title: "BREAKTHROUGH MODE!",
    message: "The pain of discipline weighs ounces, the pain of regret weighs tons!"
  },
  {
    title: "ELITE MINDSET!",
    message: "Winners focus on winning. Losers focus on winners. Be the winner!"
  },
  {
    title: "MAXIMUM EFFORT!",
    message: "Success is not final, failure is not fatal. It's the courage to continue!"
  },
  {
    title: "GAME CHANGER!",
    message: "You don't have to be great to get started, but you have to get started to be great!"
  },
  {
    title: "LIMITLESS POTENTIAL!",
    message: "Your only limit is your mind. Break through and soar!"
  },
  {
    title: "WARRIOR SPIRIT!",
    message: "Study like your future depends on it - because it does!"
  },
  {
    title: "RELENTLESS PURSUIT!",
    message: "Excellence is not a skill, it's an attitude. Adopt it now!"
  },
  {
    title: "CHAMPION MINDSET!",
    message: "Hard work beats talent when talent doesn't work hard!"
  },
  {
    title: "VICTORY AWAITS!",
    message: "The difference between ordinary and extraordinary is that little extra!"
  },
  {
    title: "PUSH BEYOND LIMITS!",
    message: "Success is the sum of small efforts repeated day in and day out!"
  },
  {
    title: "CONQUER YOUR FEARS!",
    message: "Don't watch the clock; do what it does. Keep going!"
  },
  {
    title: "UNSTOPPABLE ENERGY!",
    message: "Your dreams are waiting on the other side of your hard work!"
  }
];

export const MotivationEngine = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % motivationMessages.length);
    }, 5000); // Change every 5 seconds for more frequent updates

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`bg-gradient-to-r ${themeColors.primary} rounded-2xl p-6 text-white relative overflow-hidden animate-fade-in`}>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-3">
          <Zap className="h-6 w-6 text-yellow-300 animate-pulse" />
          <h3 className="text-lg font-bold">Motivation Engine</h3>
        </div>
        
        <div className="animate-fade-in">
          <h4 className="text-xl font-bold mb-2 text-yellow-300">
            {motivationMessages[currentMessage].title}
          </h4>
          <p className="text-base leading-relaxed">
            {motivationMessages[currentMessage].message}
          </p>
        </div>
      </div>
      
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
    </div>
  );
};
