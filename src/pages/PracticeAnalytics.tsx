
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
  Settings,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeSelector } from '@/components/ThemeSelector';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { PracticeLoadingSkeleton } from '@/components/PracticeLoadingSkeleton';
import { TargetTracker } from '@/components/TargetTracker';
import { ChapterTracker } from '@/components/ChapterTracker';
import { SubjectAnalytics } from '@/components/SubjectAnalytics';
import { PracticeAnalyticsDashboard } from '@/components/PracticeAnalyticsDashboard';
import { usePractice } from '@/hooks/usePractice';
import { Celebration } from '@/components/Celebration';
import { AddPracticeSessionModal } from '@/components/AddPracticeSessionModal';
import { PracticeSessionsList } from '@/components/PracticeSessionsList';
import { TargetManagementModal } from '@/components/TargetManagementModal';

export const PracticeAnalytics = () => {
  const { sessions, loading, analytics } = usePractice();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const [activeTab, setActiveTab] = useState('overview');
  const [showInputModal, setShowInputModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
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
          <div className="space-y-8">
            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className={`${themeColors.card} ${themeColors.glow} shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 border-l-indigo-500`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg`}>
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {analytics.today.questionsTotal}
                      </p>
                      <p className="text-sm font-medium text-muted-foreground">Today's Questions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${themeColors.card} ${themeColors.glow} shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 border-l-green-500`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg`}>
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {analytics.today.timeTotal}m
                      </p>
                      <p className="text-sm font-medium text-muted-foreground">Today's Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${themeColors.card} ${themeColors.glow} shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 border-l-purple-500`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg`}>
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {analytics.week.questionsTotal}
                      </p>
                      <p className="text-sm font-medium text-muted-foreground">Week Questions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${themeColors.card} ${themeColors.glow} shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 border-l-orange-500`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg`}>
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        {analytics.today.sessionsCount}
                      </p>
                      <p className="text-sm font-medium text-muted-foreground">Today's Sessions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <TargetTracker onTargetComplete={handleSessionComplete} />
              </div>
              <div>
                <ChapterTracker />
              </div>
            </div>

            <SubjectAnalytics />
          </div>
        );

      case 'sessions':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Practice Sessions
                </h2>
                <p className="text-muted-foreground mt-2">View and manage all your practice sessions</p>
              </div>
              <Button 
                onClick={() => setShowInputModal(true)}
                className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
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
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Practice Targets
                </h2>
                <p className="text-muted-foreground mt-2">Set and manage your practice goals</p>
              </div>
              <Button 
                onClick={() => setShowTargetModal(true)}
                className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Targets
              </Button>
            </div>
            <TargetTracker detailed onTargetComplete={handleSessionComplete} />
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Advanced Analytics
              </h2>
              <p className="text-muted-foreground mt-2">Deep insights into your practice patterns and performance</p>
            </div>
            <PracticeAnalyticsDashboard />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${themeColors.background} transition-colors duration-300`}>
      {/* Enhanced Header */}
      <div className={`${themeColors.card} shadow-lg border-b-2 transition-colors duration-300 ${
        theme === 'midnight' || theme === 'obsidian' 
          ? 'border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' 
          : 'border-gray-200 bg-gradient-to-r from-white via-gray-50 to-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className={`flex items-center space-x-2 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-200 px-4 py-2 rounded-lg`}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Back to Planner</span>
              </Button>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Practice Analytics
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Track your practice progress and insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeSelector />
              <Button 
                onClick={() => setShowInputModal(true)}
                className={`hidden sm:flex bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Tabs */}
      <div className={`${themeColors.card} shadow-md border-b lg:hidden overflow-x-auto`}>
        <div className="flex min-w-max">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center space-x-3 px-8 py-4 whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? `${themeColors.text} border-b-3 border-indigo-500 bg-gradient-to-t from-indigo-50 to-transparent dark:from-indigo-900/20`
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Enhanced Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <Card className={`${themeColors.card} ${themeColors.glow} shadow-xl sticky top-8`}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                    <BarChart className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg">Navigation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-4 px-6 py-4 text-left transition-all duration-300 hover:scale-[1.02] rounded-lg mx-2 ${
                          activeTab === tab.id
                            ? `${themeColors.text} bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border-l-4 border-indigo-500 shadow-md`
                            : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:text-gray-400 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          activeTab === tab.id 
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white' 
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
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

      {/* Enhanced Floating Add Button for Mobile */}
      <Button
        onClick={() => setShowInputModal(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl lg:hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-110 transition-all duration-300 z-40`}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddPracticeSessionModal
        open={showInputModal}
        onClose={() => setShowInputModal(false)}
        onSessionComplete={handleSessionComplete}
      />

      <TargetManagementModal
        open={showTargetModal}
        onOpenChange={setShowTargetModal}
        onTargetComplete={handleSessionComplete}
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
