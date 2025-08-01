
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, Target, BookOpen, Clock, Lightbulb, Star, Award, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";

interface Task {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  priority: string;
  created_at: string;
  scheduled_date: string;
  duration?: number;
}

interface AICoachAnalyticsProps {
  tasks: Task[];
  onClose: () => void;
}

export const AICoachAnalytics = ({ tasks, onClose }: AICoachAnalyticsProps) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const [aiInsights, setAiInsights] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('weekly');

  // JEE-specific analysis
  const jeeSubjects = ['Physics', 'Chemistry', 'Mathematics', 'Maths'];
  const jeeChapters = {
    Physics: ['Mechanics', 'Thermodynamics', 'Waves', 'Optics', 'Modern Physics', 'Electromagnetism'],
    Chemistry: ['Organic', 'Inorganic', 'Physical Chemistry', 'Environmental', 'Coordination'],
    Mathematics: ['Calculus', 'Algebra', 'Coordinate Geometry', 'Trigonometry', 'Statistics', 'Probability'],
    Maths: ['Calculus', 'Algebra', 'Coordinate Geometry', 'Trigonometry', 'Statistics', 'Probability']
  };

  // Calculate comprehensive analytics
  const calculateAnalytics = (timeframe: 'weekly' | 'monthly') => {
    const days = timeframe === 'weekly' ? 7 : 30;
    const dateRange = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const periodTasks = tasks.filter(task => dateRange.includes(task.scheduled_date));
    const completed = periodTasks.filter(task => task.completed);
    
    return {
      total: periodTasks.length,
      completed: completed.length,
      completionRate: periodTasks.length > 0 ? Math.round((completed.length / periodTasks.length) * 100) : 0,
      studyTime: completed.reduce((sum, task) => sum + (task.duration || 0), 0),
      subjects: jeeSubjects.reduce((acc, subject) => {
        const subjectTasks = periodTasks.filter(task => 
          task.subject.toLowerCase().includes(subject.toLowerCase())
        );
        const subjectCompleted = subjectTasks.filter(task => task.completed);
        acc[subject] = {
          total: subjectTasks.length,
          completed: subjectCompleted.length,
          completion: subjectTasks.length > 0 ? Math.round((subjectCompleted.length / subjectTasks.length) * 100) : 0,
          studyTime: subjectCompleted.reduce((sum, task) => sum + (task.duration || 0), 0)
        };
        return acc;
      }, {} as Record<string, { total: number; completed: number; completion: number; studyTime: number }>)
    };
  };

  const weeklyData = calculateAnalytics('weekly');
  const monthlyData = calculateAnalytics('monthly');
  const currentData = activeTab === 'weekly' ? weeklyData : monthlyData;

  // Generate AI insights
  const generateAIInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-coach-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weeklyData,
          monthlyData,
          tasks: tasks.slice(-50) // Send recent tasks for context
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiInsights(data.insights);
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
      setAiInsights("Unable to generate AI insights at the moment. Focus on maintaining consistency across all three subjects and solving previous year questions.");
    }
    setLoading(false);
  };

  useEffect(() => {
    generateAIInsights();
  }, []);

  // Daily progress for charts
  const dailyProgress = Array.from({ length: activeTab === 'weekly' ? 7 : 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const dayTasks = tasks.filter(task => task.scheduled_date === dateString);
    const completed = dayTasks.filter(task => task.completed).length;
    
    return {
      day: activeTab === 'weekly' 
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : date.getDate().toString(),
      date: dateString,
      completed,
      total: dayTasks.length,
      percentage: dayTasks.length > 0 ? Math.round((completed / dayTasks.length) * 100) : 0,
      studyTime: dayTasks.reduce((sum, task) => sum + (task.duration || 0), 0)
    };
  }).reverse();

  // Subject radar data
  const subjectRadarData = Object.entries(currentData.subjects).map(([subject, data]) => ({
    subject: subject.substring(0, 8),
    completion: data.completion,
    consistency: data.total > 0 ? 100 : 0,
    focus: data.studyTime > 0 ? Math.min(100, (data.studyTime / 120) * 100) : 0
  }));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${themeColors.card} rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI JEE Coach Analytics</h2>
              <p className="text-white/80">Personalized insights for JEE 2027 success</p>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20">
            ✕
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="weekly">Weekly Analysis</TabsTrigger>
                <TabsTrigger value="monthly">Monthly Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-6">
                {/* Performance Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-800">Completion Rate</p>
                          <span className="text-2xl font-bold text-blue-900">{currentData.completionRate}%</span>
                        </div>
                        <Target className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-800">Study Hours</p>
                          <span className="text-2xl font-bold text-green-900">
                            {Math.floor(currentData.studyTime / 60)}h {currentData.studyTime % 60}m
                          </span>
                        </div>
                        <Clock className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-800">Tasks Completed</p>
                          <span className="text-2xl font-bold text-purple-900">{currentData.completed}</span>
                        </div>
                        <BookOpen className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-red-100 border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-800">JEE Readiness</p>
                          <span className="text-2xl font-bold text-orange-900">
                            {Math.round((currentData.completionRate + (currentData.studyTime > 0 ? 75 : 0)) / 2)}%
                          </span>
                        </div>
                        <Award className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dailyProgress}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="percentage" stroke="#8B5CF6" strokeWidth={3} name="Completion %" />
                          <Line type="monotone" dataKey="studyTime" stroke="#06B6D4" strokeWidth={2} name="Study Time (min)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>JEE Subject Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={subjectRadarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis domain={[0, 100]} />
                          <Radar name="Completion" dataKey="completion" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                          <Radar name="Focus" dataKey="focus" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.2} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <span>🤖 AI Coach Insights</span>
                      {loading && <Badge variant="secondary">Analyzing...</Badge>}
                    </CardTitle>
                    <CardDescription>
                      Personalized recommendations based on your JEE preparation pattern
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="prose dark:prose-invert max-w-none">
                          <p className="whitespace-pre-line">{aiInsights}</p>
                        </div>
                        <Button onClick={generateAIInsights} variant="outline" size="sm">
                          <Brain className="h-4 w-4 mr-2" />
                          Refresh Insights
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Subject Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>JEE Subject Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(currentData.subjects).map(([subject, data]) => (
                        <div key={subject} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{subject}</span>
                              <Badge variant={data.completion >= 70 ? "default" : data.completion >= 50 ? "secondary" : "destructive"}>
                                {data.completion >= 70 ? 'Strong' : data.completion >= 50 ? 'Average' : 'Weak'}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{data.completed}/{data.total}</div>
                              <div className="text-xs text-gray-500">
                                {Math.floor(data.studyTime / 60)}h {data.studyTime % 60}m
                              </div>
                            </div>
                          </div>
                          <Progress value={data.completion} className="h-2" />
                          <div className="flex justify-between text-xs mt-1">
                            <span>{data.completion}% Complete</span>
                            {data.completion >= 80 && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
