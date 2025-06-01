
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { BookOpen, Brain, GraduationCap, Target, Zap, Star, Trophy, Lightbulb, Calendar, CheckCircle, BarChart3, Clock, PenTool, Award, Rocket, Users } from 'lucide-react';

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

  const studyIcons = [BookOpen, Brain, GraduationCap, Target, Zap, Star, Trophy, Lightbulb, Calendar, CheckCircle, BarChart3, Clock, PenTool, Award];

  const features = [
    { icon: Calendar, title: "Smart Scheduling", desc: "AI-powered study planning" },
    { icon: Target, title: "Goal Tracking", desc: "Track your exam progress" },
    { icon: Brain, title: "Study Analytics", desc: "Detailed performance insights" },
    { icon: Trophy, title: "Achievement System", desc: "Rewards for consistency" },
    { icon: Rocket, title: "Productivity Boost", desc: "Enhanced learning efficiency" },
    { icon: Users, title: "Study Groups", desc: "Collaborative learning" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Study Icons with varied animations */}
        {studyIcons.map((Icon, index) => (
          <div
            key={index}
            className={`absolute text-white/10 ${
              index % 3 === 0 ? 'animate-bounce' : 
              index % 3 === 1 ? 'animate-pulse' : 'animate-ping'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${index * 0.3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            <Icon size={20 + Math.random() * 40} />
          </div>
        ))}
        
        {/* Enhanced Gradient Orbs with pulsing effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/30 to-indigo-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-500/30 to-red-500/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-white/20 rotate-45 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-20 right-20 w-6 h-6 bg-blue-400/30 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-20 left-20 w-5 h-5 bg-purple-400/30 rotate-12 animate-pulse" style={{ animationDelay: '2.5s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Features Showcase */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 text-white">
          <div className="animate-fade-in">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              📚 Exam Ace
            </h1>
            <p className="text-2xl mb-8 text-blue-100">
              Your Ultimate Study Companion
            </p>
            <p className="text-lg text-gray-300 mb-12 leading-relaxed">
              Transform your study habits with AI-powered planning, smart scheduling, and comprehensive analytics. 
              Join thousands of students who've aced their exams with our platform.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 animate-fade-in hover:bg-white/20 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className="h-8 w-8 text-blue-300 mb-3" />
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Success Stats */}
          <div className="flex justify-between text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div>
              <div className="text-3xl font-bold text-green-400">98%</div>
              <div className="text-sm text-gray-300">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">50K+</div>
              <div className="text-sm text-gray-300">Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">1M+</div>
              <div className="text-sm text-gray-300">Tasks Completed</div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20 animate-scale-in">
            {/* Header with Enhanced Animation */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center animate-wiggle">
                    <GraduationCap className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                    <Star className="h-3 w-3 text-yellow-800" />
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-fade-in">
                Welcome to Exam Ace
              </h2>
              <p className="text-gray-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {isSignUp ? 'Start your journey to exam success' : 'Continue your path to excellence'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Brain className="inline h-4 w-4 mr-1" />
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-2 focus:border-indigo-500"
                  />
                </div>
              )}
              
              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-2 focus:border-indigo-500"
                />
              </div>

              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Zap className="inline h-4 w-4 mr-1" />
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  minLength={6}
                  className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-2 focus:border-indigo-500"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-xl text-white font-semibold py-3 rounded-xl animate-fade-in"
                style={{ animationDelay: '0.3s' }}
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

            <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-300 hover:underline"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Join Exam Ace"}
              </button>
            </div>

            {/* Enhanced Motivational Quote */}
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Lightbulb className="h-5 w-5 text-yellow-500 mx-auto mb-2 animate-pulse" />
              <p className="text-sm text-gray-600 italic font-medium">
                "Success is where preparation and opportunity meet."
              </p>
              <p className="text-xs text-gray-500 mt-1">- Bobby Unser</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
