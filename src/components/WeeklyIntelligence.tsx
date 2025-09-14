import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  Calendar,
  Clock,
  BookOpen,
  Award,
  AlertCircle,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { usePractice } from '@/hooks/usePractice';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

export const WeeklyIntelligence: React.FC = () => {
  const { tasks } = useTasks();
  const { sessions, analytics } = usePractice();
  const [expandedSection, setExpandedSection] = useState<string>('summary');

  // Get current week data
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const weekTasks = tasks.filter(task => {
    const taskDate = new Date(task.scheduled_date);
    return isWithinInterval(taskDate, { start: weekStart, end: weekEnd });
  });

  const completedThisWeek = weekTasks.filter(t => t.completed).length;
  const totalThisWeek = weekTasks.length;
  const completionRate = totalThisWeek > 0 ? Math.round((completedThisWeek / totalThisWeek) * 100) : 0;

  // Calculate weekly practice stats
  const weeklyPracticeStats = {
    totalQuestions: analytics.week.questionsTotal,
    totalTime: Math.round(analytics.week.timeTotal / 60),
    averageAccuracy: sessions.length > 0 
      ? Math.round(sessions.reduce((sum, s) => sum + (s.accuracy_percentage || 0), 0) / sessions.length)
      : 0,
    sessionsCount: analytics.week.sessionsCount
  };

  // Generate insights
  const generateInsights = () => {
    const insights = [];

    if (completionRate >= 80) {
      insights.push({
        type: 'success',
        icon: '🎯',
        title: 'Excellent Task Completion',
        description: `You've completed ${completionRate}% of your weekly tasks. Outstanding consistency!`
      });
    } else if (completionRate >= 60) {
      insights.push({
        type: 'warning',
        icon: '📈',
        title: 'Good Progress',
        description: `${completionRate}% completion rate. You're on track, but there's room for improvement.`
      });
    } else {
      insights.push({
        type: 'info',
        icon: '💡',
        title: 'Focus Needed',
        description: `${completionRate}% completion rate. Consider breaking tasks into smaller chunks.`
      });
    }

    if (weeklyPracticeStats.totalQuestions > 100) {
      insights.push({
        type: 'success',
        icon: '🚀',
        title: 'High Practice Volume',
        description: `${weeklyPracticeStats.totalQuestions} questions solved this week. Excellent dedication!`
      });
    }

    if (weeklyPracticeStats.averageAccuracy >= 85) {
      insights.push({
        type: 'success',
        icon: '🎯',
        title: 'High Accuracy',
        description: `${weeklyPracticeStats.averageAccuracy}% average accuracy. Your understanding is solid!`
      });
    } else if (weeklyPracticeStats.averageAccuracy < 70 && weeklyPracticeStats.averageAccuracy > 0) {
      insights.push({
        type: 'warning',
        icon: '📚',
        title: 'Focus on Accuracy',
        description: `${weeklyPracticeStats.averageAccuracy}% average accuracy. Consider reviewing concepts before practice.`
      });
    }

    return insights;
  };

  // Generate recommendations
  const generateRecommendations = () => {
    const recommendations = [];

    if (completionRate < 70) {
      recommendations.push({
        icon: '⏰',
        title: 'Time Management',
        description: 'Try breaking large tasks into smaller, manageable chunks.',
        action: 'Review your task breakdown strategy'
      });
    }

    const subjectCounts = analytics.subjects;
    if (subjectCounts.length > 0) {
      const leastPracticed = subjectCounts.sort((a, b) => a.questions - b.questions)[0];
      if (leastPracticed.questions < weeklyPracticeStats.totalQuestions * 0.2) {
        recommendations.push({
          icon: '📖',
          title: `Focus on ${leastPracticed.name}`,
          description: `You've practiced ${leastPracticed.name} less compared to other subjects.`,
          action: `Plan more ${leastPracticed.name} sessions this week`
        });
      }
    }

    if (weeklyPracticeStats.totalTime < 10) {
      recommendations.push({
        icon: '🕐',
        title: 'Increase Study Time',
        description: 'Aim for at least 2 hours of practice per day.',
        action: 'Schedule dedicated practice blocks'
      });
    }

    return recommendations;
  };

  const insights = generateInsights();
  const recommendations = generateRecommendations();

  const sections = [
    { id: 'summary', title: 'Weekly Summary', icon: BarChart3 },
    { id: 'insights', title: 'Performance Insights', icon: Brain },
    { id: 'recommendations', title: 'Recommendations', icon: Lightbulb }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-500" />
          Weekly Intelligence
          <Badge variant="secondary" className="ml-2">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Navigation */}
        <div className="flex gap-2 border-b pb-4">
          {sections.map(section => (
            <Button
              key={section.id}
              variant={expandedSection === section.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setExpandedSection(section.id)}
              className="flex items-center gap-2"
            >
              <section.icon className="h-4 w-4" />
              {section.title}
            </Button>
          ))}
        </div>

        {/* Content */}
        {expandedSection === 'summary' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{completedThisWeek}/{totalThisWeek}</div>
                <div className="text-sm text-blue-700">Tasks Completed</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{weeklyPracticeStats.totalQuestions}</div>
                <div className="text-sm text-green-700">Questions Solved</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{weeklyPracticeStats.totalTime}h</div>
                <div className="text-sm text-purple-700">Study Time</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{completionRate}%</div>
                <div className="text-sm text-orange-700">Completion Rate</div>
              </div>
            </div>

            {/* Subject Breakdown */}
            {Object.keys(analytics.bySubject).length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Subject Distribution
                </h4>
                <div className="space-y-2">
                  {analytics.subjects.map((subject) => (
                    <div key={subject.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">{subject.name}</span>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{subject.questions} questions</span>
                        <span>{Math.round(subject.time / 60)}h</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {expandedSection === 'insights' && (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                insight.type === 'success' ? 'bg-green-50 border-green-200' :
                insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-lg">{insight.icon}</span>
                  <div>
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {expandedSection === 'recommendations' && (
          <div className="space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{rec.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <Button variant="outline" size="sm" className="text-xs">
                        {rec.action}
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="font-medium mb-2">Great Work!</h3>
                <p className="text-sm text-muted-foreground">
                  You're doing excellent. Keep up the great work and maintain consistency!
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};