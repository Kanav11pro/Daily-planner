import { useState } from 'react';
import {
  ArrowLeft,
  BarChart,
  Calendar,
  Clock,
  Plus,
  Target,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeSelector } from '@/components/ThemeSelector';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { PracticeLoadingSkeleton } from '@/components/PracticeLoadingSkeleton';
import { TargetTracker } from '@/components/TargetTracker';
import { ChapterTracker } from '@/components/ChapterTracker';
import { SubjectAnalytics } from '@/components/SubjectAnalytics';
import { WeeklyAnalytics } from '@/components/WeeklyAnalytics';
import { usePractice } from '@/hooks/usePractice';
import { Celebration } from '@/components/Celebration';
import { AddPracticeSessionModal } from '@/components/AddPracticeSessionModal';
import { PracticeSessionsList } from '@/components/PracticeSessionsList';

export const PracticeAnalytics = () => {
  const { sessions, loading, analytics } = usePractice();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const [activeTab, setActiveTab] = useState('overview');
  const [showInputModal, setShowInputModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSessionComplete = () => {
    console.log('Session completed, showing celebration');
    setShowCelebration(true);
  };

  const handleCelebrationComplete = () => {
    console.log('Celebration completed, hiding celebration');
    setShowCelebration(false);
  };

  if (loading) {
    return <PracticeLoadingSkeleton />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'targets', label: 'Targets', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${themeColors.accent}`}>
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{analytics.today.questionsTotal}</p>
                      <p className="text-sm text-muted-foreground">Today's Questions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${themeColors.accent}`}>
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{analytics.today.timeTotal}m</p>
                      <p className="text-sm text-muted-foreground">Today's Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${themeColors.accent}`}>
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{analytics.week.questionsTotal}</p>
                      <p className="text-sm text-muted-foreground">Week Questions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${themeColors.accent}`}>
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{analytics.today.sessionsCount}</p>
                      <p className="text-sm text-muted-foreground">Today's Sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TargetTracker onTargetComplete={handleSessionComplete} />
              <ChapterTracker />
            </div>

            <SubjectAnalytics />
          </div>
        );

      case 'sessions':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Practice Sessions</h2>
                <p className="text-muted-foreground">View and manage all your practice sessions</p>
              </div>
              <Button 
                onClick={() => setShowInputModal(true)}
                className={`bg-gradient-to-r ${themeColors.primary} hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Session
              </Button>
            </div>
            <PracticeSessionsList />
          </div>
        );

      case 'targets':
        return (
          <TargetTracker detailed onTargetComplete={handleSessionComplete} />
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <WeeklyAnalytics tasks={[]} onClose={() => {}} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SubjectAnalytics />
              <ChapterTracker />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${themeColors.background} transition-colors duration-300`}>
      {/* Header */}
      <div className={`${themeColors.card} shadow-sm border-b transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Planner</span>
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Practice Analytics
                </h1>
                <p className="text-sm text-muted-foreground">Track your practice progress and insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeSelector />
              <Button 
                onClick={() => setShowInputModal(true)}
                className={`hidden sm:flex bg-gradient-to-r ${themeColors.primary} hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className={`${themeColors.card} shadow-sm border-b lg:hidden`}>
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center space-x-2 px-6 py-3 whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? `${themeColors.text} border-b-2 border-indigo-500`
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <Card className={`${themeColors.card} shadow-lg sticky top-6`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 hover:scale-[1.02] ${
                          activeTab === tab.id
                            ? `${themeColors.text} border-r-2 border-indigo-500`
                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="animate-fade-in">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Add Button for Mobile */}
      <Button
        onClick={() => setShowInputModal(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl lg:hidden bg-gradient-to-r ${themeColors.primary} hover:opacity-90 hover:scale-110 transition-all duration-300`}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddPracticeSessionModal
        open={showInputModal}
        onClose={() => setShowInputModal(false)}
        onSessionComplete={handleSessionComplete}
      />

      {showCelebration && (
        <Celebration
          onComplete={handleCelebrationComplete}
        />
      )}
    </div>
  );
};

export default PracticeAnalytics;
