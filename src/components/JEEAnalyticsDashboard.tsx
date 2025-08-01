
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
import { Calendar, TrendingUp, Clock, Target, Award, Book, Brain, Flame, X, ChevronLeft, ChevronRight, Star, AlertTriangle, CheckCircle, Trophy, Zap, BookOpen, Timer, TrendingDown, Users, Lightbulb, BarChart3, Bot, Sparkles, Activity, ChartBar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  subject: string;
  chapter?: string;
  completed: boolean;
  priority: string;
  created_at: string;
  scheduled_date: string;
  duration?: number;
}

interface JEEAnalyticsDashboardProps {
  tasks: Task[];
  onClose: () => void;
}

const JEE_SUBJECTS = {
  'Physics': {
    color: '#3B82F6',
    icon: '⚛️',
    chapters: ['Mechanics', 'Thermodynamics', 'Waves & Oscillations', 'Electromagnetism', 'Optics', 'Modern Physics']
  },
  'Chemistry': {
    color: '#10B981',
    icon: '🧪',
    chapters: ['Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry', 'Chemical Bonding', 'Periodic Table', 'Coordination Compounds']
  },
  'Mathematics': {
    color: '#F59E0B',
    icon: '📐',
    chapters: ['Calculus', 'Algebra', 'Coordinate Geometry', 'Trigonometry', 'Statistics & Probability', 'Vectors']
  }
};

