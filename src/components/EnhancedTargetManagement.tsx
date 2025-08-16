
import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Plus, Target, Clock, Trash2, Edit, Settings, Trophy, Zap, Calendar as CalendarLucide } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, addWeeks, addMonths } from 'date-fns';
import { usePractice, PracticeTarget } from '@/hooks/usePractice';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface EnhancedTargetManagementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTargetComplete?: () => void;
}

export const EnhancedTargetManagement = ({ open, onOpenChange, onTargetComplete }: EnhancedTargetManagementProps) => {
  const { targets, addTarget, updateTarget, deleteTarget, analytics } = usePractice();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('daily');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTarget, setEditingTarget] = useState<PracticeTarget | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    targetType: 'Daily' as 'Daily' | 'Weekly' | 'Monthly',
    subject: 'All',
    questionsTarget: 10,
    timeTarget: 60,
    startDate: new Date(),
    endDate: new Date(),
    // Enhanced features
    difficulty: 'Mixed' as 'Easy' | 'Medium' | 'Hard' | 'Mixed',
    focusArea: 'All' as 'All' | 'Weak Topics' | 'New Topics' | 'Revision',
    streakGoal: 7,
    reminderEnabled: true
  });

  // Get targets for current period based on selected date
  const periodTargets = useMemo(() => {
    const today = selectedDate.toISOString().split('T')[0];
    
    const dailyTargets = targets.filter(target => 
      target.target_type === 'Daily' && 
      target.start_date <= today && 
      target.end_date >= today
    );

    const weekStart = startOfWeek(selectedDate).toISOString().split('T')[0];
    const weekEnd = endOfWeek(selectedDate).toISOString().split('T')[0];
    const weeklyTargets = targets.filter(target => 
      target.target_type === 'Weekly' &&
      target.start_date <= weekEnd && 
      target.end_date >= weekStart
    );

    const monthStart = startOfMonth(selectedDate).toISOString().split('T')[0];
    const monthEnd = endOfMonth(selectedDate).toISOString().split('T')[0];
    const monthlyTargets = targets.filter(target => 
      target.target_type === 'Monthly' &&
      target.start_date <= monthEnd && 
      target.end_date >= monthStart
    );

    return { dailyTargets, weeklyTargets, monthlyTargets };
  }, [targets, selectedDate]);

  const resetForm = () => {
    setFormData({
      targetType: 'Daily',
      subject: 'All',
      questionsTarget: 10,
      timeTarget: 60,
      startDate: selectedDate,
      endDate: selectedDate,
      difficulty: 'Mixed',
      focusArea: 'All',
      streakGoal: 7,
      reminderEnabled: true
    });
    setShowCreateForm(false);
    setEditingTarget(null);
  };

  const getSmartDefaults = (targetType: string) => {
    switch (targetType) {
      case 'Daily':
        return {
          questionsTarget: 15,
          timeTarget: 90,
          startDate: selectedDate,
          endDate: selectedDate,
          streakGoal: 7
        };
      case 'Weekly':
        return {
          questionsTarget: 100,
          timeTarget: 600,
          startDate: startOfWeek(selectedDate),
          endDate: endOfWeek(selectedDate),
          streakGoal: 4
        };
      case 'Monthly':
        return {
          questionsTarget: 400,
          timeTarget: 2400,
          startDate: startOfMonth(selectedDate),
          endDate: endOfMonth(selectedDate),
          streakGoal: 20
        };
      default:
        return formData;
    }
  };

  const handleTargetTypeChange = (newType: 'Daily' | 'Weekly' | 'Monthly') => {
    const defaults = getSmartDefaults(newType);
    setFormData(prev => ({
      ...prev,
      targetType: newType,
      ...defaults
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingTarget) {
        await updateTarget(editingTarget.id, {
          target_type: formData.targetType,
          subject: formData.subject,
          questions_target: formData.questionsTarget,
          time_target: formData.timeTarget,
          start_date: formData.startDate.toISOString().split('T')[0],
          end_date: formData.endDate.toISOString().split('T')[0]
        });
      } else {
        await addTarget({
          target_type: formData.targetType,
          subject: formData.subject,
          questions_target: formData.questionsTarget,
          time_target: formData.timeTarget,
          start_date: formData.startDate.toISOString().split('T')[0],
          end_date: formData.endDate.toISOString().split('T')[0]
        });
      }

      if (onTargetComplete) {
        onTargetComplete();
      }

      resetForm();
    } catch (error) {
      console.error('Error saving target:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (target: PracticeTarget) => {
    setFormData({
      targetType: target.target_type,
      subject: target.subject,
      questionsTarget: target.questions_target,
      timeTarget: target.time_target,
      startDate: new Date(target.start_date),
      endDate: new Date(target.end_date),
      difficulty: 'Mixed',
      focusArea: 'All',
      streakGoal: 7,
      reminderEnabled: true
    });
    setEditingTarget(target);
    setShowCreateForm(true);
  };

  const handleDelete = async (targetId: string) => {
    if (window.confirm('Are you sure you want to delete this target?')) {
      try {
        await deleteTarget(targetId);
      } catch (error) {
        console.error('Error deleting target:', error);
      }
    }
  };

  const getTargetProgress = (target: PracticeTarget) => {
    // Calculate progress based on current analytics
    const questionsProgress = Math.min(100, (analytics.today.questionsTotal / target.questions_target) * 100);
    const timeProgress = Math.min(100, (analytics.today.timeTotal / target.time_target) * 100);
    return { questionsProgress, timeProgress };
  };

  const TargetCard = ({ target }: { target: PracticeTarget }) => {
    const { questionsProgress, timeProgress } = getTargetProgress(target);
    const isCompleted = questionsProgress >= 100 && timeProgress >= 100;

    return (
      <Card className={`${themeColors.card} ${themeColors.glow} hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
        isCompleted ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-indigo-500'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${target.target_type === 'Daily' ? 'bg-green-100 text-green-700' : 
                  target.target_type === 'Weekly' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  {target.target_type}
                </Badge>
                <Badge variant="outline">{target.subject}</Badge>
                {isCompleted && <Trophy className="h-4 w-4 text-yellow-500" />}
              </div>
              <CardTitle className="text-sm font-medium">{target.subject} Target</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(target)} className="h-8 w-8 p-0">
                <Edit className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(target.id)} className="h-8 w-8 p-0">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Questions Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Questions</span>
              <span className="font-medium">{analytics.today.questionsTotal}/{target.questions_target}</span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    questionsProgress >= 100 ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, questionsProgress)}%` }}
                />
              </div>
              <span className="absolute right-0 -top-5 text-xs font-medium">
                {Math.round(questionsProgress)}%
              </span>
            </div>
          </div>

          {/* Time Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Time</span>
              <span className="font-medium">{analytics.today.timeTotal}/{target.time_target} min</span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    timeProgress >= 100 ? 'bg-green-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${Math.min(100, timeProgress)}%` }}
                />
              </div>
              <span className="absolute right-0 -top-5 text-xs font-medium">
                {Math.round(timeProgress)}%
              </span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground pt-2 border-t">
            {format(new Date(target.start_date), 'MMM dd')} - {format(new Date(target.end_date), 'MMM dd, yyyy')}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
              <Target className="h-6 w-6 text-white" />
            </div>
            Enhanced Target Management
          </DialogTitle>
          <DialogDescription className="text-base">
            Set smart, period-specific targets with advanced tracking and insights
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date Selector */}
          <Card className={`${themeColors.card} border-2 border-indigo-200 dark:border-indigo-800`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarLucide className="h-5 w-5" />
                Select Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "EEEE, MMMM do, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          {/* Target Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Daily ({periodTargets.dailyTargets.length})
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                <CalendarLucide className="h-4 w-4" />
                Weekly ({periodTargets.weeklyTargets.length})
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Monthly ({periodTargets.monthlyTargets.length})
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              {/* Create Target Button */}
              {!showCreateForm ? (
                <Button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      targetType: activeTab === 'daily' ? 'Daily' : activeTab === 'weekly' ? 'Weekly' : 'Monthly',
                      ...getSmartDefaults(activeTab === 'daily' ? 'Daily' : activeTab === 'weekly' ? 'Weekly' : 'Monthly')
                    }));
                    setShowCreateForm(true);
                  }}
                  className="w-full mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 py-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Target
                </Button>
              ) : (
                <Card className={`${themeColors.card} border-2 border-indigo-200 dark:border-indigo-800 mb-6`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      {editingTarget ? 'Edit Target' : `Create ${formData.targetType} Target`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Subject Focus</Label>
                          <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">🎯 All Subjects</SelectItem>
                              <SelectItem value="Physics">⚛️ Physics</SelectItem>
                              <SelectItem value="Chemistry">🧪 Chemistry</SelectItem>
                              <SelectItem value="Mathematics">📐 Mathematics</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Focus Area</Label>
                          <Select value={formData.focusArea} onValueChange={(value) => setFormData(prev => ({ ...prev, focusArea: value as any }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">📚 All Topics</SelectItem>
                              <SelectItem value="Weak Topics">💪 Weak Topics</SelectItem>
                              <SelectItem value="New Topics">🆕 New Topics</SelectItem>
                              <SelectItem value="Revision">🔄 Revision</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Questions Target</Label>
                          <Input
                            type="number"
                            value={formData.questionsTarget}
                            onChange={(e) => setFormData(prev => ({ ...prev, questionsTarget: Number(e.target.value) }))}
                            min="1"
                          />
                        </div>
                        <div>
                          <Label>Time Target (minutes)</Label>
                          <Input
                            type="number"
                            value={formData.timeTarget}
                            onChange={(e) => setFormData(prev => ({ ...prev, timeTarget: Number(e.target.value) }))}
                            min="1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Difficulty Level</Label>
                          <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value as any }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Easy">🟢 Easy</SelectItem>
                              <SelectItem value="Medium">🟡 Medium</SelectItem>
                              <SelectItem value="Hard">🔴 Hard</SelectItem>
                              <SelectItem value="Mixed">🎯 Mixed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Streak Goal (days)</Label>
                          <Input
                            type="number"
                            value={formData.streakGoal}
                            onChange={(e) => setFormData(prev => ({ ...prev, streakGoal: Number(e.target.value) }))}
                            min="1"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600">
                          {isSubmitting ? "Saving..." : editingTarget ? "Update Target" : "Create Target"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Target Lists */}
              <TabsContent value="daily" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {periodTargets.dailyTargets.map(target => (
                    <TargetCard key={target.id} target={target} />
                  ))}
                </div>
                {periodTargets.dailyTargets.length === 0 && (
                  <Card className={`${themeColors.card} text-center py-8`}>
                    <CardContent>
                      <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No daily targets set for {format(selectedDate, 'MMMM do, yyyy')}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="weekly" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {periodTargets.weeklyTargets.map(target => (
                    <TargetCard key={target.id} target={target} />
                  ))}
                </div>
                {periodTargets.weeklyTargets.length === 0 && (
                  <Card className={`${themeColors.card} text-center py-8`}>
                    <CardContent>
                      <CalendarLucide className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">
                        No weekly targets set for week of {format(startOfWeek(selectedDate), 'MMMM do')} - {format(endOfWeek(selectedDate), 'MMMM do, yyyy')}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="monthly" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {periodTargets.monthlyTargets.map(target => (
                    <TargetCard key={target.id} target={target} />
                  ))}
                </div>
                {periodTargets.monthlyTargets.length === 0 && (
                  <Card className={`${themeColors.card} text-center py-8`}>
                    <CardContent>
                      <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">
                        No monthly targets set for {format(selectedDate, 'MMMM yyyy')}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
