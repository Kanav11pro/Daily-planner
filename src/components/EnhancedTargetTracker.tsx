
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePractice } from '@/hooks/usePractice';
import { Target, TrendingUp, Calendar, Zap, Award, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface EnhancedTargetTrackerProps {
  detailed?: boolean;
}

export const EnhancedTargetTracker = ({ detailed = false }: EnhancedTargetTrackerProps) => {
  const { sessions, targets, analytics } = usePractice();
  const [streak, setStreak] = useState(0);
  const [motivationLevel, setMotivationLevel] = useState('high');

  // Calculate streak and motivation
  useEffect(() => {
    const today = new Date();
    let currentStreak = 0;
    
    // Calculate consecutive days with practice
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const dayHasPractice = sessions.some(s => s.date === dateStr && s.questions_solved > 0);
      
      if (dayHasPractice) {
        currentStreak++;
      } else if (i === 0) {
        // Today has no practice, streak is 0
        break;
      } else {
        // Found a gap in streak
        break;
      }
    }
    
    setStreak(currentStreak);
    
    // Determine motivation level based on recent activity
    const recentDays = 7;
    const recentSessions = sessions.filter(s => {
      const sessionDate = new Date(s.date);
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= recentDays;
    });
    
    const avgQuestionsPerDay = recentSessions.reduce((sum, s) => sum + s.questions_solved, 0) / recentDays;
    
    if (avgQuestionsPerDay >= 50) setMotivationLevel('high');
    else if (avgQuestionsPerDay >= 25) setMotivationLevel('medium');
    else setMotivationLevel('low');
  }, [sessions]);

  const dailyTarget = 50; // Default daily target
  const weeklyTarget = 350;
  
  const todayProgress = (analytics.today.questionsTotal / dailyTarget) * 100;
  const weeklyProgress = (analytics.week.questionsTotal / weeklyTarget) * 100;

  const getMotivationMessage = () => {
    if (streak >= 21) return "🔥 ON FIRE! You're building unstoppable momentum!";
    if (streak >= 14) return "💪 Two weeks strong! You're in the zone!";
    if (streak >= 7) return "⚡ One week streak! Keep the energy flowing!";
    if (streak >= 3) return "🌟 Great start! Consistency is your superpower!";
    if (streak >= 1) return "🚀 You're on track! Every session counts!";
    return "🎯 Ready to start your streak? Today is the perfect day!";
  };

  const getStreakBadge = () => {
    if (streak >= 21) return { color: "bg-red-500", label: "🔥 Legendary", glow: "shadow-red-500/50" };
    if (streak >= 14) return { color: "bg-orange-500", label: "💪 Champion", glow: "shadow-orange-500/50" };
    if (streak >= 7) return { color: "bg-yellow-500", label: "⚡ Warrior", glow: "shadow-yellow-500/50" };
    if (streak >= 3) return { color: "bg-blue-500", label: "🌟 Rising", glow: "shadow-blue-500/50" };
    if (streak >= 1) return { color: "bg-green-500", label: "🚀 Started", glow: "shadow-green-500/50" };
    return { color: "bg-gray-500", label: "🎯 Ready", glow: "" };
  };

  const streakBadge = getStreakBadge();

  return (
    <div className="space-y-6">
      {/* Streak & Motivation Card */}
      <Card className="border-2 bg-gradient-to-br from-card to-card/50 hover:border-primary/20 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${streakBadge.color} text-white shadow-lg ${streakBadge.glow}`}>
              <Zap className="h-5 w-5" />
            </div>
            Practice Streak Tracker
          </CardTitle>
          <CardDescription className="text-lg font-medium">
            {getMotivationMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div className={`px-4 py-2 rounded-full ${streakBadge.color} text-white shadow-lg ${streakBadge.glow} animate-pulse`}>
                {streakBadge.label}
              </div>
            </div>
            
            {streak > 0 && (
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-sm font-medium text-primary mb-2">🎖️ Achievement Unlocked!</div>
                <div className="text-xs text-muted-foreground">
                  You've been consistent for {streak} day{streak !== 1 ? 's' : ''}. 
                  {streak >= 7 && " You're in the habit zone!"}
                  {streak >= 21 && " You're officially a practice master!"}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Daily & Weekly Targets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 hover:border-primary/20 transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Daily Target
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">
                {analytics.today.questionsTotal}
              </span>
              <span className="text-sm text-muted-foreground">
                / {dailyTarget} questions
              </span>
            </div>
            <Progress value={Math.min(todayProgress, 100)} className="h-3" />
            
            {todayProgress >= 100 ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Target achieved! 🎉</span>
              </div>
            ) : todayProgress >= 80 ? (
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Almost there! Keep going! 💪</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  {Math.round((100 - todayProgress))}% remaining - You got this! 🚀
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/20 transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Weekly Target
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">
                {analytics.week.questionsTotal}
              </span>
              <span className="text-sm text-muted-foreground">
                / {weeklyTarget} questions
              </span>
            </div>
            <Progress value={Math.min(weeklyProgress, 100)} className="h-3" />
            
            <div className="text-sm text-muted-foreground">
              Daily average: {Math.round(analytics.week.questionsTotal / 7)} questions
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accountability Section */}
      {detailed && (
        <Card className="border-2 bg-gradient-to-br from-muted/50 to-background hover:border-primary/20 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Accountability Dashboard
            </CardTitle>
            <CardDescription>
              Track your commitment and stay motivated with these insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background rounded-lg border">
                <div className="text-2xl font-bold text-primary mb-1">
                  {Math.round((sessions.filter(s => s.questions_solved >= dailyTarget).length / sessions.length) * 100) || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Target Achievement Rate</div>
              </div>
              
              <div className="text-center p-4 bg-background rounded-lg border">
                <div className="text-2xl font-bold text-primary mb-1">
                  {analytics.week.sessionsCount}
                </div>
                <div className="text-sm text-muted-foreground">Sessions This Week</div>
              </div>
              
              <div className="text-center p-4 bg-background rounded-lg border">
                <div className="text-2xl font-bold text-primary mb-1">
                  {streak >= 7 ? "🔥" : streak >= 3 ? "⚡" : "🚀"}
                </div>
                <div className="text-sm text-muted-foreground">Current Momentum</div>
              </div>
            </div>

            {motivationLevel === 'low' && (
              <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Motivation Boost Needed!</span>
                </div>
                <p className="text-sm text-orange-700">
                  Your recent activity is below your usual pace. Remember: consistency beats intensity. 
                  Start with just 10 questions today to rebuild momentum! 💪
                </p>
              </div>
            )}

            {motivationLevel === 'high' && (
              <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Excellent Momentum! 🎉</span>
                </div>
                <p className="text-sm text-green-700">
                  You're crushing your targets! This consistent effort is exactly what JEE success looks like. 
                  Keep this energy going! 🔥
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
