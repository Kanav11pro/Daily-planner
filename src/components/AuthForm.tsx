import { useEffect, useMemo, useState } from 'react';
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

  // Existing hooks (unchanged functionality)
  const { signUp, signIn } = useAuth();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  // Local appearance toggle (doesn't change global app behavior)
  const [appearance, setAppearance] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setAppearance(e.matches ? 'dark' : 'light');
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  const isLight = appearance === 'light';

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

  // Features (visual only)
  const features = [
    { icon: Calendar, title: 'Smart Scheduling', desc: 'Plan daily study sessions', color: 'from-blue-500 to-cyan-500' },
    { icon: Target, title: 'Task Management', desc: 'Track study goals', color: 'from-purple-500 to-pink-500' },
    { icon: BarChart3, title: 'Progress Analytics', desc: 'Monitor performance', color: 'from-green-500 to-emerald-500' },
    { icon: Trophy, title: 'Achievement System', desc: 'Celebrate progress', color: 'from-yellow-500 to-orange-500' },
    { icon: Clock, title: 'Time Tracking', desc: 'Optimize study duration', color: 'from-red-500 to-pink-500' },
    { icon: PenTool, title: 'Subject Organization', desc: 'Organize by chapters', color: 'from-indigo-500 to-purple-500' },
  ];

  // Theme-aware tokens
  const bgBase = isLight ? 'bg-white' : 'bg-slate-950';
  const textBase = isLight ? 'text-slate-900' : 'text-white';
  const subText = isLight ? 'text-slate-600' : 'text-white/80';
  const cardBg = isLight ? 'bg-white' : 'bg-slate-900';
  const cardBorder = isLight ? 'border-slate-200' : 'border-slate-800';
  const fieldBg = isLight ? 'bg-white' : 'bg-slate-800';
  const fieldBorder = isLight ? 'border-slate-300' : 'border-slate-700';
  const placeholder = isLight ? 'placeholder:text-slate-500' : 'placeholder:text-white/50';
  const headingGradLight = 'from-slate-900 via-indigo-900 to-fuchsia-900';
  const headingGradDark = 'from-white via-indigo-100 to-fuchsia-200';

  return (
    // App-like sections with vertical scroll snap
    <div className={`relative h-screen overflow-y-auto snap-y snap-mandatory ${bgBase} ${textBase}`}>
      {/* Theme toggle (component-local) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-end p-4">
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-3 py-1 shadow-md shadow-black/10 backdrop-blur lg:mr-4"
             style={{ display: isLight ? 'flex' : 'none' }}>
          <span className="text-xs font-semibold text-slate-700">Light</span>
          <button
            onClick={() => setAppearance('dark')}
            className="rounded-full bg-slate-900 px-2 py-1 text-xs font-bold text-white hover:opacity-90"
          >
            Switch
          </button>
        </div>
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/90 px-3 py-1 shadow-md shadow-black/30 backdrop-blur lg:mr-4"
             style={{ display: !isLight ? 'flex' : 'none' }}>
          <span className="text-xs font-semibold text-white/90">Dark</span>
          <button
            onClick={() => setAppearance('light')}
            className="rounded-full bg-white px-2 py-1 text-xs font-bold text-slate-900 hover:opacity-90"
          >
            Switch
          </button>
        </div>
      </div>

      {/* Section 1: Splash */}
      <section className="relative min-h-screen snap-start overflow-hidden">
        {/* Bold gradient mesh by theme */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {isLight ? (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_20%_10%,rgba(99,102,241,0.25),transparent_60%),radial-gradient(50rem_30rem_at_80%_20%,rgba(168,85,247,0.25),transparent_60%),radial-gradient(70rem_40rem_at_50%_80%,rgba(236,72,153,0.25),transparent_60%)]" />
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-white/90" />
              <div className="absolute inset-0 opacity-[0.08] [background:linear-gradient(rgba(0,0,0,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.12)_1px,transparent_1px)] [background-size:42px_42px]" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_20%_10%,rgba(99,102,241,0.35),transparent_60%),radial-gradient(50rem_30rem_at_80%_20%,rgba(168,85,247,0.35),transparent_60%),radial-gradient(70rem_40rem_at_50%_80%,rgba(236,72,153,0.35),transparent_60%)]" />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/92 to-slate-950/96" />
              <div className="absolute inset-0 opacity-[0.07] [background:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:42px_42px]" />
            </>
          )}
        </div>

        {/* Floating study icons */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {studyIcons.map((Icon, i) => (
            <div
              key={i}
              className={isLight ? 'absolute text-slate-900/10' : 'absolute text-white/10'}
              style={{ left: `${12 + i * 14}%`, top: `${18 + (i % 3) * 22}%` }}
            >
              <Icon size={18 + i * 6} />
            </div>
          ))}
        </div>

        {/* Hero content */}
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center lg:px-10">
          <div className="mb-8 inline-flex items-center">
            <div className={`relative ${isLight ? 'shadow-xl shadow-slate-400/20 ring-1 ring-slate-900/5' : 'shadow-2xl shadow-black/40 ring-1 ring-white/10'}`}>
              <div className={`flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500`}>
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-red-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <h1
            className={`mb-4 bg-gradient-to-r ${isLight ? headingGradLight : headingGradDark} bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl`}
          >
            Exam Ace
          </h1>
          <p className={`mb-2 inline-flex items-center gap-2 ${subText}`}>
            <Shield className={isLight ? 'h-5 w-5 text-emerald-600' : 'h-5 w-5 text-emerald-300'} />
            <span className="text-lg font-semibold">Your Smart Study Companion</span>
          </p>
          <p className={`mx-auto mt-4 max-w-2xl text-lg ${subText}`}>
            Plan precisely, track progress, and stay motivated with analytics and achievements designed for exam excellence. 
          </p>

          {/* Visual feature chips */}
          <div className="mt-10 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <div
                key={i}
                className={`group rounded-2xl border p-4 transition-colors ${
                  isLight
                    ? 'border-slate-200 bg-white shadow-sm shadow-slate-900/5 hover:border-slate-300'
                    : 'border-white/10 bg-slate-900/40 backdrop-blur hover:border-white/20'
                }`}
              >
                <div className={`inline-flex rounded-xl bg-gradient-to-r ${color} p-2 text-white shadow ring-1 ring-white/10`}>
                  <Icon size={18} />
                </div>
                <div className="mt-3">
                  <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{title}</h3>
                  <p className={`mt-1 text-xs ${isLight ? 'text-slate-600' : 'text-white/70'}`}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <a href="#auth-section" className="inline-block rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-6 py-3 text-white shadow-md hover:from-indigo-700 hover:to-fuchsia-700">
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Section 2: Auth */}
      <section id="auth-section" className="relative min-h-screen snap-start">
        {/* Background subtle layer */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {isLight ? (
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-slate-50" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900" />
          )}
        </div>

        <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-12 lg:flex-row lg:items-stretch lg:gap-10 lg:px-10">
          {/* Left narrative block for large screens */}
          <aside className="hidden flex-1 items-center justify-center lg:flex">
            <div className={`w-full rounded-3xl border p-8 ${isLight ? 'border-slate-200 bg-white shadow-lg shadow-slate-900/5' : 'border-slate-800 bg-slate-900 shadow-2xl shadow-black/40'}`}>
              <h2 className={`text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Stay consistent, see results</h2>
              <p className={`mt-3 ${subText}`}>
                Use daily planning, time tracking, and achievements to make steady progress toward exam goals. 
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {features.slice(0, 4).map(({ icon: Icon, title }, i) => (
                  <div key={i} className={`flex items-center gap-3 rounded-2xl border p-3 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                    <div className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 p-2 text-white">
                      <Icon size={16} />
                    </div>
                    <span className={isLight ? 'text-slate-900' : 'text-white'}>{title}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Auth card */}
          <div className="flex w-full max-w-md flex-1 items-center justify-center">
            <div className={`relative w-full rounded-3xl border p-8 ${isLight ? 'border-slate-200 bg-white shadow-xl shadow-slate-900/5' : 'border-slate-800 bg-slate-900 shadow-2xl shadow-black/50'}`}>
              {/* Header */}
              <div className="mb-8 text-center">
                <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 ${isLight ? 'shadow-lg shadow-slate-900/10 ring-1 ring-slate-900/5' : 'shadow-xl shadow-black/40 ring-1 ring-black/20'}`}>
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <h3 className={`mb-2 text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {isSignUp ? 'Create your Exam Ace account' : 'Welcome to Exam Ace'}
                </h3>
                <p className={`text-sm ${subText}`}>
                  {isSignUp ? '🚀 Start the journey to exam success' : '🎯 Continue the path to excellence'}
                </p>
              </div>

              {/* Form (functionality untouched) */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignUp && (
                  <div>
                    <label htmlFor="full_name" className={`mb-2 block text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                      <span className="inline-flex items-center">
                        <Brain className={isLight ? 'mr-2 h-4 w-4 text-purple-600' : 'mr-2 h-4 w-4 text-purple-300'} />
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
                      className={`h-12 rounded-xl border-2 ${fieldBorder} ${fieldBg} ${placeholder} ${isLight ? 'text-slate-900' : 'text-white'} focus:border-indigo-400`}
                      aria-label="Full name"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className={`mb-2 block text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                    <span className="inline-flex items-center">
                      <Target className={isLight ? 'mr-2 h-4 w-4 text-indigo-600' : 'mr-2 h-4 w-4 text-blue-300'} />
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
                    className={`h-12 rounded-xl border-2 ${fieldBorder} ${fieldBg} ${placeholder} ${isLight ? 'text-slate-900' : 'text-white'} focus:border-indigo-400`}
                    aria-label="Email address"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className={`mb-2 block text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                    <span className="inline-flex items-center">
                      <Shield className={isLight ? 'mr-2 h-4 w-4 text-emerald-600' : 'mr-2 h-4 w-4 text-emerald-300'} />
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
                    className={`h-12 rounded-xl border-2 ${fieldBorder} ${fieldBg} ${placeholder} ${isLight ? 'text-slate-900' : 'text-white'} focus:border-indigo-400`}
                    aria-label="Password"
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="relative w-full rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 py-4 font-bold text-white shadow-lg transition-[transform,box-shadow] hover:from-indigo-700 hover:to-fuchsia-700 hover:shadow-xl active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-70"
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

              {/* Mode switch */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className={`${isLight ? 'text-indigo-700 hover:text-indigo-800' : 'text-indigo-300 hover:text-indigo-200'} text-base font-semibold transition-colors`}
                >
                  {isSignUp ? '✨ Already have an account? Sign in' : "🎯 Don't have an account? Join Exam Ace"}
                </button>
              </div>

              {/* Quote */}
              <div className={`mt-8 rounded-2xl border p-5 text-center ${isLight ? 'border-slate-200 bg-white shadow-sm shadow-slate-900/5' : 'border-slate-800 bg-slate-900 shadow-md shadow-black/30'}`}>
                <p className={`text-base font-semibold leading-relaxed ${isLight ? 'text-slate-900' : 'text-white/90'}`}>
                  "Success is where preparation and opportunity meet."
                </p>
                <p className={`mt-2 text-sm font-bold ${isLight ? 'text-slate-500' : 'text-white/60'}`}>- Bobby Unser</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
