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

  // Study-related icons for background
  const studyIcons = [BookOpen, Brain, GraduationCap, Target, Trophy, Calendar];

  // Updated features to show only what exists in the app
  const features = [
    { icon: Calendar, title: 'Smart Scheduling', desc: 'Plan daily study sessions', color: 'from-blue-500 to-cyan-500' },
    { icon: Target, title: 'Task Management', desc: 'Track study goals', color: 'from-purple-500 to-pink-500' },
    { icon: BarChart3, title: 'Progress Analytics', desc: 'Monitor performance', color: 'from-green-500 to-emerald-500' },
    { icon: Trophy, title: 'Achievement System', desc: 'Celebrate progress', color: 'from-yellow-500 to-orange-500' },
    { icon: Clock, title: 'Time Tracking', desc: 'Optimize study duration', color: 'from-red-500 to-pink-500' },
    { icon: PenTool, title: 'Subject Organization', desc: 'Organize by chapters', color: 'from-indigo-500 to-purple-500' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient mesh + noise */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Mesh gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
        <div className="absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-indigo-500/25 to-purple-500/20 blur-3xl" />
        <div className="absolute top-1/4 right-0 h-[22rem] w-[22rem] rounded-full bg-gradient-to-tr from-pink-500/20 to-violet-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-gradient-to-br from-cyan-400/20 to-sky-500/20 blur-2xl" />
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_30%_10%,rgba(255,255,255,0.06),transparent_60%)]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.06] [background:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:44px_44px]" />
        {/* Noise layer */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.35%22/></svg>')]" />
      </div>

      {/* Floating study icons */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {studyIcons.map((Icon, index) => (
          <div
            key={index}
            className="absolute text-white/15 motion-reduce:animate-none animate-pulse"
            style={{
              left: `${10 + index * 14}%`,
              top: `${12 + (index % 3) * 22}%`,
              animationDelay: `${index * 0.9}s`,
            }}
          >
            <Icon size={18 + index * 6} />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Left: Brand + value prop */}
        <section className="flex flex-col justify-center px-5 py-10 text-white sm:px-8 lg:w-1/2 lg:px-14">
          <div className="mx-auto max-w-xl lg:mx-0">
            {/* Logo block */}
            <div className="mb-10 text-center lg:text-left">
              <div className="inline-flex items-center justify-center lg:justify-start">
                <div className="group relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500 shadow-2xl ring-1 ring-white/10">
                    <GraduationCap className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-red-500 shadow-lg motion-reduce:animate-none animate-bounce">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500 opacity-25 blur-2xl" />
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

            {/* Headline */}
            <div className="mb-10 text-center lg:text-left">
              <p className="mb-4 text-3xl font-bold leading-tight text-blue-100 sm:text-4xl">
                Transform the way to prepare 📚
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                Plan precisely, track progress, and stay motivated with analytics and achievements designed for exam excellence.
              </p>
            </div>

            {/* Feature grid (purely visual) */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {features.map(({ icon: Icon, title, desc, color }, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div className={`inline-flex rounded-xl bg-gradient-to-r ${color} p-2 text-white shadow-md ring-1 ring-white/10`}>
                    <Icon size={18} />
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-white">{title}</h3>
                    <p className="mt-1 text-xs text-white/70">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right: Auth card */}
        <section className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="relative rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
              {/* Glow ring */}
              <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-white/20 via-white/5 to-transparent" />
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl ring-1 ring-black/10">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <h2 className="mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
                  {isSignUp ? 'Create an Exam Ace account' : 'Welcome to Daily Planner'}
                </h2>
                <p className="text-sm text-white/80">
                  {isSignUp ? '🚀 Start the journey to exam success' : '🎯 Continue the path to excellence'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignUp && (
                  <div>
                    <label
                      htmlFor="full_name"
                      className="mb-2 block text-sm font-semibold text-white/90"
                    >
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
                      className="h-12 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-indigo-400 focus:bg-white/5"
                      aria-label="Full name"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-white/90"
                  >
                    <span className="inline-flex items-center">
                      <Target className="mr-2 h-4 w-4 text-blue-300" />
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
                    className="h-12 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-indigo-400 focus:bg-white/5"
                    aria-label="Email address"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-white/90"
                  >
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
                    className="h-12 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-indigo-400 focus:bg-white/5"
                    aria-label="Password"
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 font-bold text-white shadow-lg ring-1 ring-black/10 transition-all hover:from-indigo-700 hover:to-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:opacity-70"
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

              {/* Switch mode */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-base font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
                >
                  {isSignUp
                    ? '✨ Already have an account? Sign in'
                    : "🎯 Don't have an account? Join Exam Ace"}
                </button>
              </div>

              {/* Quote */}
              <div className="mt-8 rounded-2xl border border-white/15 bg-gradient-to-r from-indigo-50/10 via-purple-50/10 to-pink-50/10 p-5 text-center shadow-lg">
                <p className="text-base font-semibold leading-relaxed text-white/90">
                  "Success is where preparation and opportunity meet."
                </p>
                <p className="mt-2 text-sm font-bold text-white/60">- Bobby Unser</p>
              </div>
            </div>

            {/* Motion preference helper (utility class usage) */}
            <p className="sr-only">
              Animations are reduced when system preferences request reduced motion.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
