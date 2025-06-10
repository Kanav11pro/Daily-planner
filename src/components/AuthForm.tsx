import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { BookOpen, Brain, GraduationCap, Target, Trophy, Calendar, CheckCircle, BarChart3, Clock, PenTool, Award, Rocket, Lightbulb, Sparkles, TrendingUp, Shield } from 'lucide-react';
export const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    signUp,
    signIn
  } = useAuth();
  const {
    theme
  } = useTheme();
  const themeColors = getThemeColors(theme);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const {
          error
        } = await signUp(email, password, fullName);
        if (error) throw error;
        toast.success('Account created successfully! Please check your email to verify your account.');
      } else {
        const {
          error
        } = await signIn(email, password);
        if (error) throw error;
        toast.success('Welcome back to Exam Ace!');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Study-related icons for background
  const studyIcons = [BookOpen, Brain, GraduationCap, Target, Trophy, Calendar];

  // Updated features to show only what exists in the app
  const features = [{
    icon: Calendar,
    title: "Smart Scheduling",
    desc: "Plan your daily study sessions",
    color: "from-blue-500 to-cyan-500"
  }, {
    icon: Target,
    title: "Task Management",
    desc: "Track your study goals",
    color: "from-purple-500 to-pink-500"
  }, {
    icon: BarChart3,
    title: "Progress Analytics",
    desc: "Monitor your performance",
    color: "from-green-500 to-emerald-500"
  }, {
    icon: Trophy,
    title: "Achievement System",
    desc: "Celebrate your progress",
    color: "from-yellow-500 to-orange-500"
  }, {
    icon: Clock,
    title: "Time Tracking",
    desc: "Optimize study duration",
    color: "from-red-500 to-pink-500"
  }, {
    icon: PenTool,
    title: "Subject Organization",
    desc: "Organize by chapters",
    color: "from-indigo-500 to-purple-500"
  }];
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-gradient-to-r from-pink-500/15 to-violet-500/15 rounded-full blur-2xl animate-bounce" style={{
        animationDelay: '1s',
        animationDuration: '4s'
      }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse" style={{
        animationDelay: '2s'
      }}></div>
        
        {/* Floating study icons */}
        {studyIcons.map((Icon, index) => <div key={index} className="absolute text-white/10 animate-bounce" style={{
        left: `${15 + index * 12}%`,
        top: `${10 + index * 8}%`,
        animationDelay: `${index * 0.8}s`,
        animationDuration: `${3 + Math.random()}s`
      }}>
            <Icon size={16 + index * 4} />
          </div>)}
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Enhanced Features Showcase */}
        <div className="lg:w-1/2 flex flex-col justify-center p-4 sm:p-6 lg:p-12 text-white">
          <div className="animate-fade-in max-w-lg mx-auto lg:max-w-none lg:mx-0">
            {/* Enhanced Logo Section */}
            <div className="text-center lg:text-left mb-8 lg:mb-12">
              <div className="inline-flex items-center justify-center lg:justify-start mb-6">
                <div className="relative group">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                    <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center animate-bounce shadow-xl">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                </div>
                <div className="ml-6">
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent">
                    Exam Ace
                  </h1>
                  <div className="flex items-center mt-2">
                    <Shield className="h-5 w-5 text-emerald-400 mr-2" />
                    <span className="text-base sm:text-lg text-emerald-200 font-semibold">Your Smart Study Companion</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center lg:text-left mb-8 lg:mb-12">
              <p className="text-xl sm:text-2xl lg:text-3xl mb-6 text-blue-100 font-bold">
                Transform Your Study Journey 🚀
              </p>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed">
                Join thousands of students who've mastered their exam preparation with our 
                comprehensive planning tools, analytics, and achievement systems.
              </p>
            </div>
          </div>

          {/* Enhanced Features Grid */}
          

          {/* Enhanced Success Stats */}
          
        </div>

        {/* Right Side - Enhanced Auth Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md border border-white/30">
            {/* Enhanced Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative group">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-shadow duration-300">
                    <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">Welcome to Exam Ace</h2>
              <p className="text-base sm:text-lg text-gray-600 font-medium">
                {isSignUp ? '🚀 Start your journey to exam success' : '🎯 Continue your path to excellence'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Brain className="inline h-4 w-4 mr-2 text-purple-600" />
                    Full Name
                  </label>
                  <Input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Enter your full name" className="border-2 focus:border-indigo-500 hover:border-purple-300 h-12 text-base rounded-xl" />
                </div>}
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Target className="inline h-4 w-4 mr-2 text-blue-600" />
                  Email
                </label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" className="border-2 focus:border-indigo-500 hover:border-purple-300 h-12 text-base rounded-xl" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Shield className="inline h-4 w-4 mr-2 text-green-600" />
                  Password
                </label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" minLength={6} className="border-2 focus:border-indigo-500 hover:border-purple-300 h-12 text-base rounded-xl" />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300">
                {loading ? <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing...
                  </div> : <div className="flex items-center justify-center">
                    {isSignUp ? <Rocket className="h-5 w-5 mr-3" /> : <Trophy className="h-5 w-5 mr-3" />}
                    {isSignUp ? 'Start Your Journey' : 'Continue Learning'}
                  </div>}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-base text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200">
                {isSignUp ? '✨ Already have an account? Sign in' : "🎯 Don't have an account? Join Exam Ace"}
              </button>
            </div>

            {/* Enhanced Motivational Quote */}
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl text-center border border-purple-100 shadow-lg">
              <div className="flex justify-center items-center mb-3">
                <Lightbulb className="h-6 w-6 text-yellow-500 mr-3" />
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-base text-gray-700 italic font-semibold leading-relaxed">
                "Success is where preparation and opportunity meet."
              </p>
              <p className="text-sm text-gray-500 mt-2 font-bold">- Bobby Unser</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};