
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface OnboardingStepProps {
  children: ReactNode;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  color: string;
  currentStep: number;
  totalSteps: number;
}

export const OnboardingStep = ({ 
  children, 
  icon: Icon, 
  title, 
  subtitle, 
  color, 
  currentStep, 
  totalSteps 
}: OnboardingStepProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-pink-500/15 to-violet-500/15 rounded-full blur-3xl animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/95 backdrop-blur-xl border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Exam Ace Setup 🚀
                </h1>
                <p className="text-sm text-gray-600">Let's personalize your study journey</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-full bg-gradient-to-r ${color} transition-all duration-500 ease-out rounded-full`}
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-indigo-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
              <Icon className="h-16 w-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            {subtitle && <p className="text-lg text-white/80">{subtitle}</p>}
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};
