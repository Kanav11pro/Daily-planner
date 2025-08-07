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

export default function PracticeAnalytics() {
  const { user } = useAuth();
  const { analytics, loading } = usePractice();
  const { theme } = useTheme();
  const [showInputModal, setShowInputModal] = useState(false);

  if (!user) {
    return <AuthForm />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your practice data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              JEE Practice Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your daily question practice and analyze your preparation
            </p>
          </div>
          <Button onClick={() => setShowInputModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Practice Session
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Questions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{analytics.today.questionsTotal}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.today.sessionsCount} session{analytics.today.sessionsCount !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Time</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {Math.floor(analytics.today.timeTotal / 60)}h {analytics.today.timeTotal % 60}m
              </div>
              <p className="text-xs text-muted-foreground">
                Avg: {analytics.today.sessionsCount > 0 ? Math.round(analytics.today.timeTotal / analytics.today.sessionsCount) : 0}min/session
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{analytics.week.questionsTotal}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.week.sessionsCount} total sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {Math.round(analytics.week.questionsTotal / 7)}
              </div>
              <p className="text-xs text-muted-foreground">questions/day</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="chapters">Chapters</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="targets">Targets</TabsTrigger>
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

        {/* Practice Input Modal */}
        <PracticeInputModal
          open={showInputModal}
          onOpenChange={setShowInputModal}
        />
      </div>
    </div>
  );
}