
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, Calendar, BookOpen, FileText, Clock, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { PracticeSession } from '@/hooks/usePractice';

interface AddPracticeSessionModalProps {
  onAddSession: (session: Omit<PracticeSession, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  chapters: any[];
}

const DIFFICULTY_MAP: Record<string, string> = {
  'Module-Ex 1': 'Easy',
  'Module-Ex 1A': 'Medium', 
  'Module-Ex 2': 'Mixed',
  'Module-Ex 2A': 'Hard',
  'PYQs-Mains': 'Hard',
  'PYQs-Advance': 'Hard',
  'CPPs-Core Practice Problems': 'Easy',
  'NCERT': 'Medium'
};

const QUICK_QUESTIONS = [10, 20, 30, 50, 75, 100];
const QUICK_TIME = [30, 60, 90, 120, 150, 180];

export const AddPracticeSessionModal = ({ onAddSession, chapters }: AddPracticeSessionModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionData, setSessionData] = useState({
    date: new Date().toISOString().split('T')[0],
    subject: '',
    chapter: '',
    source: '',
    source_details: '',
    questions_target: 0,
    questions_solved: 0,
    time_spent: 0,
    difficulty_level: '',
    accuracy_percentage: 0,
    notes: ''
  });

  const [customQuestions, setCustomQuestions] = useState(0);
  const [customTime, setCustomTime] = useState(0);
  const [showCustomQuestions, setShowCustomQuestions] = useState(false);
  const [showCustomTime, setShowCustomTime] = useState(false);

  const subjects = ['Physics', 'Chemistry', 'Mathematics'];
  const sources = ['Module', 'PYQs', 'CPPs', 'NCERT', 'Other'];
  
  const getSourceDetails = (source: string) => {
    switch (source) {
      case 'Module': return ['Ex 1', 'Ex 1A', 'Ex 2', 'Ex 2A'];
      case 'PYQs': return ['Mains', 'Advance'];
      case 'CPPs': return ['Core Practice Problems'];
      case 'NCERT': return [];
      case 'Other': return ['Custom'];
      default: return [];
    }
  };

  const updateDifficulty = (source: string, sourceDetails: string) => {
    const key = sourceDetails ? `${source}-${sourceDetails}` : source;
    const difficulty = DIFFICULTY_MAP[key] || 'Medium';
    setSessionData(prev => ({ ...prev, difficulty_level: difficulty }));
  };

