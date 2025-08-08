
import { useState } from 'react';
import { Plus, TrendingUp, Target, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { usePractice } from '@/hooks/usePractice';
import { useTheme } from '@/contexts/ThemeContext';
import { AuthForm } from '@/components/AuthForm';
import { PracticeInputModal } from '@/components/PracticeInputModal';
import { PracticeCalendar } from '@/components/PracticeCalendar';
import { SubjectAnalytics } from '@/components/SubjectAnalytics';
import { ChapterTracker } from '@/components/ChapterTracker';
import { TargetTracker } from '@/components/TargetTracker';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { PracticeCelebration } from '@/components/PracticeCelebration';

export default function PracticeAnalytics() {
  const { user } = useAuth();
  const { analytics, loading } = usePractice();
  const { theme } = useTheme();
  const [showInputModal, setShowInputModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  if (!user) {
    return <AuthForm />;
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  const handleSessionAdded = () => {
    setShowInputModal(false);
    setShowCelebration(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, hsl(var(--primary)) 0%, transparent 50%),
                           radial-gradient(circle at 40% 80%, hsl(var(--primary)) 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-fade-in">
              JEE Practice Analytics
            </h1>
            <p className="text-muted-foreground text-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Track your daily question practice and analyze your preparation journey
            </p>
          </div>
          <Button 
            onClick={() => setShowInputModal(true)} 
            className="gap-2 px-6 py-3 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 animate-fade-in hover:scale-105 shadow-lg hover:shadow-primary/25"
            style={{ animationDelay: '0.2s' }}
          >
            <Plus className="h-5 w-5" />
            Add Practice Session
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "Today's Questions",
              value: analytics.today.questionsTotal,
              subtitle: `${analytics.today.sessionsCount} session${analytics.today.sessionsCount !== 1 ? 's' : ''}`,
              icon: TrendingUp,
              gradient: "from-blue-500 to-cyan-500",
              delay: '0.1s'
            },
            {
              title: "Today's Time",
              value: `${Math.floor(analytics.today.timeTotal / 60)}h ${analytics.today.timeTotal % 60}m`,
              subtitle: `Avg: ${analytics.today.sessionsCount > 0 ? Math.round(analytics.today.timeTotal / analytics.today.sessionsCount) : 0}min/session`,
              icon: Target,
              gradient: "from-emerald-500 to-teal-500",
              delay: '0.2s'
            },
            {
              title: "This Week",
              value: analytics.week.questionsTotal,
              subtitle: `${analytics.week.sessionsCount} total sessions`,
              icon: Calendar,
              gradient: "from-purple-500 to-indigo-500",
              delay: '0.3s'
            },
            {
              title: "Weekly Average",
              value: Math.round(analytics.week.questionsTotal / 7),
              subtitle: "questions/day",
              icon: BarChart3,
              gradient: "from-orange-500 to-red-500",
              delay: '0.4s'
            }
          ].map((stat, index) => (
            <Card 
              key={stat.title}
              className="border-2 hover:border-primary/20 transition-all duration-300 animate-fade-in hover:scale-105 hover:shadow-lg group"
              style={{ animationDelay: stat.delay }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full bg-gradient-to-r ${stat.gradient} text-white shadow-lg`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                  {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Analytics Tabs */}
        <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 p-1 bg-muted/50 backdrop-blur-sm">
              {[
                { value: "overview", label: "Overview" },
                { value: "subjects", label: "Subjects" },
                { value: "chapters", label: "Chapters" },
                { value: "calendar", label: "Calendar" },
                { value: "targets", label: "Targets" }
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200 hover:scale-105"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <SubjectAnalytics />
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <TargetTracker />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subjects" className="animate-fade-in">
              <SubjectAnalytics detailed />
            </TabsContent>

            <TabsContent value="chapters" className="animate-fade-in">
              <ChapterTracker />
            </TabsContent>

            <TabsContent value="calendar" className="animate-fade-in">
              <PracticeCalendar />
            </TabsContent>

            <TabsContent value="targets" className="animate-fade-in">
              <TargetTracker detailed />
            </TabsContent>
          </Tabs>
        </div>

        {/* Practice Input Modal */}
        <PracticeInputModal
          open={showInputModal}
          onOpenChange={setShowInputModal}
        />

        {/* Celebration */}
        <PracticeCelebration
          show={showCelebration}
          onComplete={() => setShowCelebration(false)}
        />
      </div>
    </div>
  );
}
