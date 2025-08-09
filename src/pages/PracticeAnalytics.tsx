
import { useState } from 'react';
import { Plus, TrendingUp, Target, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { usePractice } from '@/hooks/usePractice';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { AuthForm } from '@/components/AuthForm';
import { PracticeInputModal } from '@/components/PracticeInputModal';
import { PracticeCalendar } from '@/components/PracticeCalendar';
import { SubjectAnalytics } from '@/components/SubjectAnalytics';
import { ChapterTracker } from '@/components/ChapterTracker';
import { TargetTracker } from '@/components/TargetTracker';
import { Header } from '@/components/Header';
import { PracticeLoadingSkeleton } from '@/components/PracticeLoadingSkeleton';

export default function PracticeAnalytics() {
  const { user } = useAuth();
  const { analytics, loading } = usePractice();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const [showInputModal, setShowInputModal] = useState(false);

  if (!user) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${themeColors.background}`}>
        <div className="flex items-center justify-center min-h-screen">
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeColors.background}`}>
      {/* Use the same header as main site but with practice analytics specific button */}
      <Header onAddTask={() => setShowInputModal(true)} />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <PracticeLoadingSkeleton />
        ) : (
          <>
            {/* Enhanced Header with gradient text and animations */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="space-y-2">
                <h1 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent animate-fade-in`}>
                  JEE Practice Analytics
                </h1>
                <p className={`${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-300' : 'text-gray-600'} text-sm md:text-base animate-fade-in`}>
                  Track your daily question practice and analyze your preparation journey
                </p>
              </div>
              <Button 
                onClick={() => setShowInputModal(true)} 
                className={`gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r ${themeColors.primary} text-white border-0`}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Practice Session</span>
                <span className="sm:hidden">Add Session</span>
              </Button>
            </div>

            {/* Enhanced Quick Stats with animations */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6 pt-3 md:pt-6">
                  <CardTitle className="text-xs md:text-sm font-medium">Today's Questions</CardTitle>
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                  <div className={`text-lg md:text-2xl font-bold bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                    {analytics.today.questionsTotal}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.today.sessionsCount} session{analytics.today.sessionsCount !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>

              <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in`} style={{animationDelay: '0.1s'}}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6 pt-3 md:pt-6">
                  <CardTitle className="text-xs md:text-sm font-medium">Today's Time</CardTitle>
                  <Target className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                  <div className={`text-lg md:text-2xl font-bold bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                    {Math.floor(analytics.today.timeTotal / 60)}h {analytics.today.timeTotal % 60}m
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Avg: {analytics.today.sessionsCount > 0 ? Math.round(analytics.today.timeTotal / analytics.today.sessionsCount) : 0}min/session
                  </p>
                </CardContent>
              </Card>

              <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in`} style={{animationDelay: '0.2s'}}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6 pt-3 md:pt-6">
                  <CardTitle className="text-xs md:text-sm font-medium">This Week</CardTitle>
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                  <div className={`text-lg md:text-2xl font-bold bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                    {analytics.week.questionsTotal}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.week.sessionsCount} total sessions
                  </p>
                </CardContent>
              </Card>

              <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in`} style={{animationDelay: '0.3s'}}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6 pt-3 md:pt-6">
                  <CardTitle className="text-xs md:text-sm font-medium">Weekly Average</CardTitle>
                  <BarChart3 className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                  <div className={`text-lg md:text-2xl font-bold bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}>
                    {Math.round(analytics.week.questionsTotal / 7)}
                  </div>
                  <p className="text-xs text-muted-foreground">questions/day</p>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Main Analytics Tabs with responsive design */}
            <Tabs defaultValue="overview" className="space-y-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <TabsList className={`grid w-full grid-cols-2 md:grid-cols-5 ${themeColors.card} ${themeColors.border} border`}>
                <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
                <TabsTrigger value="subjects" className="text-xs md:text-sm">Subjects</TabsTrigger>
                <TabsTrigger value="chapters" className="text-xs md:text-sm">Chapters</TabsTrigger>
                <TabsTrigger value="calendar" className="text-xs md:text-sm">Calendar</TabsTrigger>
                <TabsTrigger value="targets" className="text-xs md:text-sm">Targets</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <SubjectAnalytics />
                  <TargetTracker />
                </div>
              </TabsContent>

              <TabsContent value="subjects">
                <SubjectAnalytics detailed />
              </TabsContent>

              <TabsContent value="chapters">
                <ChapterTracker />
              </TabsContent>

              <TabsContent value="calendar">
                <PracticeCalendar />
              </TabsContent>

              <TabsContent value="targets">
                <TargetTracker detailed />
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Practice Input Modal */}
        <PracticeInputModal
          open={showInputModal}
          onOpenChange={setShowInputModal}
        />
      </div>
    </div>
  );
}
