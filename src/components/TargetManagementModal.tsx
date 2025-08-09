
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Edit3, Trash2, Target, Clock, Award } from 'lucide-react';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { usePractice, PracticeTarget } from '@/hooks/usePractice';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface TargetManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTargetComplete?: () => void;
}

export const TargetManagementModal = ({ open, onOpenChange, onTargetComplete }: TargetManagementModalProps) => {
  const { targets, addTarget, analytics } = usePractice();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  
  const [targetType, setTargetType] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [subject, setSubject] = useState('All');
  const [questionsTarget, setQuestionsTarget] = useState(50);
  const [timeTarget, setTimeTarget] = useState(120);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [editingTarget, setEditingTarget] = useState<PracticeTarget | null>(null);

  const handleSubmit = async () => {
    try {
      const endDate = targetType === 'Daily' 
        ? startDate 
        : targetType === 'Weekly' 
          ? addWeeks(startDate, 1) 
          : addMonths(startDate, 1);

      await addTarget({
        target_type: targetType,
        subject,
        questions_target: questionsTarget,
        time_target: timeTarget,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      });

      // Reset form
      setTargetType('Daily');
      setSubject('All');
      setQuestionsTarget(50);
      setTimeTarget(120);
      setStartDate(new Date());
      setEditingTarget(null);
      
      if (onTargetComplete) onTargetComplete();
    } catch (error) {
      console.error('Error creating target:', error);
    }
  };

  const getTargetProgress = (target: PracticeTarget) => {
    const today = new Date().toISOString().split('T')[0];
    const isActive = target.start_date <= today && target.end_date >= today;
    
    if (!isActive) return { questionsProgress: 0, timeProgress: 0, isComplete: false };
    
    let relevantSessions;
    if (target.target_type === 'Daily') {
      relevantSessions = analytics.today;
    } else if (target.target_type === 'Weekly') {
      relevantSessions = analytics.week;
    } else {
      // Monthly - would need to be calculated
      relevantSessions = analytics.week; // placeholder
    }
    
    const questionsProgress = Math.min((relevantSessions.questionsTotal / target.questions_target) * 100, 100);
    const timeProgress = Math.min((relevantSessions.timeTotal / target.time_target) * 100, 100);
    const isComplete = questionsProgress >= 100 && timeProgress >= 100;
    
    return { questionsProgress, timeProgress, isComplete };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${themeColors.card}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Target Management
          </DialogTitle>
          <DialogDescription>
            Create and manage your practice targets to stay motivated and track progress.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create New Target */}
          <Card className={themeColors.card}>
            <CardHeader>
              <CardTitle className="text-lg">Create New Target</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetType">Target Type</Label>
                  <Select value={targetType} onValueChange={(value: 'Daily' | 'Weekly' | 'Monthly') => setTargetType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily Target</SelectItem>
                      <SelectItem value="Weekly">Weekly Target</SelectItem>
                      <SelectItem value="Monthly">Monthly Target</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label htmlFor="questions">Questions Target</Label>
                  <Input
                    id="questions"
                    type="number"
                    value={questionsTarget}
                    onChange={(e) => setQuestionsTarget(Number(e.target.value))}
                    min="1"
                  />
                </div>

                <div>
                  <Label htmlFor="time">Time Target (minutes)</Label>
                  <Input
                    id="time"
                    type="number"
                    value={timeTarget}
                    onChange={(e) => setTimeTarget(Number(e.target.value))}
                    min="1"
                  />
                </div>
              </div>

              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button onClick={handleSubmit} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Target
              </Button>
            </CardContent>
          </Card>

          {/* Active Targets */}
          <Card className={themeColors.card}>
            <CardHeader>
              <CardTitle className="text-lg">Your Targets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {targets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No targets created yet.</p>
                  <p className="text-sm">Create your first target to get started!</p>
                </div>
              ) : (
                targets.map((target) => {
                  const { questionsProgress, timeProgress, isComplete } = getTargetProgress(target);
                  
                  return (
                    <Card key={target.id} className={`${themeColors.card} ${themeColors.border} border ${isComplete ? 'ring-2 ring-green-500' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={target.target_type === 'Daily' ? 'default' : target.target_type === 'Weekly' ? 'secondary' : 'outline'}>
                              {target.target_type}
                            </Badge>
                            <span className="font-medium">{target.subject}</span>
                            {isComplete && <Award className="h-4 w-4 text-green-500" />}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setEditingTarget(target)}>
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                Questions: {Math.round((questionsProgress / 100) * target.questions_target)}/{target.questions_target}
                              </span>
                              <span>{Math.round(questionsProgress)}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${themeColors.primary} transition-all duration-500`}
                                style={{ width: `${questionsProgress}%` }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Time: {Math.round((timeProgress / 100) * target.time_target)}/{target.time_target}min
                              </span>
                              <span>{Math.round(timeProgress)}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${themeColors.primary} transition-all duration-500`}
                                style={{ width: `${timeProgress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground mt-2">
                          {format(new Date(target.start_date), "MMM d")} - {format(new Date(target.end_date), "MMM d, yyyy")}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
