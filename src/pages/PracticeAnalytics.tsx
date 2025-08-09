
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, TrendingUp, Target, BookOpen, Clock, BarChart3, Plus } from 'lucide-react';
import { usePractice } from '@/hooks/usePractice';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { PracticeInputModal } from '@/components/PracticeInputModal';
import { LoadingSkeleton } from '@/components/practice/LoadingSkeleton';
import { EnhancedTargetTracker } from '@/components/practice/EnhancedTargetTracker';
import { AddPracticeSessionModal } from '@/components/practice/AddPracticeSessionModal';
import { PracticeCelebration } from '@/components/practice/PracticeCelebration';

export default function PracticeAnalytics() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { sessions, chapters, targets, loading, analytics, addSession, addTarget } = usePractice();
  const [showInputModal, setShowInputModal] = useState(false);
  const [celebrationTrigger, setCelebrationTrigger] = useState<{
    type: 'session_added' | 'daily_goal' | 'streak' | 'target_complete';
    value: number;
    context?: any;
  } | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-lg text-muted-foreground">Please log in to view your practice analytics.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  const handleAddSession = async (sessionData: any) => {
    try {
      await addSession(sessionData);
      // Trigger celebration
      setCelebrationTrigger({
        type: 'session_added',
        value: sessionData.questions_solved,
        context: sessionData
      });
    } catch (error) {
      console.error('Failed to add session:', error);
    }
  };

  const handleAddTarget = async (targetData: any) => {
    try {
      await addTarget(targetData);
      setCelebrationTrigger({
        type: 'target_complete',
        value: 100,
        context: targetData
      });
    } catch (error) {
      console.error('Failed to add target:', error);
    }
  };

  const todayStats = {
    sessions: analytics.today.sessionsCount,
    questions: analytics.today.questionsTotal,
    time: Math.round(analytics.today.timeTotal / 60 * 10) / 10,
  };

  const weekStats = {
    sessions: analytics.week.sessionsCount,
    questions: analytics.week.questionsTotal,
    time: Math.round(analytics.week.timeTotal / 60 * 10) / 10,
  };

  const isDarkMode = theme === 'midnight' || theme === 'obsidian';

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    } p-4 sm:p-6`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Practice Analytics
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your progress, set targets, and stay accountable
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <AddPracticeSessionModal onAddSession={handleAddSession} chapters={chapters} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className={`transition-all duration-200 hover:shadow-lg ${
            isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="text-xl font-semibold">{todayStats.sessions} sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`transition-all duration-200 hover:shadow-lg ${
            isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Questions Today</p>
                  <p className="text-xl font-semibold">{todayStats.questions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`transition-all duration-200 hover:shadow-lg ${
            isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hours Today</p>
                  <p className="text-xl font-semibold">{todayStats.time}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`transition-all duration-200 hover:shadow-lg ${
            isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-xl font-semibold">{weekStats.questions} questions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Target Tracker */}
        <Card className={`transition-all duration-200 ${
          isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 backdrop-blur-sm'
        }`}>
          <CardContent className="p-6">
            <EnhancedTargetTracker 
              targets={targets} 
              onAddTarget={handleAddTarget}
              sessions={sessions}
            />
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="chapters" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Chapters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Subject Analytics */}
            <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 backdrop-blur-sm'}`}>
              <CardHeader>
                <CardTitle>Subject Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {analytics.subjects.map((subject) => (
                    <div key={subject.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{subject.name}</span>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{subject.questions} questions</span>
                          <span>{Math.round(subject.time / 60 * 10) / 10}h</span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300"
                          style={{ 
                            width: `${Math.min((subject.questions / Math.max(...analytics.subjects.map(s => s.questions))) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 backdrop-blur-sm'}`}>
              <CardHeader>
                <CardTitle>Recent Practice Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No practice sessions yet</p>
                    <AddPracticeSessionModal onAddSession={handleAddSession} chapters={chapters} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.slice(0, 10).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{session.subject}</Badge>
                          <div>
                            <p className="font-medium">{session.chapter}</p>
                            <p className="text-sm text-muted-foreground">
                              {session.questions_solved} questions • {session.time_spent} mins
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chapters" className="space-y-6">
            <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 backdrop-blur-sm'}`}>
              <CardHeader>
                <CardTitle>Chapter Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {chapters.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No chapters tracked yet</p>
                    <p className="text-sm text-muted-foreground">Start practicing to see chapter progress!</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {chapters.map((chapter) => (
                      <Card key={chapter.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">{chapter.subject}</Badge>
                              <h3 className="font-medium">{chapter.chapter_name}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {chapter.total_questions} questions • {Math.round(chapter.total_time / 60 * 10) / 10}h practiced
                            </p>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            {chapter.last_practiced && `Last: ${new Date(chapter.last_practiced).toLocaleDateString()}`}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Celebration Component */}
      {celebrationTrigger && (
        <PracticeCelebration 
          trigger={celebrationTrigger}
          onComplete={() => setCelebrationTrigger(null)}
        />
      )}

      {/* Legacy Modal */}
      <PracticeInputModal open={showInputModal} onOpenChange={setShowInputModal} />
    </div>
  );
}
