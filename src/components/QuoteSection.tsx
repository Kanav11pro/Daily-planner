
import { useState, useEffect } from "react";
import { Star } from "lucide-react";

const motivationalQuotes = [
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Anonymous"
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Anonymous"
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Anonymous"
  },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Anonymous"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Anonymous"
  },
  {
    text: "Don't stop when you're tired. Stop when you're done.",
    author: "Anonymous"
  }
];

export const QuoteSection = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="h-6 w-6 text-yellow-300 animate-pulse" />
          <h2 className="text-xl font-semibold">Daily Motivation</h2>
        </div>
        
        <div className="animate-fade-in">
          <blockquote className="text-2xl font-medium mb-4 leading-relaxed">
            "{motivationalQuotes[currentQuote].text}"
          </blockquote>
          <cite className="text-lg text-indigo-100">
            — {motivationalQuotes[currentQuote].author}
          </cite>
        </div>
      </div>
      
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
    </div>
  );
};
