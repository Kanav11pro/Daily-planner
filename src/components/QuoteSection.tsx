
import { useState, useEffect } from "react";
import { Star, Flame, Zap, Target, Trophy } from "lucide-react";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";

const motivationalQuotes = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Your limitation—it's only your imagination.", author: "Anonymous" },
  { text: "Great things never come from comfort zones.", author: "Anonymous" },
  { text: "Dream it. Wish it. Do it.", author: "Anonymous" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Anonymous" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Anonymous" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Anonymous" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Don't wait for opportunity. Create it.", author: "Anonymous" },
  { text: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.", author: "Anonymous" },
  { text: "The champion is the one who gets up, even when they can't.", author: "Jack Dempsey" },
  { text: "You don't have to be great to get started, but you have to get started to be great.", author: "Les Brown" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
  { text: "The pain of discipline weighs ounces while the pain of regret weighs tons.", author: "Jim Rohn" },
  { text: "Excellence is not a skill, it's an attitude.", author: "Ralph Marston" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
  { text: "Success is not how high you have climbed, but how you make a positive difference to the world.", author: "Roy T. Bennett" },
  { text: "Champions train, losers complain.", author: "Anonymous" },
  { text: "Your only limit is your mind.", author: "Anonymous" },
  { text: "Study while others are sleeping; work while others are loafing.", author: "William A. Ward" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Don't give up. The beginning is always the hardest.", author: "Anonymous" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Strive for progress, not perfection.", author: "Anonymous" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "If you want to achieve greatness stop asking for permission.", author: "Anonymous" },
  { text: "Things work out best for those who make the best of how things work out.", author: "John Wooden" },
  { text: "To live a creative life, we must lose our fear of being wrong.", author: "Anonymous" },
  { text: "If you are not willing to risk the usual you will have to settle for the ordinary.", author: "Jim Rohn" },
  { text: "Trust because you are willing to accept the risk, not because it's safe or certain.", author: "Anonymous" },
  { text: "Take up one idea. Make that one idea your life - think of it, dream of it, live on that idea.", author: "Swami Vivekananda" },
  { text: "All our dreams can come true if we have the courage to pursue them.", author: "Walt Disney" },
  { text: "Good things come to people who wait, but better things come to those who go out and get them.", author: "Anonymous" },
  { text: "If you do what you always did, you will get what you always got.", author: "Anonymous" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" }
];

export const QuoteSection = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const motivationIcons = [Flame, Zap, Target, Trophy, Star];
  const currentIcon = motivationIcons[currentQuote % motivationIcons.length];
  const IconComponent = currentIcon;

  return (
    <div className={`relative bg-gradient-to-r ${themeColors.primary} rounded-3xl p-8 text-white overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl animate-bounce" style={{ animationDelay: '2s' }}></div>
      
      {/* Floating particles */}
      <div className="absolute top-8 right-8 w-2 h-2 bg-yellow-300 rounded-full animate-bounce opacity-70" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-12 right-16 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-16 left-1/3 w-1 h-1 bg-white rounded-full animate-bounce opacity-50" style={{ animationDelay: '0.8s' }}></div>

      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="relative">
            <IconComponent className="h-8 w-8 text-yellow-300 animate-pulse" />
            <div className="absolute inset-0 h-8 w-8 text-yellow-300 animate-ping opacity-20"></div>
          </div>
          <h2 className="text-2xl font-bold tracking-wide">🔥 DAILY MOTIVATION</h2>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
        
        <div className="animate-fade-in key={currentQuote}">
          <div className="relative">
            <div className="text-6xl font-bold text-yellow-300/20 absolute -top-4 -left-2">"</div>
            <blockquote className="text-2xl sm:text-3xl font-bold mb-6 leading-relaxed relative pl-8 text-shadow-lg">
              {motivationalQuotes[currentQuote].text}
            </blockquote>
          </div>
          <div className="flex items-center justify-between">
            <cite className="text-xl font-semibold text-yellow-100 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              — {motivationalQuotes[currentQuote].author}
            </cite>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
              <Zap className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-bold">IGNITE YOUR POTENTIAL</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to action element */}
      <div className="absolute bottom-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold animate-bounce opacity-90">
        🚀 LET'S GO!
      </div>
    </div>
  );
};
