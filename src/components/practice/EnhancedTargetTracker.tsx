
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Target, Flame, Trophy, Plus, TrendingUp, Clock } from 'lucide-react';
import { PracticeTarget } from '@/hooks/usePractice';

interface EnhancedTargetTrackerProps {
  targets: PracticeTarget[];
  onAddTarget: (target: Omit<PracticeTarget, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  sessions: any[];
}

export const EnhancedTargetTracker = ({ targets, onAddTarget, sessions }: EnhancedTargetTrackerProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTarget, setNewTarget] = useState({
    target_type: 'Daily' as 'Daily' | 'Weekly' | 'Monthly',
    subject: '',
    questions_target: 50,
    time_target: 120,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const handleAddTarget = () => {
    onAddTarget(newTarget);
    setIsAddDialogOpen(false);
    setNewTarget({
      target_type: 'Daily',
      subject: '',
      questions_target: 50,
      time_target: 120,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  const getTargetProgress = (target: PracticeTarget) => {
    const today = new Date().toISOString().split('T')[0];
    const relevantSessions = sessions.filter(s => 
      s.subject === target.subject && s.date === today
    );
    
    const questionsCompleted = relevantSessions.reduce((sum, s) => sum + s.questions_solved, 0);
    const timeCompleted = relevantSessions.reduce((sum, s) => sum + s.time_spent, 0);
    
    return {
      questionsProgress: Math.min((questionsCompleted / target.questions_target) * 100, 100),
      timeProgress: Math.min((timeCompleted / target.time_target) * 100, 100),
      questionsCompleted,
      timeCompleted
    };
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-500';
    if (streak >= 14) return 'text-blue-500';
    if (streak >= 7) return 'text-green-500';
    if (streak >= 3) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getMotivationalMessage = (progress: number, streak: number) => {
    if (progress >= 100) return "🎉 Target crushed! You're unstoppable!";
    if (progress >= 80) return "🔥 Almost there! Push through!";
    if (progress >= 50) return "💪 Great progress! Keep going!";
    if (streak >= 7) return "🌟 Amazing streak! Don't break it!";
    return "🚀 Let's build momentum today!";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5" />
          Practice Targets & Accountability
        </h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Set Target
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set New Practice Target</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Type</Label>
                  <Select value={newTarget.target_type} onValueChange={(value: 'Daily' | 'Weekly' | 'Monthly') => 
                    setNewTarget(prev => ({ ...prev, target_type: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select value={newTarget.subject} onValueChange={(value) => 
                    setNewTarget(prev => ({ ...prev, subject: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Questions Target</Label>
                  <Input
                    type="number"
                    value={newTarget.questions_target}
                    onChange={(e) => setNewTarget(prev => ({ 
                      ...prev, 
                      questions_target: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time Target (minutes)</Label>
                  <Input
                    type="number"
                    value={newTarget.time_target}
                    onChange={(e) => setNewTarget(prev => ({ 
                      ...prev, 
                      time_target: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={newTarget.start_date}
                    onChange={(e) => setNewTarget(prev => ({ 
                      ...prev, 
                      start_date: e.target.value 
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={newTarget.end_date}
                    onChange={(e) => setNewTarget(prev => ({ 
                      ...prev, 
                      end_date: e.target.value 
                    }))}
                  />
                </div>
              </div>

              <Button onClick={handleAddTarget} className="w-full">
                Set Target
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {targets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No practice targets set yet</p>
            <p className="text-sm text-muted-foreground">Set targets to track your progress and stay accountable!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {targets.map((target) => {
            const progress = getTargetProgress(target);
            const avgProgress = (progress.questionsProgress + progress.timeProgress) / 2;
            
            return (
              <Card key={target.id} className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={avgProgress >= 100 ? "default" : "secondary"}>
                        {target.target_type} • {target.subject}
                      </Badge>
                      {target.streak_count && target.streak_count > 0 && (
                        <div className={`flex items-center gap-1 ${getStreakColor(target.streak_count)}`}>
                          <Flame className="h-4 w-4" />
                          <span className="text-sm font-semibold">{target.streak_count} day streak</span>
                        </div>
                      )}
                      {target.best_streak && target.best_streak > (target.streak_count || 0) && (
                        <div className="flex items-center gap-1 text-amber-500">
                          <Trophy className="h-4 w-4" />
                          <span className="text-sm">Best: {target.best_streak}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(avgProgress)}% complete
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getMotivationalMessage(avgProgress, target.streak_count || 0)}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Questions: {progress.questionsCompleted}/{target.questions_target}
                      </span>
                      <span className="text-muted-foreground">
                        {Math.round(progress.questionsProgress)}%
                      </span>
                    </div>
                    <Progress value={progress.questionsProgress} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Time: {progress.timeCompleted}/{target.time_target} min
                      </span>
                      <span className="text-muted-foreground">
                        {Math.round(progress.timeProgress)}%
                      </span>
                    </div>
                    <Progress value={progress.timeProgress} className="h-2" />
                  </div>

                  {target.accountability_score && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Accountability Score</span>
                        <Badge variant={target.accountability_score >= 8 ? "default" : 
                                      target.accountability_score >= 6 ? "secondary" : "destructive"}>
                          {target.accountability_score}/10
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