export const JEEAnalyticsDashboard = ({ tasks, onClose }: JEEAnalyticsDashboardProps) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const getTimeframeData = (timeframe: string) => {
    const today = new Date();
    const days = timeframe === 'weekly' ? 7 : 30;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);

    return tasks.filter(task => {
      const taskDate = new Date(task.scheduled_date);
      return taskDate >= startDate;
    });
  };

  const timeframeTasks = getTimeframeData(selectedTimeframe);

  // Subject-wise comprehensive analysis
  const subjectAnalysis = Object.keys(JEE_SUBJECTS).map(subject => {
    const subjectTasks = timeframeTasks.filter(task => 
      task.subject.toLowerCase().includes(subject.toLowerCase()) || 
      task.title.toLowerCase().includes(subject.toLowerCase())
    );
    
    const completed = subjectTasks.filter(task => task.completed);
    const highPriority = subjectTasks.filter(task => task.priority === 'high');
    const studyTime = completed.reduce((sum, task) => sum + (task.duration || 0), 0);
    
    return {
      subject,
      total: subjectTasks.length,
      completed: completed.length,
      completion: subjectTasks.length > 0 ? Math.round((completed.length / subjectTasks.length) * 100) : 0,
      studyTime,
      highPriorityCount: highPriority.length,
      efficiency: subjectTasks.length > 0 ? Math.round((completed.length / subjectTasks.length) * 100) : 0,
      avgTimePerTask: completed.length > 0 ? Math.round(studyTime / completed.length) : 0,
      color: JEE_SUBJECTS[subject as keyof typeof JEE_SUBJECTS].color,
      icon: JEE_SUBJECTS[subject as keyof typeof JEE_SUBJECTS].icon
    };
  });

  // Monthly trend analysis
  const monthlyTrend = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateString = date.toISOString().split('T')[0];
    
    const dayTasks = tasks.filter(task => task.scheduled_date === dateString);
    const completed = dayTasks.filter(task => task.completed).length;
    
    return {
      date: date.getDate(),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      completed,
      total: dayTasks.length,
      percentage: dayTasks.length > 0 ? Math.round((completed / dayTasks.length) * 100) : 0,
      studyTime: dayTasks.reduce((sum, task) => sum + (task.completed ? task.duration || 0 : 0), 0)
    };
  });

  // JEE-specific metrics
  const jeeMetrics = {
    totalStudyHours: timeframeTasks.reduce((sum, task) => sum + (task.completed ? task.duration || 0 : 0), 0),
    completionRate: timeframeTasks.length > 0 ? Math.round((timeframeTasks.filter(task => task.completed).length / timeframeTasks.length) * 100) : 0,
    highPriorityCompletion: timeframeTasks.filter(task => task.priority === 'high').length > 0 ? 
      Math.round((timeframeTasks.filter(task => task.priority === 'high' && task.completed).length / timeframeTasks.filter(task => task.priority === 'high').length) * 100) : 0,
    consistencyScore: monthlyTrend.filter(day => day.percentage > 0).length,
    averageDailyStudy: Math.round((timeframeTasks.reduce((sum, task) => sum + (task.completed ? task.duration || 0 : 0), 0) / (selectedTimeframe === 'weekly' ? 7 : 30))),
  };

  const fetchAIInsights = async () => {
    setLoadingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('jee-ai-coach', {
        body: {
          tasks: timeframeTasks,
          analysisType: activeTab,
          timeframe: selectedTimeframe
        }
      });

      if (error) throw error;
      
      // Parse the AI response if it's JSON
      try {
        const parsedInsights = JSON.parse(data.analysis);
        setAiInsights(parsedInsights);
      } catch {
        // If not JSON, use as plain text
        setAiInsights({ analysis: data.analysis });
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      toast.error('Failed to get AI insights');
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    if (timeframeTasks.length > 0) {
      fetchAIInsights();
    }
  }, [selectedTimeframe, activeTab]);

  const getPerformanceLevel = (score: number) => {
    if (score >= 85) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 70) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 50) return { level: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-50' };
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${themeColors.card} rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden`}>
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
                <span>JEE 2027 AI Coach</span>
                <Sparkles className="h-6 w-6 text-yellow-300" />
              </h2>
              <p className="text-white/80">Your personal AI mentor for JEE preparation</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <select 
                value={selectedTimeframe} 
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="bg-transparent text-white text-sm font-medium outline-none"
              >
                <option value="weekly" className="text-gray-800">Weekly</option>
                <option value="monthly" className="text-gray-800">Monthly</option>
              </select>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/20 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="ai-coach">AI Coach</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* JEE Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-800">Study Hours</p>
                        <span className="text-2xl font-bold text-blue-900">
                          {Math.floor(jeeMetrics.totalStudyHours / 60)}h {jeeMetrics.totalStudyHours % 60}m
                        </span>
                      </div>
                      <Clock className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">Completion</p>
                        <span className="text-2xl font-bold text-green-900">{jeeMetrics.completionRate}%</span>
                      </div>
                      <Target className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-800">Priority Tasks</p>
                        <span className="text-2xl font-bold text-purple-900">{jeeMetrics.highPriorityCompletion}%</span>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-800">Consistency</p>
                        <span className="text-2xl font-bold text-orange-900">{jeeMetrics.consistencyScore}/30</span>
                      </div>
                      <Activity className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-indigo-800">Daily Avg</p>
                        <span className="text-2xl font-bold text-indigo-900">{jeeMetrics.averageDailyStudy}m</span>
                      </div>
                      <ChartBar className="h-8 w-8 text-indigo-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Study Progress Trend</CardTitle>
                  <CardDescription>Your {selectedTimeframe} study pattern</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="studyTime" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="Study Time (min)" />
                      <Area type="monotone" dataKey="percentage" stackId="2" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} name="Completion %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-6">
              {/* Subject Performance Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {subjectAnalysis.map((subject) => {
                  const performance = getPerformanceLevel(subject.completion);
                  return (
                    <Card key={subject.subject} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center space-x-2">
                          <span className="text-2xl">{subject.icon}</span>
                          <span>{subject.subject}</span>
                          <Badge className={performance.color}>{performance.level}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Completed</p>
                            <p className="font-bold text-lg">{subject.completed}/{subject.total}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Study Time</p>
                            <p className="font-bold text-lg">{Math.floor(subject.studyTime / 60)}h {subject.studyTime % 60}m</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Efficiency</p>
                            <p className="font-bold text-lg">{subject.efficiency}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Avg/Task</p>
                            <p className="font-bold text-lg">{subject.avgTimePerTask}m</p>
                          </div>
                        </div>
                        <Progress value={subject.completion} className="h-3" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Subject Comparison Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Subject Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={subjectAnalysis}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar name="Completion %" dataKey="completion" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                      <Radar name="Efficiency %" dataKey="efficiency" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.2} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              {/* Performance metrics and charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyTrend.slice(-7)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completed" fill="#10B981" name="Completed Tasks" />
                        <Bar dataKey="total" fill="#E5E7EB" name="Total Tasks" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Subject Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={subjectAnalysis}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ subject, studyTime }) => `${subject}: ${Math.floor(studyTime / 60)}h`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="studyTime"
                        >
                          {subjectAnalysis.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ai-coach" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-blue-600" />
                    <span>AI Coach Insights</span>
                    {loadingAI && <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />}
                  </CardTitle>
                  <CardDescription>
                    Personalized analysis and recommendations for JEE 2027
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {aiInsights ? (
                    <div className="space-y-4">
                      {typeof aiInsights === 'object' && aiInsights.performance && (
                        <div>
                          <h4 className="font-semibold text-lg mb-2">📊 Performance Analysis</h4>
                          <p className="text-sm text-gray-600 mb-4">{aiInsights.performance}</p>
                        </div>
                      )}
                      {typeof aiInsights === 'object' && aiInsights.recommendations && (
                        <div>
                          <h4 className="font-semibold text-lg mb-2">💡 Recommendations</h4>
                          <p className="text-sm text-gray-600 mb-4">{aiInsights.recommendations}</p>
                        </div>
                      )}
                      {typeof aiInsights === 'object' && aiInsights.motivation && (
                        <div>
                          <h4 className="font-semibold text-lg mb-2">🚀 Motivation</h4>
                          <p className="text-sm text-gray-600 mb-4">{aiInsights.motivation}</p>
                        </div>
                      )}
                      {typeof aiInsights === 'string' && (
                        <div className="whitespace-pre-wrap text-sm text-gray-700">
                          {aiInsights}
                        </div>
                      )}
                      <Button onClick={fetchAIInsights} disabled={loadingAI} className="w-full">
                        {loadingAI ? 'Analyzing...' : 'Get Fresh Insights'}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Bot className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 mb-4">AI Coach is analyzing your performance...</p>
                      <Button onClick={fetchAIInsights} disabled={loadingAI}>
                        {loadingAI ? 'Analyzing...' : 'Start AI Analysis'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
