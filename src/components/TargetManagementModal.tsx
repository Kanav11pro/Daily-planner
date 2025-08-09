
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Target, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { usePractice } from '@/hooks/usePractice';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TargetManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTargetComplete?: () => void;
}

export const TargetManagementModal = ({ open, onOpenChange, onTargetComplete }: TargetManagementModalProps) => {
  const { targets, addTarget } = usePractice();
  const [showCreateForm, setShowCreateForm] = useState(false);
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
      
      await addTarget({
        target_type: formData.targetType,
        subject: formData.subject,
        questions_target: formData.questionsTarget,
        time_target: formData.timeTarget,
        start_date: formData.startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      });

      if (onTargetComplete) {
        onTargetComplete();
      }

      resetForm();
    } catch (error) {
      console.error('Error creating target:', error);
    } finally {
      setIsSubmitting(false);
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

  const getTargetTypeColor = (type: string) => {
    switch (type) {
      case 'Daily': return 'bg-green-100 text-green-700';
      case 'Weekly': return 'bg-blue-100 text-blue-700';
      case 'Monthly': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Target Management
          </DialogTitle>
          <DialogDescription>
            Create and manage your practice targets to stay motivated and track progress.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create New Target Button */}
          {!showCreateForm && (
            <Button
              onClick={() => setShowCreateForm(true)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Target
            </Button>
          )}

          {/* Create Target Form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create New Target</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targetType">Target Type</Label>
                      <Select 
                        value={formData.targetType} 
                        onValueChange={(value) => setFormData({ ...formData, targetType: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select target type" />
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
                      <Select 
                        value={formData.subject} 
                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      >
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="questionsTarget">Questions Target</Label>
                      <Input
                        id="questionsTarget"
                        type="number"
                        value={formData.questionsTarget}
                        onChange={(e) => setFormData({ ...formData, questionsTarget: Number(e.target.value) })}
                        min="1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="timeTarget">Time Target (minutes)</Label>
                      <Input
                        id="timeTarget"
                        type="number"
                        value={formData.timeTarget}
                        onChange={(e) => setFormData({ ...formData, timeTarget: Number(e.target.value) })}
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
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

                  <div className="flex space-x-3">
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
                      {isSubmitting ? "Creating..." : "Create Target"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Active Targets */}
          {activeTargets.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                Active Targets ({activeTargets.length})
              </h3>
              <div className="space-y-3">
                {activeTargets.map((target) => (
                  <Card key={target.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getTargetTypeColor(target.target_type)}>
                            {target.target_type}
                          </Badge>
                          <span className="font-medium">{target.subject}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(target.start_date), 'MMM dd')} - {format(new Date(target.end_date), 'MMM dd')}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-gray-500" />
                          <span>{target.questions_target} questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{target.time_target} minutes</span>
                        </div>
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
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Upcoming Targets ({upcomingTargets.length})
              </h3>
              <div className="space-y-3">
                {upcomingTargets.map((target) => (
                  <Card key={target.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getTargetTypeColor(target.target_type)}>
                            {target.target_type}
                          </Badge>
                          <span className="font-medium">{target.subject}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Starts {format(new Date(target.start_date), 'MMM dd')}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-gray-500" />
                          <span>{target.questions_target} questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{target.time_target} minutes</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* No Targets Message */}
          {activeTargets.length === 0 && upcomingTargets.length === 0 && !showCreateForm && (
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Targets Created</h3>
              <p className="text-gray-600 mb-4">
                Create your first target to start tracking your practice goals.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
