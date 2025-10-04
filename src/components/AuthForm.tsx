import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { BookOpen, Brain, Target, Clock, Zap, Award, CheckCircle2, TrendingUp, Users, Calendar, Coffee, Flame } from 'lucide-react';

export const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast.success('Account created! Check your email to verify 📧');
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Welcome back! Let\'s crush today\'s goals 💪');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // JEE-specific time management tips
  const timeTips = [
    { icon: Clock, title: "5:30 AM START", desc: "Top JEE rankers wake up early. Morning = Peak brain power!", color: "bg-yellow-300" },
    { icon: Zap, title: "25-MIN FOCUS", desc: "Pomodoro Technique: 25 min study + 5 min break = Productivity hack", color: "bg-cyan-300" },
    { icon: Coffee, title: "2-HOUR RULE", desc: "Study 2 hours max, then take a 15-min break. Your brain needs rest!", color: "bg-pink-300" },
    { icon: Target, title: "3 SUBJECTS/DAY", desc: "Rotate PCM daily. Don't stick to one subject = Better retention", color: "bg-lime-300" },
  ];

  // Productivity hacks for JEE students
  const productivityHacks = [
    { text: "📝 Write down 3 daily goals before bed", stat: "80% more likely to complete" },
    { text: "🧠 Active recall > Re-reading notes", stat: "3x better retention" },
    { text: "⏰ Study toughest topics between 8-11 AM", stat: "Peak concentration hours" },
    { text: "🎯 Mock tests every Sunday", stat: "Improves speed by 40%" },
  ];

  // Relatable JEE student struggles
  const relatableStats = [
    { value: "6-8", unit: "hrs", label: "Daily Study Time", icon: BookOpen, color: "bg-orange-400" },
    { value: "75K+", unit: "", label: "Students Use Planners", icon: Users, color: "bg-green-400" },
    { value: "2.5x", unit: "", label: "Better Results w/ Planning", icon: TrendingUp, color: "bg-purple-400" },
  ];

  // Loading state with neo-brutalism styling
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block border-4 border-black w-16 h-16 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-2xl font-black">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Neo-Brutalism Grid Background */}
      <div className="fixed inset-0 z-0" style={{
        backgroundImage: `
          linear-gradient(to right, black 1px, transparent 1px),
          linear-gradient(to bottom, black 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        opacity: '0.03'
      }}></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - JEE Content Rich Section */}
        <div className="lg:w-1/2 flex flex-col justify-center p-6 lg:p-12">
          <div className="max-w-2xl mx-auto lg:mx-0 space-y-8">
            
            {/* Hero Section */}
            <div className="mb-12">
              <div className="inline-block mb-6">
                <div className="bg-yellow-300 border-4 border-black px-6 py-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
                  <h1 className="text-5xl lg:text-7xl font-black text-black">EXAM ACE</h1>
                </div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black mb-4 text-black leading-tight">
                THE DAILY PLANNER BUILT FOR JEE WARRIORS 🎯
              </h2>
              <p className="text-xl font-bold text-black/70">
                Stop planning like everyone else. Start planning like a JEE topper.
              </p>
            </div>

            {/* Relatable Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {relatableStats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`${stat.color} border-4 border-black p-4 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
                  style={{ transform: `rotate(${idx === 1 ? '0deg' : idx === 0 ? '-2deg' : '2deg'})` }}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-3xl font-black mb-1">{stat.value}</div>
                  <div className="text-xs font-bold uppercase">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Motivational Quote */}
            <div className="bg-pink-300 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform rotate-1 mb-8">
              <div className="flex items-start gap-3">
                <Flame className="w-8 h-8 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg font-black mb-2 leading-tight">
                    "You don't need to study 18 hours. You need to study SMART."
                  </p>
                  <p className="text-sm font-bold text-black/70">- Every JEE Topper Ever</p>
                </div>
              </div>
            </div>

            {/* Time Management Tips Grid */}
            <div className="mb-8">
              <h3 className="text-2xl font-black mb-5 text-black uppercase">
                TIME HACKS FROM TOPPERS ⏰
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {timeTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className={`${tip.color} border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="bg-white border-3 border-black p-2">
                        <tip.icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-black text-sm leading-tight">{tip.title}</h4>
                    </div>
                    <p className="text-sm font-bold text-black/80 leading-snug">{tip.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Productivity Hacks */}
            <div className="bg-lime-300 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black mb-4 uppercase flex items-center gap-2">
                <Zap className="w-6 h-6" /> Productivity Secrets
              </h3>
              <div className="space-y-3">
                {productivityHacks.map((hack, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold text-sm leading-tight">{hack.text}</p>
                      <p className="text-xs font-black text-black/60">{hack.stat}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why This Works Section */}
            <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
              <h3 className="text-xl font-black mb-3 uppercase">Why Daily Planning = JEE Success</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-black">→</span>
                  <span className="font-bold text-sm">Track all 3 subjects daily (PCM rotation prevents burnout)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black">→</span>
                  <span className="font-bold text-sm">Set chapter-wise goals (not just "study physics")</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black">→</span>
                  <span className="font-bold text-sm">Analyze weak topics with built-in analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black">→</span>
                  <span className="font-bold text-sm">Stay consistent with streaks & achievements</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Right Side - Auth Form with Neo-Brutalism */}
        <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 sm:p-10 w-full max-w-md">
            
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="inline-block bg-purple-400 border-4 border-black p-4 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <BookOpen className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black mb-2 uppercase">
                {isSignUp ? 'Start Planning' : 'Welcome Back'}
              </h2>
              <p className="text-base font-bold text-black/70">
                {isSignUp ? 'Join 75,000+ JEE students crushing their goals' : 'Continue your winning streak'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-black mb-2 uppercase">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="border-4 border-black focus:border-purple-500 h-14 text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-black mb-2 uppercase">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="border-4 border-black focus:border-blue-500 h-14 text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-black mb-2 uppercase">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  minLength={6}
                  className="border-4 border-black focus:border-green-500 h-14 text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-black py-6 text-lg uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="border-4 border-black border-t-transparent rounded-full w-5 h-5 animate-spin"></div>
                    LOADING...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    {isSignUp ? '🚀 START MY JOURNEY' : '⚡ LET\'S GO'}
                  </div>
                )}
              </Button>
            </form>

            {/* Toggle Auth Mode */}
            <div className="mt-8 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-base font-black hover:underline transition-all"
              >
                {isSignUp ? '← Already have an account?' : '→ Need an account?'}
              </button>
            </div>

            {/* Quick Tip */}
            <div className="mt-8 bg-cyan-200 border-4 border-black p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-sm font-black uppercase mb-1">💡 Pro Tip</p>
              <p className="text-xs font-bold leading-tight">
                Plan your tasks the night before. You'll wake up with purpose, not panic!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white py-3 px-4 border-t-4 border-black z-20">
        <div className="container mx-auto flex items-center justify-center gap-4 flex-wrap text-center">
          <span className="font-black text-sm">⚡ SMART PLANNING</span>
          <span className="hidden sm:inline">•</span>
          <span className="font-black text-sm">📊 REAL ANALYTICS</span>
          <span className="hidden sm:inline">•</span>
          <span className="font-black text-sm">🏆 TRACK PROGRESS</span>
          <span className="hidden sm:inline">•</span>
          <span className="font-black text-sm">🎯 ACHIEVE MORE</span>
        </div>
      </div>
    </div>
  );
};