  const getDateLabel = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    if (date === today) return 'Today';
    if (date === yesterday) return 'Yesterday';
    if (date === tomorrow) return 'Tomorrow';
    return new Date(date).toLocaleDateString();
  };

  const handleSubmit = () => {
    onAddSession({
      ...sessionData,
      questions_target: sessionData.questions_solved // Set target same as solved
    });
    setIsOpen(false);
    setCurrentStep(1);
    setSessionData({
      date: new Date().toISOString().split('T')[0],
      subject: '',
      chapter: '',
      source: '',
      source_details: '',
      questions_target: 0,
      questions_solved: 0,
      time_spent: 0,
      difficulty_level: '',
      accuracy_percentage: 0,
      notes: ''
    });
    setShowCustomQuestions(false);
    setShowCustomTime(false);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">When did you practice?</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], label: 'Yesterday' },
                  { value: new Date().toISOString().split('T')[0], label: 'Today' },
                  { value: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], label: 'Tomorrow' }
                ].map(option => (
                  <Button
                    key={option.value}
                    variant={sessionData.date === option.value ? "default" : "outline"}
                    onClick={() => setSessionData(prev => ({ ...prev, date: option.value }))}
                    className="h-12"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <Label>Custom Date</Label>
                <Input
                  type="date"
                  value={sessionData.date}
                  onChange={(e) => setSessionData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold">Subject</Label>
              <div className="grid grid-cols-3 gap-3">
                {subjects.map(subject => (
                  <Button
                    key={subject}
                    variant={sessionData.subject === subject ? "default" : "outline"}
                    onClick={() => setSessionData(prev => ({ ...prev, subject, chapter: '' }))}
                    className="h-12"
                  >
                    {subject}
                  </Button>
                ))}
              </div>
            </div>

            {sessionData.subject && (
              <div className="space-y-4">
                <Label className="text-base font-semibold">Chapter</Label>
                <Select value={sessionData.chapter} onValueChange={(value) => 
                  setSessionData(prev => ({ ...prev, chapter: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters
                      .filter(ch => ch.subject === sessionData.subject)
                      .map(chapter => (
                        <SelectItem key={chapter.id} value={chapter.chapter_name}>
                          {chapter.chapter_name}
                        </SelectItem>
                      ))}
                    <SelectItem value="other">Other (specify in notes)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">Source</Label>
              <div className="grid grid-cols-2 gap-3">
                {sources.map(source => (
                  <Button
                    key={source}
                    variant={sessionData.source === source ? "default" : "outline"}
                    onClick={() => {
                      setSessionData(prev => ({ ...prev, source, source_details: '' }));
                    }}
                    className="h-12"
                  >
                    {source}
                  </Button>
                ))}
              </div>
            </div>

            {sessionData.source && getSourceDetails(sessionData.source).length > 0 && (
              <div className="space-y-4">
                <Label className="text-base font-semibold">Source Details</Label>
                {sessionData.source === 'Other' ? (
                  <Input
                    placeholder="Specify source details"
                    value={sessionData.source_details}
                    onChange={(e) => {
                      setSessionData(prev => ({ ...prev, source_details: e.target.value }));
                      updateDifficulty(sessionData.source, e.target.value);
                    }}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {getSourceDetails(sessionData.source).map(detail => (
                      <Button
                        key={detail}
                        variant={sessionData.source_details === detail ? "default" : "outline"}
                        onClick={() => {
                          setSessionData(prev => ({ ...prev, source_details: detail }));
                          updateDifficulty(sessionData.source, detail);
                        }}
                        className="h-12"
                      >
                        {detail}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {sessionData.source && sessionData.source !== 'Other' && getSourceDetails(sessionData.source).length === 0 && (
              updateDifficulty(sessionData.source, '')
            )}

            {sessionData.difficulty_level && (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Auto-detected Difficulty</Badge>
                    <Badge variant={
                      sessionData.difficulty_level === 'Easy' ? 'default' :
                      sessionData.difficulty_level === 'Medium' ? 'secondary' :
                      sessionData.difficulty_level === 'Hard' ? 'destructive' : 'outline'
                    }>
                      {sessionData.difficulty_level}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">Questions Solved</Label>
              <div className="grid grid-cols-3 gap-3">
                {QUICK_QUESTIONS.map(count => (
                  <Button
                    key={count}
                    variant={sessionData.questions_solved === count ? "default" : "outline"}
                    onClick={() => {
                      setSessionData(prev => ({ ...prev, questions_solved: count }));
                      setShowCustomQuestions(false);
                    }}
                    className="h-12"
                  >
                    {count}
                  </Button>
                ))}
              </div>
              <Button
                variant={showCustomQuestions ? "default" : "outline"}
                onClick={() => setShowCustomQuestions(!showCustomQuestions)}
                className="w-full"
              >
                Custom Amount
              </Button>
              {showCustomQuestions && (
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customQuestions}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setCustomQuestions(value);
                      setSessionData(prev => ({ ...prev, questions_solved: value }));
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold">Time Spent (minutes)</Label>
              <div className="grid grid-cols-3 gap-3">
                {QUICK_TIME.map(time => (
                  <Button
                    key={time}
                    variant={sessionData.time_spent === time ? "default" : "outline"}
                    onClick={() => {
                      setSessionData(prev => ({ ...prev, time_spent: time }));
                      setShowCustomTime(false);
                    }}
                    className="h-12"
                  >
                    {time}m
                  </Button>
                ))}
              </div>
              <Button
                variant={showCustomTime ? "default" : "outline"}
                onClick={() => setShowCustomTime(!showCustomTime)}
                className="w-full"
              >
                Custom Time
              </Button>
              {showCustomTime && (
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Enter time in minutes"
                    value={customTime}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setCustomTime(value);
                      setSessionData(prev => ({ ...prev, time_spent: value }));
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">Accuracy (Optional)</Label>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Enter accuracy percentage"
                  max="100"
                  min="0"
                  value={sessionData.accuracy_percentage || ''}
                  onChange={(e) => setSessionData(prev => ({ 
                    ...prev, 
                    accuracy_percentage: parseFloat(e.target.value) || 0 
                  }))}
                />
                <p className="text-sm text-muted-foreground">
                  How accurate were you? (0-100%)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold">Notes (Optional)</Label>
              <textarea
                className="w-full p-3 border rounded-md resize-none"
                rows={4}
                placeholder="Any additional notes about this session..."
                value={sessionData.notes}
                onChange={(e) => setSessionData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <Card>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Session Summary</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Date:</strong> {getDateLabel(sessionData.date)}</p>
                    <p><strong>Subject:</strong> {sessionData.subject}</p>
                    <p><strong>Chapter:</strong> {sessionData.chapter}</p>
                    <p><strong>Source:</strong> {sessionData.source} {sessionData.source_details && `- ${sessionData.source_details}`}</p>
                    <p><strong>Questions:</strong> {sessionData.questions_solved}</p>
                    <p><strong>Time:</strong> {sessionData.time_spent} minutes</p>
                    <p><strong>Difficulty:</strong> {sessionData.difficulty_level}</p>
                    {sessionData.accuracy_percentage > 0 && (
                      <p><strong>Accuracy:</strong> {sessionData.accuracy_percentage}%</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return sessionData.date && sessionData.subject && sessionData.chapter;
      case 2:
        return sessionData.source && (
          sessionData.source === 'NCERT' || 
          sessionData.source_details || 
          (sessionData.source === 'Other' && sessionData.source_details)
        );
      case 3:
        return sessionData.questions_solved > 0 && sessionData.time_spent > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Practice Session
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Add Practice Session
          </DialogTitle>
          <Progress value={(currentStep / 4) * 100} className="w-full" />
        </DialogHeader>
        
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          {currentStep < 4 ? (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!isStepValid()}>
              Add Session
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
