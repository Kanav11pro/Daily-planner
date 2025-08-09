import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { usePractice } from '@/hooks/usePractice';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface PracticeInputModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSessionComplete?: () => void;
}

export const PracticeInputModal = ({ open, onOpenChange, onSessionComplete }: PracticeInputModalProps) => {
  const { user } = useAuth();
  const { addSession } = usePractice();

  const [date, setDate] = useState<Date>(new Date());
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [source, setSource] = useState('');
  const [sourceDetails, setSourceDetails] = useState('');
  const [questionsTarget, setQuestionsTarget] = useState(0);
  const [questionsSolved, setQuestionsSolved] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [accuracyPercentage, setAccuracyPercentage] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setDate(new Date());
    setSubject('');
    setChapter('');
    setSource('');
    setSourceDetails('');
    setQuestionsTarget(0);
    setQuestionsSolved(0);
    setTimeSpent(0);
    setDifficultyLevel('');
    setAccuracyPercentage(undefined);
    setNotes('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);
      
      await addSession({
        date: date.toISOString().split('T')[0],
        subject: subject as 'Physics' | 'Chemistry' | 'Mathematics',
        chapter,
        source: source as 'Module' | 'PYQs' | 'CPPs' | 'Reference Books' | 'Custom',
        source_details: sourceDetails || undefined,
        questions_target: questionsTarget,
        questions_solved: questionsSolved,
        time_spent: timeSpent,
        difficulty_level: difficultyLevel as 'Easy' | 'Medium' | 'Hard' | 'Mixed' || undefined,
        accuracy_percentage: accuracyPercentage || undefined,
        notes: notes || undefined,
      });

      // Trigger celebration
      if (onSessionComplete) {
        onSessionComplete();
      }

      // Reset form and close modal
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding practice session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Practice Session</DialogTitle>
          <DialogDescription>
            Log your daily practice to track progress and identify areas for improvement.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date > new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="chapter">Chapter</Label>
            <Input
              id="chapter"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source">Source</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Module">Module</SelectItem>
                  <SelectItem value="PYQs">PYQs</SelectItem>
                  <SelectItem value="CPPs">CPPs</SelectItem>
                  <SelectItem value="Reference Books">Reference Books</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sourceDetails">Source Details</Label>
              <Input
                id="sourceDetails"
                value={sourceDetails}
                onChange={(e) => setSourceDetails(e.target.value)}
                disabled={source !== 'Custom'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="questionsTarget">Questions Target</Label>
              <Input
                id="questionsTarget"
                type="number"
                value={questionsTarget}
                onChange={(e) => setQuestionsTarget(Number(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="questionsSolved">Questions Solved</Label>
              <Input
                id="questionsSolved"
                type="number"
                value={questionsSolved}
                onChange={(e) => setQuestionsSolved(Number(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="timeSpent">Time Spent (minutes)</Label>
              <Input
                id="timeSpent"
                type="number"
                value={timeSpent}
                onChange={(e) => setTimeSpent(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difficultyLevel">Difficulty Level</Label>
              <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                <SelectTrigger>
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

            <div>
              <Label htmlFor="accuracyPercentage">Accuracy (%)</Label>
              <Input
                id="accuracyPercentage"
                type="number"
                value={accuracyPercentage || ''}
                onChange={(e) => setAccuracyPercentage(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Add Session"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
