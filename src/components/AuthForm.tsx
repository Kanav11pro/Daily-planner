import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import {
  BookOpen,
  Brain,
  GraduationCap,
  Target,
  Trophy,
  Calendar,
  BarChart3,
  Clock,
  PenTool,
  Shield,
  Sparkles,
  Rocket,
} from 'lucide-react';

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

  const studyIcons = [BookOpen, Brain, GraduationCap, Target, Trophy, Calendar];

  const features = [
    { icon: Calendar, title: 'Smart Scheduling', desc: 'Plan daily study sessions', color: 'from-blue-500 to-cyan-500' },
    { icon: Target, title: 'Task Management', desc: 'Track study goals', color: 'from-purple-500 to-pink-500' },
    { icon: BarChart3, title: 'Progress Analytics', desc: 'Monitor performance', color: 'from-green-500 to-emerald-500' },
    { icon: Trophy, title: 'Achievement System', desc: 'Celebrate progress', color: 'from-yellow-500 to-orange-500' },
    { icon: Clock, title: 'Time Tracking', desc: 'Optimize study duration', color: 'from-red-500 to-pink-500' },
    { icon: PenTool, title: 'Subject Organization', desc: 'Organize by chapters', color: 'from-indigo-500 to-purple-500' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Bold gradient hero with dark overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Saturated mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_20%_10%,rgba(99,102,241,0.35),transparent_60%),radial-gradient(50rem_30rem_at_80%_20%,rgba(168,85,247,0.35),transparent_60%),radial-gradient(70rem_40rem_at_50%_80%,rgba(236,72,153,0.35),transparent_60%)]" />
        {/* Darkening overlay to avoid washed-out look */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-slate-950/95" />
        {/* Subtle grid for texture */}
        <div className="absolute inset-0 opacity-[0.07] [background:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:42px_42px]" />
      </div>

      {/* Understated study icon field */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {studyIcons.map((Icon, i) => (
          <div
            key={i}
            className="absolute text-white/10"
            style={{
              left: `${12 + i * 14}%`,
              top: `${18 + (i % 3) * 22}%`,
            }}
          >
            <Icon size={18 + i * 6} />
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Left: Brand & features */}
        <aside className="flex flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-14">
          <div className="mx-auto w-full max-w-xl lg:mx-0">
            <div className="mb-10 text-center lg:text-left">
              <div className="inline-flex items-center justify-center lg:justify-start">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500 shadow-2xl shadow-black/40 ring-1 ring-white/10">
                    <GraduationCap className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-red-500 shadow-md shadow-black/40">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-6">
                  <h1 className="bg-gradient-to-r from-white via-amber-100 to-orange-200 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
                    Exam Ace
                  </h1>
                  <div className="mt-2 flex items-center text-emerald-200">
                    <Shield className="mr-2 h-5 w-5" />
                    <span className="text-lg font-semibold">Your Smart Study Companion</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <p className="mb-3 text-3xl font-bold leading-tight text-indigo-100 sm:text-4xl">
                Prepare with clarity and confidence
              </p>
              <p className="text-lg leading-relaxed text-slate-200">
                Plan precisely, track progress, and stay motivated with analytics and achievements built for exam excellence.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {features.map(({ icon: Icon, title, desc, color }, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-lg shadow-black/30 transition-colors hover:border-white/20"
                >
                  <div className={`inline-flex rounded-xl bg-gradient-to-r ${color} p-2 text-white shadow ring-1 ring-white/10`}>
                    <Icon size={18} />
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-white">{title}</h3>
                    <p className="mt-1 text-xs text-slate-300">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right: Solid auth card */}
        <section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-black/50">
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 shadow-xl shadow-black/40 ring-1 ring-black/20">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <h2 className="mb-2 text-3xl font-bold text-white">
                  {isSignUp ? 'Create your Exam Ace account' : 'Welcome to Exam Ace'}
                </h2>
                <p className="text-sm text-slate-300">
                  {isSignUp ? '🚀 Start the journey to exam success' : '🎯 Continue the path to excellence'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignUp && (
                  <div>
                    <label htmlFor="full_name" className="mb-2 block text-sm font-semibold text-slate-200">
                      <span className="inline-flex items-center">
                        <Brain className="mr-2 h-4 w-4 text-purple-300" />
                        Full Name
                      </span>
                    </label>
                    <Input
                      id="full_name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Enter full name"
                      className="h-12 rounded-xl border-2 border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:bg-slate-900"
                      aria-label="Full name"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-200">
                    <span className="inline-flex items-center">
                      <Target className="mr-2 h-4 w-4 text-indigo-300" />
                      Email
                    </span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="h-12 rounded-xl border-2 border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:bg-slate-900"
                    aria-label="Email address"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-200">
                    <span className="inline-flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-emerald-300" />
                      Password
                    </span>
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter a secure password"
                    minLength={6}
                    className="h-12 rounded-xl border-2 border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:bg-slate-900"
                    aria-label="Password"
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="relative w-full rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 py-4 font-bold text-white shadow-lg shadow-black/40 transition-[transform,box-shadow] hover:from-indigo-700 hover:to-fuchsia-700 hover:shadow-xl hover:shadow-black/50 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      {isSignUp ? <Rocket className="mr-3 h-5 w-5" /> : <Trophy className="mr-3 h-5 w-5" />}
                      {isSignUp ? 'Start Your Journey' : 'Continue Learning'}
                    </div>
                  )}
                </Button>
              </form>

              {/* Switch */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-base font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
                >
                  {isSignUp ? '✨ Already have an account? Sign in' : "🎯 Don't have an account? Join Exam Ace"}
                </button>
              </div>

              {/* Quote */}
              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 text-center shadow-md shadow-black/30">
                <p className="text-base font-semibold leading-relaxed text-slate-100">
                  "Success is where preparation and opportunity meet."
                </p>
                <p className="mt-2 text-sm font-bold text-slate-400">- Bobby Unser</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
