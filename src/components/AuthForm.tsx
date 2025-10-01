import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { BookOpen, Brain, GraduationCap, Target, Trophy, Calendar, CheckCircle, BarChart3, Clock, PenTool, Award, Rocket, Lightbulb, Sparkles, TrendingUp, Shield, Mail, Lock, User } from 'lucide-react';
import authHero from '@/assets/auth-hero.png';
import authPattern from '@/assets/auth-pattern.png';
import authBrain from '@/assets/auth-brain.png';
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
  return <div className="min-h-screen relative overflow-hidden">
      {/* Modern Background with Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${authPattern})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Hero Showcase */}
        <div className="lg:w-1/2 flex flex-col justify-center p-6 sm:p-8 lg:p-16">
          <div className="animate-fade-in max-w-2xl mx-auto">
            {/* Logo and Title */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
                    <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-accent-foreground" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                    Exam Ace
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium mt-1">
                    Your Smart Study Companion
                  </p>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Master Your Exams with Confidence
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                The complete study planning platform designed for serious students. Track progress, 
                analyze performance, and achieve your academic goals.
              </p>
            </div>

            {/* Hero Image */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
              <img 
                src={authHero} 
                alt="Study Illustration" 
                className="relative rounded-3xl shadow-2xl w-full h-auto"
              />
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, text: "Goal Tracking", color: "from-primary to-primary/70" },
                { icon: BarChart3, text: "Analytics", color: "from-secondary to-secondary/70" },
                { icon: Calendar, text: "Smart Planning", color: "from-accent to-accent/70" },
                { icon: Trophy, text: "Achievements", color: "from-primary to-secondary" }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Modern Auth Card */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
              {/* Card Header with Brain Image */}
              <div className="relative h-32 bg-gradient-to-br from-primary via-primary/90 to-secondary overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
                <img 
                  src={authBrain} 
                  alt="Brain"
                  className="absolute right-4 bottom-0 w-24 h-24 object-contain opacity-80"
                />
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-2xl font-bold text-primary-foreground">
                    {isSignUp ? 'Join Exam Ace' : 'Welcome Back'}
                  </h2>
                  <p className="text-sm text-primary-foreground/80 mt-1">
                    {isSignUp ? 'Start your success story' : 'Continue your journey'}
                  </p>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {isSignUp && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <User className="h-4 w-4 text-primary" />
                        Full Name
                      </label>
                      <Input 
                        type="text" 
                        value={fullName} 
                        onChange={e => setFullName(e.target.value)} 
                        required 
                        placeholder="Enter your full name"
                        className="h-11 rounded-xl border-border/50 focus:border-primary"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Mail className="h-4 w-4 text-primary" />
                      Email Address
                    </label>
                    <Input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                      placeholder="your.email@example.com"
                      className="h-11 rounded-xl border-border/50 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Lock className="h-4 w-4 text-primary" />
                      Password
                    </label>
                    <Input 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                      placeholder="Enter your password" 
                      minLength={6}
                      className="h-11 rounded-xl border-border/50 focus:border-primary"
                    />
                    {isSignUp && (
                      <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mt-6"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        {isSignUp ? <Rocket className="h-5 w-5" /> : <Trophy className="h-5 w-5" />}
                        <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                      </div>
                    )}
                  </Button>
                </form>

                {/* Toggle Sign Up/Sign In */}
                <div className="mt-6 text-center">
                  <button 
                    onClick={() => setIsSignUp(!isSignUp)} 
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Join now"}
                  </button>
                </div>

                {/* Motivational Section */}
                <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground/90 italic leading-relaxed">
                        "Success is where preparation meets opportunity"
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">- Bobby Unser</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};