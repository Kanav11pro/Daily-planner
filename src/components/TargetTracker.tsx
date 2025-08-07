import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { usePractice } from '@/hooks/usePractice';
import { useToast } from '@/hooks/use-toast';
import { Target, Plus, TrendingUp, Clock, Calendar, CheckCircle } from 'lucide-react';
import { format, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface TargetTrackerProps {
  detailed?: boolean;
}

export const TargetTracker = ({ detailed = false }: TargetTrackerProps) => {
  const { targets, sessions, addTarget } = usePractice();
  const { toast } = useToast();
  const [showAddTarget, setShowAddTarget] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newTarget, setNewTarget] = useState({
    target_type: '',
    subject: '',
    questions_target: '',
    time_target: '',
    start_date: '',
    end_date: '',
  });

  const targetAnalytics = useMemo(() => {
    const now = new Date();
    
    return targets.map(target => {
      const startDate = new Date(target.start_date);
      const endDate = new Date(target.end_date);
      
      // Filter sessions within target period
      const relevantSessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return isWithinInterval(sessionDate, { start: startDate, end: endDate }) &&
               (target.subject === 'All' || session.subject === target.subject);
      });

      const currentQuestions = relevantSessions.reduce((sum, s) => sum + s.questions_solved, 0);
      const currentTime = relevantSessions.reduce((sum, s) => sum + s.time_spent, 0);

      // Calculate progress percentages
      const questionsProgress = target.questions_target > 0 
        ? Math.min((currentQuestions / target.questions_target) * 100, 100)
        : 0;
      const timeProgress = target.time_target > 0 
        ? Math.min((currentTime / target.time_target) * 100, 100)
        : 0;

      // Calculate days
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const daysElapsed = Math.max(0, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
      const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      
      const timeProgress_timeline = totalDays > 0 ? Math.min((daysElapsed / totalDays) * 100, 100) : 0;

      // Determine status
      let status: 'ahead' | 'on-track' | 'behind' | 'overdue' | 'completed';
      if (questionsProgress >= 100 && timeProgress >= 100) {
        status = 'completed';
      } else if (now > endDate) {
        status = 'overdue';
      } else if (questionsProgress >= timeProgress_timeline) {
        status = 'ahead';
      } else if (questionsProgress >= timeProgress_timeline - 10) {
        status = 'on-track';
      } else {
        status = 'behind';
      }

      return {
        ...target,
        currentQuestions,
        currentTime,
        questionsProgress,
        timeProgress,
        timeProgress_timeline,
        daysElapsed,
        daysRemaining,
        totalDays,
        status,
        isActive: now >= startDate && now <= endDate,
      };
    });
  }, [targets, sessions]);

  const handleAddTarget = async () => {
    if (!newTarget.target_type || !newTarget.subject || !newTarget.questions_target || !newTarget.start_date || !newTarget.end_date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await addTarget({
        target_type: newTarget.target_type as any,
        subject: newTarget.subject,
        questions_target: parseInt(newTarget.questions_target),
        time_target: parseInt(newTarget.time_target) || 0,
        start_date: newTarget.start_date,
        end_date: newTarget.end_date,
      });

      toast({
        title: "Target Added",
        description: "Your new target has been created successfully!",
      });

      setNewTarget({
        target_type: '',
        subject: '',
        questions_target: '',
        time_target: '',
        start_date: '',
        end_date: '',
      });
      setShowAddTarget(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add target. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'ahead': return 'bg-blue-500';
      case 'on-track': return 'bg-green-500';
      case 'behind': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'ahead': return 'Ahead of Schedule';
      case 'on-track': return 'On Track';
      case 'behind': return 'Behind Schedule';
      case 'overdue': return 'Overdue';
      default: return 'Unknown';
    }
  };

  // Generate default dates based on target type
  const getDefaultDates = (targetType: string) => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    
    switch (targetType) {
      case 'Daily':
        return { start_date: today, end_date: today };
      case 'Weekly':
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
        return { 
          start_date: format(weekStart, 'yyyy-MM-dd'), 
          end_date: format(weekEnd, 'yyyy-MM-dd') 
        };
      case 'Monthly':
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        return { 
          start_date: format(monthStart, 'yyyy-MM-dd'), 
          end_date: format(monthEnd, 'yyyy-MM-dd') 
        };
      default:
        return { start_date: today, end_date: today };
    }
  };

  if (!detailed) {
    const activeTargets = targetAnalytics.filter(t => t.isActive).slice(0, 3);
    
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Active Targets
            </CardTitle>
            <CardDescription>Your current progress towards goals</CardDescription>
          </div>
          <Dialog open={showAddTarget} onOpenChange={setShowAddTarget}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeTargets.length > 0 ? (
            activeTargets.map(target => (
              <div key={target.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{target.target_type}</Badge>
                    <span className="text-sm font-medium">{target.subject}</span>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(target.status)} text-white`}>
                    {getStatusLabel(target.status)}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Questions: {target.currentQuestions}/{target.questions_target}</span>
                    <span>{Math.round(target.questionsProgress)}%</span>
                  </div>
                  <Progress value={target.questionsProgress} className="h-2" />
                </div>

                {target.time_target > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Time: {Math.round(target.currentTime/60)}h/{Math.round(target.time_target/60)}h</span>
                      <span>{Math.round(target.timeProgress)}%</span>
                    </div>
                    <Progress value={target.timeProgress} className="h-2" />
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  {target.daysRemaining > 0 
                    ? `${target.daysRemaining} days remaining` 
                    : target.status === 'completed' 
                      ? 'Completed!' 
                      : 'Overdue'
                  }
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No active targets</p>
              <p className="text-xs text-muted-foreground">Create a target to track your progress</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Target Tracker
          </h2>
          <p className="text-muted-foreground">Set and monitor your practice goals</p>
        </div>
        
        <Dialog open={showAddTarget} onOpenChange={setShowAddTarget}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Target
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Target</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target_type">Target Type</Label>
                  <Select 
                    value={newTarget.target_type} 
                    onValueChange={(value) => {
                      const dates = getDefaultDates(value);
                      setNewTarget(prev => ({ 
                        ...prev, 
                        target_type: value,
                        start_date: dates.start_date,
                        end_date: dates.end_date
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={newTarget.subject} onValueChange={(value) => setNewTarget(prev => ({ ...prev, subject: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Subjects</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="questions_target">Questions Target</Label>
                  <Input
                    id="questions_target"
                    type="number"
                    placeholder="100"
                    value={newTarget.questions_target}
                    onChange={(e) => setNewTarget(prev => ({ ...prev, questions_target: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="time_target">Time Target (minutes)</Label>
                  <Input
                    id="time_target"
                    type="number"
                    placeholder="240"
                    value={newTarget.time_target}
                    onChange={(e) => setNewTarget(prev => ({ ...prev, time_target: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={newTarget.start_date}
                    onChange={(e) => setNewTarget(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={newTarget.end_date}
                    onChange={(e) => setNewTarget(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddTarget(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTarget} disabled={loading}>
                  {loading ? 'Creating...' : 'Create Target'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {targetAnalytics.map(target => (
          <Card key={target.id} className={`${target.isActive ? 'ring-2 ring-primary/20' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{target.target_type}</Badge>
                    <Badge variant="secondary">{target.subject}</Badge>
                  </div>
                  <CardTitle className="text-base">
                    {target.questions_target} Questions Goal
                  </CardTitle>
                </div>
                <Badge className={`${getStatusColor(target.status)} text-white`}>
                  {target.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {getStatusLabel(target.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Questions Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Questions
                  </span>
                  <span>{target.currentQuestions}/{target.questions_target}</span>
                </div>
                <Progress value={target.questionsProgress} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {Math.round(target.questionsProgress)}% complete
                </div>
              </div>

              {/* Time Progress */}
              {target.time_target > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Time
                    </span>
                    <span>
                      {Math.round(target.currentTime/60)}h/{Math.round(target.time_target/60)}h
                    </span>
                  </div>
                  <Progress value={target.timeProgress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {Math.round(target.timeProgress)}% complete
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Timeline
                  </span>
                  <span>{target.daysElapsed}/{target.totalDays} days</span>
                </div>
                <Progress value={target.timeProgress_timeline} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {target.daysRemaining > 0 
                    ? `${target.daysRemaining} days remaining`
                    : target.status === 'completed' 
                      ? 'Target completed!'
                      : 'Target period ended'
                  }
                </div>
              </div>

              {/* Date Range */}
              <div className="text-xs text-muted-foreground border-t pt-2">
                {format(new Date(target.start_date), 'MMM d')} - {format(new Date(target.end_date), 'MMM d, yyyy')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {targetAnalytics.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Targets Set</h3>
            <p className="text-muted-foreground mb-4">
              Create your first target to start tracking your practice goals
            </p>
            <Button onClick={() => setShowAddTarget(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Target
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};