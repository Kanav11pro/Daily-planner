import { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { usePractice, PracticeSession } from "@/hooks/usePractice";

interface EditPracticeSessionModalProps {
  session: PracticeSession | null;
  open: boolean;
  onClose: () => void;
  onSessionUpdated?: () => void;
}

export const EditPracticeSessionModal = ({ session, open, onClose, onSessionUpdated }: EditPracticeSessionModalProps) => {
  const { updateSession } = usePractice();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date(),
    subject: '' as 'Physics' | 'Chemistry' | 'Mathematics',
    chapter: '',
    source: '' as 'Module' | 'PYQs' | 'CPPs' | 'NCERT' | 'Other',
    sourceDetails: '',
    questionsTarget: 0,
    questionsSolved: 0,
    timeSpent: 0,
    difficultyLevel: '' as 'Easy' | 'Medium' | 'Hard' | 'Mixed',
    accuracyPercentage: 0,
    notes: ''
  });

  useEffect(() => {
    if (session) {
      setFormData({
        date: new Date(session.date),
        subject: session.subject,
        chapter: session.chapter,
        source: session.source,
        sourceDetails: session.source_details || '',
        questionsTarget: session.questions_target,
        questionsSolved: session.questions_solved,
        timeSpent: session.time_spent,
        difficultyLevel: session.difficulty_level || '' as any,
        accuracyPercentage: session.accuracy_percentage || 0,
        notes: session.notes || ''
      });
    }
  }, [session]);

  const handleSubmit = async () => {
    if (!session) return;

    try {
      setIsSubmitting(true);
      
      await updateSession(session.id, {
        date: formData.date.toISOString().split('T')[0],
        subject: formData.subject,
        chapter: formData.chapter,
        source: formData.source,
        source_details: formData.sourceDetails || undefined,
        questions_target: formData.questionsTarget,
        questions_solved: formData.questionsSolved,
        time_spent: formData.timeSpent,
        difficulty_level: formData.difficultyLevel || undefined,
        accuracy_percentage: formData.accuracyPercentage || undefined,
        notes: formData.notes || undefined,
      });

      if (onSessionUpdated) {
        onSessionUpdated();
      }

      onClose();
    } catch (error) {
      console.error('Error updating practice session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open || !session) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Save className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Edit Practice Session
              </h2>
              <p className="text-sm text-gray-600">{formData.subject} - {formData.chapter}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* Date */}
            <div>
              <Label htmlFor="date" className="text-sm font-medium text-gray-700 mb-2 block">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData({ ...formData, date })}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Subject & Chapter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-2 block">Subject</Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value as any })}>
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
              <div>
                <Label htmlFor="chapter" className="text-sm font-medium text-gray-700 mb-2 block">Chapter</Label>
                <Input
                  id="chapter"
                  value={formData.chapter}
                  onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                />
              </div>
            </div>

            {/* Source & Source Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="source" className="text-sm font-medium text-gray-700 mb-2 block">Source</Label>
                <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Module">Module</SelectItem>
                    <SelectItem value="PYQs">PYQs</SelectItem>
                    <SelectItem value="CPPs">CPPs</SelectItem>
                    <SelectItem value="NCERT">NCERT</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sourceDetails" className="text-sm font-medium text-gray-700 mb-2 block">Source Details</Label>
                <Input
                  id="sourceDetails"
                  value={formData.sourceDetails}
                  onChange={(e) => setFormData({ ...formData, sourceDetails: e.target.value })}
                />
              </div>
            </div>

            {/* Questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="questionsTarget" className="text-sm font-medium text-gray-700 mb-2 block">Target Questions</Label>
                <Input
                  id="questionsTarget"
                  type="number"
                  value={formData.questionsTarget}
                  onChange={(e) => setFormData({ ...formData, questionsTarget: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="questionsSolved" className="text-sm font-medium text-gray-700 mb-2 block">Questions Solved</Label>
                <Input
                  id="questionsSolved"
                  type="number"
                  value={formData.questionsSolved}
                  onChange={(e) => setFormData({ ...formData, questionsSolved: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* Time and Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeSpent" className="text-sm font-medium text-gray-700 mb-2 block">Time Spent (minutes)</Label>
                <Input
                  id="timeSpent"
                  type="number"
                  value={formData.timeSpent}
                  onChange={(e) => setFormData({ ...formData, timeSpent: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="difficultyLevel" className="text-sm font-medium text-gray-700 mb-2 block">Difficulty Level</Label>
                <Select value={formData.difficultyLevel} onValueChange={(value) => setFormData({ ...formData, difficultyLevel: value as any })}>
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
            </div>

            {/* Accuracy */}
            <div>
              <Label htmlFor="accuracyPercentage" className="text-sm font-medium text-gray-700 mb-2 block">Accuracy (%)</Label>
              <Input
                id="accuracyPercentage"
                type="number"
                value={formData.accuracyPercentage || ''}
                onChange={(e) => setFormData({ ...formData, accuracyPercentage: Number(e.target.value) })}
                min="0"
                max="100"
              />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-2 block">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 mr-3 transition-all duration-200 hover:scale-[1.02]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-[1.02]"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};
