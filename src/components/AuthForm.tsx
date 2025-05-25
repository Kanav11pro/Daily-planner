
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';

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
        toast.success('Signed in successfully!');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeColors.background} flex items-center justify-center p-4`}>
      <div className={`${themeColors.card} rounded-2xl shadow-xl p-8 w-full max-w-md`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${themeColors.text} mb-2`}>
            📚 Daily Study Planner
          </h1>
          <p className={`${themeColors.text} opacity-70`}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className={`block text-sm font-medium ${themeColors.text} mb-2`}>
                Full Name
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>
          )}
          
          <div>
            <label className={`block text-sm font-medium ${themeColors.text} mb-2`}>
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeColors.text} mb-2`}>
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r ${themeColors.primary} hover:opacity-90 transition-all duration-300`}
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className={`text-sm ${themeColors.text} opacity-70 hover:opacity-100 transition-opacity`}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};
