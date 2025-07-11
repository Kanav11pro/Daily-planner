
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { BookOpen, Brain, GraduationCap, Target, Trophy, Calendar, CheckCircle, BarChart3, Clock, PenTool, Award, Rocket, Lightbulb, Sparkles, TrendingUp, Shield, Users, Zap, Star, ChevronRight, Play } from 'lucide-react';

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

  // Enhanced study icons with animations
  const studyIcons = [BookOpen, Brain, GraduationCap, Target, Trophy, Calendar, Award, Lightbulb];

  // Comprehensive features showcase
  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      desc: "AI-powered study planning that adapts to your pace",
      color: "from-blue-500 to-cyan-500",
      delay: "0s"
    },
    {
      icon: Brain,
      title: "Cognitive Analytics",
      desc: "Track learning patterns and optimize retention",
      color: "from-purple-500 to-pink-500",
      delay: "0.2s"
    },
    {
      icon: Target,
      title: "Goal Mastery",
      desc: "Set and achieve ambitious academic targets",
      color: "from-green-500 to-emerald-500",
      delay: "0.4s"
    },
    {
      icon: Trophy,
      title: "Achievement System",
      desc: "Unlock rewards as you progress through milestones",
      color: "from-yellow-500 to-orange-500",
      delay: "0.6s"
    },
    {
      icon: BarChart3,
      title: "Performance Insights",
      desc: "Detailed analytics on your study effectiveness",
      color: "from-red-500 to-pink-500",
      delay: "0.8s"
    },
    {
      icon: Zap,
      title: "Instant Sync",
      desc: "Access your study plan anywhere, anytime",
      color: "from-indigo-500 to-purple-500",
      delay: "1s"
    }
  ];

  // Success statistics
  const stats = [
    { number: "50K+", label: "Students", icon: Users },
    { number: "95%", label: "Success Rate", icon: TrendingUp },
    { number: "4.9/5", label: "Rating", icon: Star },
    { number: "24/7", label: "Support", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dynamic gradient orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-full blur-2xl animate-bounce" style={{
          animationDelay: '1s',
          animationDuration: '6s'
        }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-500/25 to-blue-500/25 rounded-full blur-2xl animate-pulse" style={{
          animationDelay: '3s'
        }}></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-bounce" style={{
          animationDelay: '2s',
          animationDuration: '8s'
        }}></div>
        
        {/* Floating study icons with enhanced animations */}
        {studyIcons.map((Icon, index) => (
          <div
            key={index}
            className="absolute text-white/10 animate-bounce"
            style={{
              left: `${10 + index * 11}%`,
              top: `${8 + index * 10}%`,
              animationDelay: `${index * 1.2}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          >
            <Icon size={20 + index * 3} className="animate-pulse" />
          </div>
        ))}
        
        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Enhanced Features Showcase */}
        <div className="lg:w-1/2 flex flex-col justify-center p-4 sm:p-6 lg:p-12 text-white">
          <div className="animate-fade-in max-w-2xl mx-auto lg:max-w-none lg:mx-0">
            {/* Enhanced Logo & Brand Section */}
            <div className="text-center lg:text-left mb-8 lg:mb-12">
              <div className="inline-flex items-center justify-center lg:justify-start mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-500">
                    <GraduationCap className="h-12 w-12 sm:h-14 sm:w-14 text-white animate-bounce" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center animate-spin shadow-xl" style={{ animationDuration: '8s' }}>
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
                </div>
                <div className="ml-8">
                  <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent mb-2">
                    Exam Ace
                  </h1>
                  <div className="flex items-center">
                    <Shield className="h-6 w-6 text-emerald-400 mr-3 animate-pulse" />
                    <span className="text-lg sm:text-xl text-emerald-200 font-bold">Your AI Study Companion</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Tagline */}
            <div className="text-center lg:text-left mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-6 text-blue-100 font-bold leading-tight">
                🚀 Transform Your Study Journey with AI-Powered Learning
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed mb-8">
                Join <span className="text-yellow-400 font-bold">50,000+ students</span> who've mastered their exam preparation with our 
                comprehensive planning tools, advanced analytics, and gamified achievement systems.
              </p>
              
              {/* Call-to-action preview */}
              <div className="inline-flex items-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-purple-400/30 rounded-2xl px-6 py-4 mb-8">
                <Play className="h-6 w-6 text-purple-300 mr-3 animate-pulse" />
                <span className="text-purple-200 font-semibold">Start your success story today</span>
                <ChevronRight className="h-5 w-5 text-purple-300 ml-2 animate-bounce" />
              </div>
            </div>

            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl group"
                  style={{ animationDelay: feature.delay }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Success Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                  <stat.icon className="h-8 w-8 text-yellow-400 mx-auto mb-2 animate-pulse" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Enhanced Auth Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 sm:p-12 w-full max-w-lg border border-white/20">
            {/* Enhanced Header */}
            <div className="text-center mb-10">
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110">
                    <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 text-white animate-bounce" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
                Welcome to Exam Ace
              </h2>
              <p className="text-lg sm:text-xl text-gray-200 font-medium">
                {isSignUp ? '🚀 Begin your journey to academic excellence' : '🎯 Continue your path to success'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-bold text-white mb-3">
                    <Brain className="inline h-5 w-5 mr-2 text-purple-400" />
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="bg-white/10 border-2 border-white/20 focus:border-purple-400 hover:border-white/30 h-12 text-base rounded-xl text-white placeholder-gray-300 backdrop-blur-md"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  <Target className="inline h-5 w-5 mr-2 text-blue-400" />
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="bg-white/10 border-2 border-white/20 focus:border-blue-400 hover:border-white/30 h-12 text-base rounded-xl text-white placeholder-gray-300 backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  <Shield className="inline h-5 w-5 mr-2 text-green-400" />
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  minLength={6}
                  className="bg-white/10 border-2 border-white/20 focus:border-green-400 hover:border-white/30 h-12 text-base rounded-xl text-white placeholder-gray-300 backdrop-blur-md"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl relative overflow-hidden group shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center relative z-10">
                    {isSignUp ? <Rocket className="h-6 w-6 mr-3" /> : <Trophy className="h-6 w-6 mr-3" />}
                    {isSignUp ? 'Start Your Journey' : 'Continue Learning'}
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-lg text-purple-300 hover:text-purple-100 font-bold transition-colors duration-300 hover:underline"
              >
                {isSignUp ? '✨ Already have an account? Sign in' : "🎯 Don't have an account? Join Exam Ace"}
              </button>
            </div>

            {/* Enhanced Motivational Quote */}
            <div className="mt-10 p-8 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 rounded-2xl text-center border border-purple-300/30 shadow-2xl backdrop-blur-md">
              <div className="flex justify-center items-center mb-4">
                <Lightbulb className="h-8 w-8 text-yellow-400 mr-3 animate-pulse" />
                <TrendingUp className="h-6 w-6 text-purple-400 animate-bounce" />
              </div>
              <p className="text-lg text-white italic font-bold leading-relaxed mb-3">
                "The future belongs to those who believe in the beauty of their dreams."
              </p>
              <p className="text-sm text-purple-200 font-bold">- Eleanor Roosevelt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
