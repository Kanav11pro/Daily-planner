import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { BookOpen, Brain, GraduationCap, Target, Trophy, Calendar, BarChart3, Clock, PenTool, Shield, Sparkles, Lightbulb, TrendingUp, Rocket } from 'lucide-react';

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

  // Study-related icons for background
  const studyIcons = [BookOpen, Brain, GraduationCap, Target, Trophy, Calendar];

  // Features to display
  const features = [
    { icon: Calendar, title: 'Smart Scheduling', desc: 'Plan your daily study sessions', color: 'from-blue-500 to-cyan-500' },
    { icon: Target, title: 'Task Management', desc: 'Track your study goals', color: 'from-purple-500 to-pink-500' },
    { icon: BarChart3, title: 'Progress Analytics', desc: 'Monitor your performance', color: 'from-green-500 to-emerald-500' },
    { icon: Trophy, title: 'Achievement System', desc: 'Celebrate your progress', color: 'from-yellow-500 to-orange-500' },
    { icon: Clock, title: 'Time Tracking', desc: 'Optimize study duration', color: 'from-red-500 to-pink-500' },
    { icon: PenTool, title: 'Subject Organization', desc: 'Organize by chapters', color: 'from-indigo-500 to-purple-500' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-slate-900" />

      {/* Soft radial glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.25),transparent_60%)]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.22),transparent_60%)]" />

      {/* Animated gradient blobs */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-tr from-fuchsia-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-[pulse_4s_ease-in-out_infinite_1s]" />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Floating study icons */}
      {studyIcons.map((Icon, index) => (
        <div
          key={index}
          className="absolute text-white/10 animate-[float_6s_ease-in-out_infinite]"
          style={{
            left: `${12 + index * 14}%`,
            top: `${8 + index * 9}%`,
            animationDelay: `${index * 0.7}s`,
          }}
        >
          <Icon size={18 + index * 5} />
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left: Brand + Features */}
        <div className="lg:w-1/2 flex flex-col justify-center p-6 sm:p-10 lg:p-14 text-white">
          <div className="max-w-xl">
            {/* Logo/Brand */}
            <div className="flex items-center gap-5 mb-10">
              <div className="relative">
                <div className="size-20 sm:size-24 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 shadow-2xl grid place-content-center">
                  <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-300 animate-bounce" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent">Exam Ace</span>
                </h1>
                <div className="mt-2 flex items-center text-emerald-200">
                  <Shield className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Smart study companion</span>
                </div>
              </div>
            </div>

            {/* Hero copy */}
            <p className="text-xl sm:text-2xl font-semibold text-blue-100 mb-3">
              Transform the study journey with structured planning and insights
            </p>
            <p className="text-base sm:text-lg text-gray-300 mb-10">
              Plan sessions, track goals, and measure progress with a clean, focused interface designed for exam excellence
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {features.map(({ icon: Ico, title, desc, color }, i) => (
                <div
                  key={i}
                  className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-white/10 to-white/0 hover:from-white/20 transition"
                >
                  <div className="rounded-2xl h-full w-full bg-white/5 backdrop-blur-xl border border-white/10 p-4">
                    <div className={`inline-flex items-center justify-center rounded-xl p-2 bg-gradient-to-r ${color} text-white shadow-lg mb-3`}>
                      <Ico className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-semibold">{title}</h3>
                    <p className="text-sm text-gray-300 mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-gray-300">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur">No-nonsense UI</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur">Accessible focus states</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur">Responsive by default</span>
            </div>
          </div>
        </div>

        {/* Right: Auth Card */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="relative rounded-3xl border border-white/15 bg-white/90 backdrop-blur-2xl shadow-2xl">
              {/* Shine */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              {/* Header */}
              <div className="px-8 pt-8 text-center">
                <div className="mx-auto mb-6 relative">
                  <div className="size-20 sm:size-24 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 grid place-content-center shadow-2xl">
                    <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl blur-2xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 -z-10" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {isSignUp ? 'Create your Exam Ace account' : 'Welcome back to Exam Ace'}
                </h2>
                <p className="mt-2 text-gray-600">
                  {isSignUp ? '🚀 Start the journey to exam success' : '🎯 Continue the path to excellence'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                {isSignUp && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <span className="inline-flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-600" />
                        Full Name
                      </span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <Brain className="h-4 w-4 text-purple-500/70" />
                      </div>
                      <Input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="Enter full name"
                        className="pl-9 h-12 text-base rounded-xl border-2 hover:border-purple-300 focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-300 transition"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="inline-flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      Email
                    </span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                      <Target className="h-4 w-4 text-blue-500/70" />
                    </div>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter email"
                      className="pl-9 h-12 text-base rounded-xl border-2 hover:border-purple-300 focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-300 transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="inline-flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      Password
                    </span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                      <Shield className="h-4 w-4 text-green-500/70" />
                    </div>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter password"
                      minLength={6}
                      className="pl-9 h-12 text-base rounded-xl border-2 hover:border-purple-300 focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-300 transition"
                    />
                  </div>
                  <p className="text-xs text-gray-500">At least 6 characters</p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition active:scale-[0.99]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition duration-700" />
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      {isSignUp ? <Rocket className="h-5 w-5 mr-3" /> : <Trophy className="h-5 w-5 mr-3" />}
                      {isSignUp ? 'Start Your Journey' : 'Continue Learning'}
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-base text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                  >
                    {isSignUp ? '✨ Already have an account? Sign in' : "🎯 Don't have an account? Join Exam Ace"}
                  </button>
                </div>
              </form>

              {/* Quote */}
              <div className="px-8 pb-8">
                <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-purple-100">
                  <div className="flex justify-center items-center gap-3 mb-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-700 italic font-semibold text-center">
                    "Success is where preparation and opportunity meet."
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-bold text-center">- Bobby Unser</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      

      {/* Keyframes for float */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};
