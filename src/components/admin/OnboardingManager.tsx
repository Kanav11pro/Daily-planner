
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit2, Trash2, HelpCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface OnboardingQuestion {
  id: string;
  question: string;
  options: string[];
  type: 'single' | 'multiple';
}

const DEFAULT_QUESTIONS: OnboardingQuestion[] = [
  {
    id: '1',
    question: 'Which exam are you preparing for?',
    options: ['JEE Main', 'JEE Advanced', 'NEET', 'CET', 'BITSAT', 'Other'],
    type: 'single'
  },
  {
    id: '2',
    question: 'What is your current institute?',
    options: ['Allen', 'Aakash', 'FIITJEE', 'Resonance', 'Unacademy', 'Self-Study', 'Others'],
    type: 'single'
  },
  {
    id: '3',
    question: 'How many hours do you study daily?',
    options: ['2-4 hours', '4-6 hours', '6-8 hours', '8-10 hours', '10+ hours'],
    type: 'single'
  }
];

export const OnboardingManager = () => {
  const [questions, setQuestions] = useState<OnboardingQuestion[]>(DEFAULT_QUESTIONS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: [''],
    type: 'single' as 'single' | 'multiple'
  });
  const { toast } = useToast();

  const handleAddOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, '']
    });
  };

  const handleRemoveOption = (index: number) => {
    setNewQuestion({
      ...newQuestion,
      options: newQuestion.options.filter((_, i) => i !== index)
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions
    });
  };

  const handleSaveQuestion = () => {
    if (!newQuestion.question.trim() || newQuestion.options.some(opt => !opt.trim())) {
      toast({
        title: "Invalid Question",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    const question: OnboardingQuestion = {
      id: Date.now().toString(),
      question: newQuestion.question.trim(),
      options: newQuestion.options.filter(opt => opt.trim()),
      type: newQuestion.type
    };

    setQuestions([...questions, question]);
    setNewQuestion({ question: '', options: [''], type: 'single' });
    setIsAdding(false);

    toast({
      title: "Question Added",
      description: "Onboarding question has been added successfully.",
    });
  };

  const handleDelete = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    toast({
      title: "Question Deleted",
      description: "Question has been removed from onboarding.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Onboarding Quiz Management</h2>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Question
              </label>
              <Textarea
                placeholder="Enter your question"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Options
              </label>
              <div className="space-y-2">
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                    {newQuestion.options.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveOption(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddOption}>
                  Add Option
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveQuestion}>Save Question</Button>
              <Button onClick={() => setIsAdding(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Question {index + 1}
                </CardTitle>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(question.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="font-medium text-gray-900 dark:text-white">
                  {question.question}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className="p-2 bg-gray-50 dark:bg-slate-800 rounded text-sm"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
