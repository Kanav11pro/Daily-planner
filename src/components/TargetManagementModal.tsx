import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Target, Clock, Trash2, Edit, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { usePractice, PracticeTarget } from '@/hooks/usePractice';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme, getThemeColors } from '@/contexts/ThemeContext';

interface TargetManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTargetComplete?: () => void;
}

export const TargetManagementModal = ({ open, onOpenChange, onTargetComplete }: TargetManagementModalProps) => {
  const { targets, addTarget, updateTarget, deleteTarget } = usePractice();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTarget, setEditingTarget] = useState<PracticeTarget | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    targetType: 'Daily' as 'Daily' | 'Weekly' | 'Monthly',
    subject: 'All',
    questionsTarget: 10,
    timeTarget: 60,
    startDate: new Date(),
    endDate: new Date()
  });

  const resetForm = () => {
    setFormData({
      targetType: 'Daily',
      subject: 'All',
      questionsTarget: 10,
      timeTarget: 60,
      startDate: new Date(),
      endDate: new Date()
    });
    setShowCreateForm(false);
    setEditingTarget(null);
  };

  const getEndDate = (startDate: Date, targetType: string) => {
    const end = new Date(startDate);
    switch (targetType) {
      case 'Daily':
        return end;
      case 'Weekly':
        end.setDate(end.getDate() + 6);
        return end;
      case 'Monthly':
        end.setMonth(end.getMonth() + 1);
        end.setDate(end.getDate() - 1);
        return end;
      default:
        return end;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endDate = getEndDate(formData.startDate, formData.targetType);
      
      if (editingTarget) {
        await updateTarget(editingTarget.id, {
          target_type: formData.targetType,
          subject: formData.subject,
          questions_target: formData.questionsTarget,
          time_target: formData.timeTarget,
          start_date: formData.startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        });
      } else {
        await addTarget({
          target_type: formData.targetType,
          subject: formData.subject,
          questions_target: formData.questionsTarget,
          time_target: formData.timeTarget,
          start_date: formData.startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
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
      endDate: new Date(target.end_date)
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

  const activeTargets = targets.filter(target => {
    const today = new Date().toISOString().split('T')[0];
    return target.start_date <= today && target.end_date >= today;
  });

  const upcomingTargets = targets.filter(target => {
    const today = new Date().toISOString().split('T')[0];
    return target.start_date > today;
  });

  const expiredTargets = targets.filter(target => {
    const today = new Date().toISOString().split('T')[0];
    return target.end_date < today;
  });

  const getTargetTypeColor = (type: string) => {
    switch (type) {
      case 'Daily': return 'bg-green-100 text-green-700 border-green-300';
      case 'Weekly': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Monthly': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Physics': return 'bg-blue-50 text-blue-700';
      case 'Chemistry': return 'bg-green-50 text-green-700';
      case 'Mathematics': return 'bg-purple-50 text-purple-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
              <Target className="h-5 w-5 text-white" />
            </div>
            Target Management
          </DialogTitle>
          <DialogDescription className="text-base">
            Create, edit, and manage your practice targets to stay motivated and track progress.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create/Edit Target Form */}
          {showCreateForm ? (
            <Card className={`${themeColors.glow} border-2 border-indigo-200 dark:border-indigo-800`}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {editingTarget ? 'Edit Target' : 'Create New Target'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targetType" className="text-sm font-medium">Target Type</Label>
                      <Select 
                        value={formData.targetType} 
                        onValueChange={(value) => setFormData({ ...formData, targetType: value as any })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select target type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Daily">📅 Daily Target</SelectItem>
                          <SelectItem value="Weekly">🗓️ Weekly Target</SelectItem>
                          <SelectItem value="Monthly">📆 Monthly Target</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                      <Select 
                        value={formData.subject} 
                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">🎯 All Subjects</SelectItem>
                          <SelectItem value="Physics">⚛️ Physics</SelectItem>
                          <SelectItem value="Chemistry">🧪 Chemistry</SelectItem>
                          <SelectItem value="Mathematics">📐 Mathematics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="questionsTarget" className="text-sm font-medium">Questions Target</Label>
                      <Input
                        id="questionsTarget"
                        type="number"
                        value={formData.questionsTarget}
                        onChange={(e) => setFormData({ ...formData, questionsTarget: Number(e.target.value) })}
                        min="1"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="timeTarget" className="text-sm font-medium">Time Target (minutes)</Label>
                      <Input
                        id="timeTarget"
                        type="number"
                        value={formData.timeTarget}
                        onChange={(e) => setFormData({ ...formData, timeTarget: Number(e.target.value) })}
                        min="1"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal mt-1"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(formData.startDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      {isSubmitting ? "Saving..." : editingTarget ? "Update Target" : "Create Target"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Button
              onClick={() => setShowCreateForm(true)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 py-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Target
            </Button>
          )}

          {/* Active Targets */}
          {activeTargets.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                Active Targets ({activeTargets.length})
              </h3>
              <div className="space-y-3">
                {activeTargets.map((target) => (
                  <Card key={target.id} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={getTargetTypeColor(target.target_type)}>
                            {target.target_type}
                          </Badge>
                          <Badge variant="outline" className={getSubjectColor(target.subject)}>
                            {target.subject}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(target)}
                            className="h-8 w-8 p-0 hover:bg-blue-100"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(target.id)}
                            className="h-8 w-8 p-0 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-gray-500" />
                          <span>{target.questions_target} questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{target.time_target} minutes</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(target.start_date), 'MMM dd')} - {format(new Date(target.end_date), 'MMM dd, yyyy')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Targets */}
          {upcomingTargets.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Upcoming Targets ({upcomingTargets.length})
              </h3>
              <div className="space-y-3">
                {upcomingTargets.map((target) => (
                  <Card key={target.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={getTargetTypeColor(target.target_type)}>
                            {target.target_type}
                          </Badge>
                          <Badge variant="outline" className={getSubjectColor(target.subject)}>
                            {target.subject}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(target)}
                            className="h-8 w-8 p-0 hover:bg-blue-100"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(target.id)}
                            className="h-8 w-8 p-0 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-gray-500" />
                          <span>{target.questions_target} questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{target.time_target} minutes</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Starts {format(new Date(target.start_date), 'MMM dd, yyyy')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Expired Targets */}
          {expiredTargets.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                Expired Targets ({expiredTargets.length})
              </h3>
              <div className="space-y-3">
                {expiredTargets.slice(0, 3).map((target) => (
                  <Card key={target.id} className="border-l-4 border-l-gray-400 opacity-75 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={getTargetTypeColor(target.target_type)}>
                            {target.target_type}
                          </Badge>
                          <Badge variant="outline" className={getSubjectColor(target.subject)}>
                            {target.subject}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(target.id)}
                          className="h-8 w-8 p-0 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-gray-500" />
                          <span>{target.questions_target} questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{target.time_target} minutes</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Expired on {format(new Date(target.end_date), 'MMM dd, yyyy')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* No Targets Message */}
          {activeTargets.length === 0 && upcomingTargets.length === 0 && expiredTargets.length === 0 && !showCreateForm && (
            <div className="text-center py-12">
              <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Targets Created</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first target to start tracking your practice goals and stay motivated on your learning journey.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
