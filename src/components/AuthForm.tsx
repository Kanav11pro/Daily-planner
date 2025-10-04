import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { BookOpen, Brain, Target, Clock, Zap, Award, CheckCircle2, TrendingUp, Users, Calendar, Coffee, Flame, AlertTriangle, Smartphone, Gamepad2, Tv, ArrowRight } from 'lucide-react';

// Time Waste Calculator Component
const TimeWasteCalculator = () => {
  const [socialMedia, setSocialMedia] = useState(0);
  const [gaming, setGaming] = useState(0);
  const [youtube, setYoutube] = useState(0);
  const [netflix, setNetflix] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateWaste = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setShowResults(true);
      setIsCalculating(false);
    }, 800);
  };

  const totalDaily = socialMedia + gaming + youtube + netflix;
  const totalWeekly = totalDaily * 7;
  const totalMonthly = totalDaily * 30;

  // Real JEE-specific calculations
  const physicsChapters = Math.floor(totalWeekly / 3); // 3 hrs per chapter
  const chemistryProblems = Math.floor(totalWeekly / 0.25); // 15 min per problem set
  const mathsProblems = Math.floor(totalWeekly / 0.5); // 30 min per problem set
  const mockTests = Math.floor(totalWeekly / 3); // 3 hrs per full mock
  const revisionSessions = Math.floor(totalWeekly / 2); // 2 hrs per revision

  const reset = () => {
    setSocialMedia(0);
    setGaming(0);
    setYoutube(0);
    setNetflix(0);
    setShowResults(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-20">
      <div className="bg-red-300 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-black text-white px-6 py-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,0,0,1)] transform -rotate-2 mb-4">
            <h3 className="text-3xl font-black uppercase flex items-center gap-3 justify-center">
              <AlertTriangle className="w-8 h-8" />
              TIME WASTE CALCULATOR
            </h3>
          </div>
          <p className="text-lg font-bold text-black/80">
            Reality Check: See how much JEE prep time you're actually losing! 😱
          </p>
          <p className="text-sm font-black text-black/60 mt-2">
            (Based on real data: Average Indian student wastes 3-7 hours daily on screens)
          </p>
        </div>

        {/* Input Section */}
        {!showResults ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Social Media */}
              <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3 mb-3">
                  <Smartphone className="w-6 h-6" />
                  <label className="font-black text-sm uppercase">Instagram/WhatsApp/Snapchat</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.5"
                    value={socialMedia}
                    onChange={(e) => setSocialMedia(parseFloat(e.target.value))}
                    className="flex-1 h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <span className="font-black text-2xl w-16 text-right">{socialMedia}h</span>
                </div>
                <p className="text-xs font-bold text-black/60 mt-2">Avg Indian youth: 3.2 hrs/day</p>
              </div>

              {/* Gaming */}
              <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3 mb-3">
                  <Gamepad2 className="w-6 h-6" />
                  <label className="font-black text-sm uppercase">Gaming (BGMI/Free Fire/etc)</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="6"
                    step="0.5"
                    value={gaming}
                    onChange={(e) => setGaming(parseFloat(e.target.value))}
                    className="flex-1 h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <span className="font-black text-2xl w-16 text-right">{gaming}h</span>
                </div>
                <p className="text-xs font-bold text-black/60 mt-2">Avg Indian youth: 46 mins/day</p>
              </div>

              {/* YouTube */}
              <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3 mb-3">
                  <Tv className="w-6 h-6" />
                  <label className="font-black text-sm uppercase">YouTube (Non-study)</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={youtube}
                    onChange={(e) => setYoutube(parseFloat(e.target.value))}
                    className="flex-1 h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <span className="font-black text-2xl w-16 text-right">{youtube}h</span>
                </div>
                <p className="text-xs font-bold text-black/60 mt-2">Entertainment/timepass videos only</p>
              </div>

              {/* Netflix/OTT */}
              <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3 mb-3">
                  <Tv className="w-6 h-6" />
                  <label className="font-black text-sm uppercase">Netflix/Prime/Hotstar</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.5"
                    value={netflix}
                    onChange={(e) => setNetflix(parseFloat(e.target.value))}
                    className="flex-1 h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <span className="font-black text-2xl w-16 text-right">{netflix}h</span>
                </div>
                <p className="text-xs font-bold text-black/60 mt-2">Avg Indian youth: 44 mins/day</p>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="text-center">
              <Button
                onClick={calculateWaste}
                disabled={totalDaily === 0 || isCalculating}
                className="bg-yellow-300 hover:bg-yellow-400 text-black font-black py-6 px-12 text-xl uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCalculating ? (
                  <div className="flex items-center gap-3">
                    <div className="border-4 border-black border-t-transparent rounded-full w-6 h-6 animate-spin"></div>
                    CALCULATING...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    💥 SEE THE DAMAGE
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-6 animate-fade-in">
            {/* Shock Header */}
            <div className="bg-black text-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,0,1)] transform rotate-1">
              <h4 className="text-3xl font-black text-center mb-2">😱 WAKE UP CALL!</h4>
              <p className="text-center text-xl font-bold">You're wasting <span className="text-yellow-300 text-3xl">{totalDaily} hours</span> EVERY DAY!</p>
            </div>

            {/* Time Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-orange-300 border-4 border-black p-5 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <div className="text-4xl font-black mb-1">{totalWeekly}h</div>
                <div className="text-sm font-black uppercase">Lost Per Week</div>
              </div>
              <div className="bg-pink-300 border-4 border-black p-5 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Calendar className="w-8 h-8 mx-auto mb-2" />
                <div className="text-4xl font-black mb-1">{totalMonthly}h</div>
                <div className="text-sm font-black uppercase">Lost Per Month</div>
              </div>
              <div className="bg-purple-300 border-4 border-black p-5 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                <div className="text-4xl font-black mb-1">{Math.floor(totalMonthly / 24)}</div>
                <div className="text-sm font-black uppercase">Full Days Lost</div>
              </div>
            </div>

            {/* What You're Missing */}
            <div className="bg-yellow-300 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h4 className="text-2xl font-black mb-4 uppercase text-center">
                🔥 What You Could've Done Instead:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border-3 border-black p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-400 border-2 border-black p-2">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="font-black text-lg">{physicsChapters} Physics Chapters</span>
                  </div>
                  <p className="text-xs font-bold text-black/70">3 hours per chapter completion</p>
                </div>
                <div className="bg-white border-3 border-black p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-400 border-2 border-black p-2">
                      <Brain className="w-5 h-5" />
                    </div>
                    <span className="font-black text-lg">{chemistryProblems} Chem Problem Sets</span>
                  </div>
                  <p className="text-xs font-bold text-black/70">15 mins per organic/inorganic set</p>
                </div>
                <div className="bg-white border-3 border-black p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-purple-400 border-2 border-black p-2">
                      <Target className="w-5 h-5" />
                    </div>
                    <span className="font-black text-lg">{mathsProblems} Math Problem Sets</span>
                  </div>
                  <p className="text-xs font-bold text-black/70">30 mins per calculus/algebra set</p>
                </div>
                <div className="bg-white border-3 border-black p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-red-400 border-2 border-black p-2">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="font-black text-lg">{mockTests} Full Mock Tests</span>
                  </div>
                  <p className="text-xs font-bold text-black/70">3 hours per complete JEE mock</p>
                </div>
              </div>
            </div>

            {/* Harsh Reality */}
            <div className="bg-red-500 text-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
              <h4 className="text-2xl font-black mb-3 uppercase text-center">⚠️ THE HARSH TRUTH</h4>
              <div className="space-y-2 text-center">
                <p className="text-lg font-bold">
                  While you scroll, your competitors are solving {Math.floor(totalWeekly * 4)} more problems/month
                </p>
                <p className="text-base font-bold opacity-90">
                  That's {revisionSessions} extra revision sessions per week you're missing!
                </p>
                <p className="text-sm font-black opacity-80 mt-4">
                  "I'll study tomorrow" = Recipe for disaster. Start NOW!
                </p>
              </div>
            </div>

            {/* Action Steps */}
            <div className="bg-cyan-300 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h4 className="text-xl font-black mb-4 uppercase">💪 WHAT TO DO NOW:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-black text-xl">→</span>
                  <span className="font-bold text-sm">Delete 1-2 social media apps. Just for JEE prep months.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black text-xl">→</span>
                  <span className="font-bold text-sm">Set 30-min daily limits on remaining apps (use Screen Time)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black text-xl">→</span>
                  <span className="font-bold text-sm">Replace 2 hours of scrolling with 2 hours of PCM practice TODAY</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black text-xl">→</span>
                  <span className="font-bold text-sm">Use Exam Ace to plan those {totalDaily} hours properly every day</span>
                </li>
              </ul>
            </div>

            {/* Reset Button */}
            <div className="text-center">
              <Button
                onClick={reset}
                className="bg-white hover:bg-gray-100 text-black font-black py-4 px-8 text-base uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200"
              >
                ↻ CALCULATE AGAIN
              </Button>
            </div>
          </div>
        )}

        {/* Source Note */}
        <div className="mt-8 text-center">
          <p className="text-xs font-bold text-black/60">
            📊 Data sources: IIM Rohtak study (2023), EY India Digital Report (2024), Statista India (2024)
          </p>
        </div>
      </div>
    </div>
  );
};

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

      {/* TIME WASTE CALCULATOR - Added before footer */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <TimeWasteCalculator />
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
