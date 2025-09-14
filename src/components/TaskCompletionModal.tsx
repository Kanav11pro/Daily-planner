import React, { useState } from 'react';
import { X, CheckCircle, Clock, Target, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useQuickTags, QuickTag, PracticeConfig } from '@/hooks/useQuickTags';
import { usePractice } from '@/hooks/usePractice';
import { useTasks } from '@/hooks/useTasks';

interface Task {
  id: string;
  title: string;
  description?: string;
  subject: string;
  chapter?: string;
  tag_ids: string[];
  study_nature?: string;
  duration?: number;
  scheduled_date: string;
  completed: boolean;
  priority?: string;
}

interface TaskCompletionModalProps {
  task: Task;
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface PracticeSessionData {
  source: string;
  sourceDetails: string;
  questionsTarget: number;
  questionsSolved: number;
  timeSpent: number;
  difficultyLevel: string;
  accuracyPercentage: number;
  notes: string;
}

export const TaskCompletionModal: React.FC<TaskCompletionModalProps> = ({
  task,
  open,
  onClose,
  onComplete,
}) => {
  const { tags } = useQuickTags();
  const { addSession } = usePractice();
  const { updateTask } = useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [practiceData, setPracticeData] = useState<PracticeSessionData>({
    source: '',
    sourceDetails: '',
    questionsTarget: 0,
    questionsSolved: 0,
    timeSpent: task.duration || 0,
    difficultyLevel: 'Medium',
    accuracyPercentage: 0,
    notes: ''
  });
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  // Get practice tags for this task
  const practiceTagsForTask = task.tag_ids
    .map(tagId => tags.find(tag => tag.id === tagId))
    .filter((tag): tag is QuickTag => tag !== undefined && tag.study_nature === 'Practice');

  const isPracticeTask = practiceTagsForTask.length > 0;

  // Get available sources from practice tags
  const getAvailableSources = (): Record<string, string[]> => {
    const allSources: Record<string, string[]> = {};
    
    practiceTagsForTask.forEach(tag => {
      if (tag.practice_config?.sources) {
        Object.entries(tag.practice_config.sources).forEach(([sourceType, details]) => {
          if (!allSources[sourceType]) {
            allSources[sourceType] = [];
          }
          allSources[sourceType] = [...new Set([...allSources[sourceType], ...details])];
        });
      }
    });

    // Default sources if none configured
    if (Object.keys(allSources).length === 0) {
      return {
        Module: ['Ex 1', 'Ex 1A', 'Ex 2', 'Ex 2A', 'Ex 3', 'Ex 3A', 'Misc'],
        PYQs: ['Mains', 'Advanced'],
        CPPs: ['Core Practice Problems'],
        'Reference Books': ['NCERT Questions'],
        Custom: []
      };
    }

    return allSources;
  };

  const availableSources = getAvailableSources();

  const handleSourceSelect = (source: string) => {
    setSelectedSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
    
    // Reset source details when changing sources
    if (!selectedSources.includes(source)) {
      setPracticeData(prev => ({ ...prev, source, sourceDetails: '' }));
    }
  };

  const handleSimpleCompletion = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await updateTask(task.id, { 
        completed: true,
        ...(notes && { description: task.description ? `${task.description}\n\nCompletion Notes: ${notes}` : `Completion Notes: ${notes}` })
      });
      
      toast({
        title: "Task Completed!",
        description: `Great work on completing "${task.title}"`,
      });
      
      onComplete();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePracticeCompletion = async () => {
    if (isSubmitting) return;
    
    if (selectedSources.length === 0 || !practiceData.sourceDetails) {
      toast({
        title: "Missing Information",
        description: "Please select at least one source and provide source details.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Add practice session for each selected source
      for (const source of selectedSources) {
        await addSession({
          date: task.scheduled_date,
          subject: task.subject as any,
          chapter: task.chapter || '',
          source: source as any,
          source_details: practiceData.sourceDetails,
          questions_target: practiceData.questionsTarget,
          questions_solved: practiceData.questionsSolved,
          time_spent: practiceData.timeSpent,
          difficulty_level: practiceData.difficultyLevel as any || undefined,
          accuracy_percentage: practiceData.accuracyPercentage || undefined,
          notes: practiceData.notes || undefined,
        });
      }

      // Mark task as completed
      await updateTask(task.id, { 
        completed: true,
        ...(practiceData.notes && { 
          description: task.description 
            ? `${task.description}\n\nPractice Notes: ${practiceData.notes}` 
            : `Practice Notes: ${practiceData.notes}` 
        })
      });
      
      toast({
        title: "Practice Session Logged!",
        description: `Great work! Your practice session for "${task.title}" has been logged.`,
      });
      
      onComplete();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log practice session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSimpleCompletion = () => (
    <div className="space-y-4">
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Mark Task as Complete</h3>
        <p className="text-sm text-muted-foreground">
          Great job! You're about to complete "{task.title}"
        </p>
      </div>

      <div>
        <Label htmlFor="notes">Completion Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any notes about what you accomplished..."
          rows={3}
          className="mt-2"
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSimpleCompletion} className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Completing...' : 'Complete Task'}
        </Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );

  const renderPracticeCompletion = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Target className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Log Practice Session</h3>
        <p className="text-sm text-muted-foreground">
          {task.subject} • {task.chapter}
        </p>
        <div className="flex flex-wrap gap-1 mt-2 justify-center">
          {practiceTagsForTask.map(tag => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Source Selection */}
      <div>
        <Label className="text-base font-medium mb-3 block">Practice Sources</Label>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(availableSources).map((source) => (
            <button
              key={source}
              type="button"
              onClick={() => handleSourceSelect(source)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                selectedSources.includes(source)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-sm font-medium">{source}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Source Details */}
      {selectedSources.length > 0 && (
        <div>
          <Label className="text-base font-medium mb-3 block">Source Details</Label>
          {selectedSources[0] !== 'Custom' ? (
            <div className="grid grid-cols-2 gap-2">
              {availableSources[selectedSources[0]]?.map((detail) => (
                <button
                  key={detail}
                  type="button"
                  onClick={() => setPracticeData(prev => ({ ...prev, sourceDetails: detail }))}
                  className={`p-2 rounded border-2 transition-all text-sm ${
                    practiceData.sourceDetails === detail
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {detail}
                </button>
              ))}
            </div>
          ) : (
            <Input
              value={practiceData.sourceDetails}
              onChange={(e) => setPracticeData(prev => ({ ...prev, sourceDetails: e.target.value }))}
              placeholder="Specify the source..."
            />
          )}
        </div>
      )}

      {/* Practice Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="questionsTarget">Target Questions</Label>
          <Input
            id="questionsTarget"
            type="number"
            value={practiceData.questionsTarget || ''}
            onChange={(e) => setPracticeData(prev => ({ ...prev, questionsTarget: Number(e.target.value) }))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="questionsSolved">Questions Solved</Label>
          <Input
            id="questionsSolved"
            type="number"
            value={practiceData.questionsSolved || ''}
            onChange={(e) => setPracticeData(prev => ({ ...prev, questionsSolved: Number(e.target.value) }))}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="timeSpent">Time Spent (minutes)</Label>
          <Input
            id="timeSpent"
            type="number"
            value={practiceData.timeSpent || ''}
            onChange={(e) => setPracticeData(prev => ({ ...prev, timeSpent: Number(e.target.value) }))}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Difficulty Level</Label>
          <Select 
            value={practiceData.difficultyLevel} 
            onValueChange={(value) => setPracticeData(prev => ({ ...prev, difficultyLevel: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
              <SelectItem value="Mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="accuracyPercentage">Accuracy (%)</Label>
        <Input
          id="accuracyPercentage"
          type="number"
          value={practiceData.accuracyPercentage || ''}
          onChange={(e) => setPracticeData(prev => ({ ...prev, accuracyPercentage: Number(e.target.value) }))}
          className="mt-1"
          min="0"
          max="100"
        />
      </div>

      <div>
        <Label htmlFor="practiceNotes">Notes (Optional)</Label>
        <Textarea
          id="practiceNotes"
          value={practiceData.notes}
          onChange={(e) => setPracticeData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Any observations, difficulties, or insights..."
          rows={3}
          className="mt-1"
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handlePracticeCompletion} className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Logging Session...' : 'Log Practice & Complete'}
        </Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isPracticeTask ? (
              <>
                <Target className="h-5 w-5 text-blue-500" />
                Complete Practice Task
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                Complete Task
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {isPracticeTask ? renderPracticeCompletion() : renderSimpleCompletion()}
      </DialogContent>
    </Dialog>
  );
};