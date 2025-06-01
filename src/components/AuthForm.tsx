
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { BookOpen, Brain, GraduationCap, Target, Zap, Star, Trophy, Lightbulb, Calendar, CheckCircle, BarChart3, Clock, PenTool, Award, Rocket, Users, Sparkles, TrendingUp, Flame, Shield } from 'lucide-react';

export const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast.success('Account created successfully! Please check your email to verify your account.');
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Welcome back to Exam Ace!');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Reduced number of floating icons for better performance
  const studyIcons = [BookOpen, Brain, GraduationCap, Target, Trophy, Rocket];

  const features = [
    { icon: Calendar, title: "Smart Scheduling", desc: "AI-powered study planning", color: "from-blue-500 to-cyan-500" },
    { icon: Target, title: "Goal Tracking", desc: "Track your exam progress", color: "from-purple-500 to-pink-500" },
    { icon: Brain, title: "Study Analytics", desc: "Detailed performance insights", color: "from-green-500 to-emerald-500" },
    { icon: Trophy, title: "Achievement System", desc: "Rewards for consistency", color: "from-yellow-500 to-orange-500" },
    { icon: Rocket, title: "Productivity Boost", desc: "Enhanced learning efficiency", color: "from-red-500 to-pink-500" },
    { icon: Users, title: "Study Groups", desc: "Collaborative learning", color: "from-indigo-500 to-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 relative overflow-hidden">
      {/* Optimized Background with fewer elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Reduced floating icons for performance */}
        {studyIcons.map((Icon, index) => (
          <div
            key={index}
            className="absolute text-white/15 animate-bounce"
            style={{
              left: `${20 + (index * 15)}%`,
              top: `${10 + (index * 10)}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${3 + Math.random()}s`
            }}
          >
            <Icon size={20 + (index * 5)} />
          </div>
        ))}
        
        {/* Simplified gradient orbs */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-gradient-to-r from-cyan-500/25 to-blue-500/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Features Showcase */}
        <div className="lg:w-1/2 flex flex-col justify-center p-4 sm:p-6 lg:p-12 text-white">
          <div className="animate-fade-in max-w-lg mx-auto lg:max-w-none lg:mx-0">
            {/* Logo Section */}
            <div className="text-center lg:text-left mb-6 lg:mb-8">
              <div className="inline-flex items-center justify-center lg:justify-start mb-4">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                    <Star className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white via-yellow-200 to-orange-200 bg-clip-text text-transparent">
                    Exam Ace
                  </h1>
                  <div className="flex items-center mt-1">
                    <Flame className="h-4 w-4 text-orange-400 mr-1" />
                    <span className="text-sm sm:text-base text-orange-200 font-semibold">Ultimate Study Companion</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center lg:text-left mb-6 lg:mb-8">
              <p className="text-lg sm:text-xl lg:text-2xl mb-4 text-blue-100 font-medium">
                Transform Your Study Journey
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                Join thousands of students who've conquered their exams with AI-powered planning, 
                smart analytics, and motivational systems designed for academic excellence.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8 max-w-lg mx-auto lg:max-w-none lg:mx-0">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group shadow-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-2 sm:mb-3 shadow-md`}>
                  <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Success Stats */}
          <div className="flex justify-center lg:justify-start space-x-6 sm:space-x-8 text-center max-w-lg mx-auto lg:max-w-none lg:mx-0">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-green-400">98%</div>
              <div className="text-xs sm:text-sm text-gray-300">Success Rate</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">50K+</div>
              <div className="text-xs sm:text-sm text-gray-300">Students</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-purple-400">1M+</div>
              <div className="text-xs sm:text-sm text-gray-300">Tasks Completed</div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-white/20">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome to Exam Ace
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {isSignUp ? '🚀 Start your journey to exam success' : '🎯 Continue your path to excellence'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Brain className="inline h-4 w-4 mr-1 text-purple-600" />
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="border-2 focus:border-indigo-500 hover:border-purple-300"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="inline h-4 w-4 mr-1 text-blue-600" />
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="border-2 focus:border-indigo-500 hover:border-purple-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Zap className="inline h-4 w-4 mr-1 text-yellow-600" />
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  minLength={6}
                  className="border-2 focus:border-indigo-500 hover:border-purple-300"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl relative overflow-hidden group"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {isSignUp ? <Rocket className="h-4 w-4 mr-2" /> : <Trophy className="h-4 w-4 mr-2" />}
                    {isSignUp ? 'Start Your Journey' : 'Continue Learning'}
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {isSignUp ? '✨ Already have an account? Sign in' : "🎯 Don't have an account? Join Exam Ace"}
              </button>
            </div>

            {/* Motivational Quote */}
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl text-center border border-purple-100 shadow-md">
              <div className="flex justify-center items-center mb-2">
                <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                <Sparkles className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-sm text-gray-700 italic font-medium leading-relaxed">
                "Success is where preparation and opportunity meet."
              </p>
              <p className="text-xs text-gray-500 mt-1 font-semibold">- Bobby Unser</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
